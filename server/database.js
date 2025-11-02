const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email text UNIQUE,
            password text,
            role text,
            CONSTRAINT email_unique UNIQUE (email)
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                const insert = 'INSERT INTO users (email, password, role) VALUES (?,?,?)';
                db.run(insert, ["admin@example.com", "admin123456", "admin"]);
                db.run(insert, ["user@example.com", "user123456", "user"]);
            }
        });
    }
});


module.exports = db
