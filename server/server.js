const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database.js');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const app = express();
app.use(cors());
app.use(express.json());

// Temporary storage for user registration data with OTP
const tempUsers = {};

// Nodemailer transporter configuration (replace with your actual email service config)
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail', 'hotmail', etc.
    auth: {
        user: process.env.EMAIL_USER, // your email address from environment variables
        pass: process.env.EMAIL_PASS  // your email password or app-specific password from environment variables
    }
});


const PORT = process.env.PORT || 3001;

app.post('/api/register', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password and role are required' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

    // Store user data and OTP temporarily
    tempUsers[email] = { password: hash, role, otp, timestamp: Date.now() };

    // Send OTP email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for AgriChain Registration',
        text: `Your One-Time Password is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Failed to send OTP email. Please configure your email credentials in the environment variables.' });
        }
        console.log('Email sent: ' + info.response);
        res.json({ message: 'OTP sent to your email address. Please verify.' });
    });
});

app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const userData = tempUsers[email];

    if (!userData) {
        return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    // OTP expires after 10 minutes
    if (Date.now() - userData.timestamp > 10 * 60 * 1000) {
        delete tempUsers[email];
        return res.status(400).json({ error: 'OTP has expired' });
    }

    if (otp !== userData.otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    const insert = 'INSERT INTO users (email, password, role) VALUES (?,?,?)';
    db.run(insert, [email, userData.password, userData.role], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        delete tempUsers[email];
        res.json({
            message: "success",
            id: this.lastID
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, row.password);
        if (!passwordIsValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        res.json({
            message: "success",
            user: {
                id: row.id,
                email: row.email,
                role: row.role
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
