
import { User, Role, Batch, Stage, IoTData, StageName } from '../types';

// Mock Users
export const MOCK_USERS: User[] = [
  { id: 'user-farmer-1', name: 'Alice Farmer', email: 'farmer@test.com', role: Role.FARMER },
  { id: 'user-dist-1', name: 'Bob Distributor', email: 'distributor@test.com', role: Role.DISTRIBUTOR },
  { id: 'user-consumer-1', name: 'Charlie Consumer', email: 'consumer@test.com', role: Role.CONSUMER },
];

// Mock Batches
let MOCK_BATCHES: Batch[] = [
  {
    id: 'B001',
    cropType: 'Organic Tomatoes',
    farmerId: 'user-farmer-1',
    farmerName: 'Alice Farmer',
    farmLocation: 'Green Valley Farms, CA',
    qrCodeUrl: `#/consumer/B001`,
    currentStage: StageName.AT_CONSUMER,
    iotSensorId: 'SENSOR-A1',
    history: [
      { name: StageName.HARVESTED, timestamp: '2023-10-25T08:00:00Z', actor: 'Alice Farmer', details: { quantity: '500 kg' }, txHash: '0xabc...123' },
      { name: StageName.IN_TRANSIT, timestamp: '2023-10-25T14:00:00Z', actor: 'Speedy Logistics', details: { vehicleId: 'TRUCK-01' }, txHash: '0xdef...456' },
      { name: StageName.AT_DISTRIBUTOR, timestamp: '2023-10-26T09:00:00Z', actor: 'Bob Distributor', details: { warehouse: 'Central Hub' }, txHash: '0xghi...789' },
      { name: StageName.IN_TRANSIT_TO_CONSUMER, timestamp: '2023-10-26T18:00:00Z', actor: 'Speedy Logistics', details: { vehicleId: 'TRUCK-05' }, txHash: '0xjkl...012' },
      { name: StageName.AT_CONSUMER, timestamp: '2023-10-27T10:00:00Z', actor: 'Charlie Consumer', details: { store: 'Fresh Mart' }, txHash: '0xmno...345' },
    ]
  },
  {
    id: 'B002',
    cropType: 'Golden Apples',
    farmerId: 'user-farmer-1',
    farmerName: 'Alice Farmer',
    farmLocation: 'Sunny Orchard, WA',
    qrCodeUrl: `#/consumer/B002`,
    currentStage: StageName.IN_TRANSIT,
    iotSensorId: 'SENSOR-B2',
    history: [
      { name: StageName.HARVESTED, timestamp: '2023-10-26T11:00:00Z', actor: 'Alice Farmer', details: { quantity: '1200 kg' }, txHash: '0xpqr...678' },
      { name: StageName.IN_TRANSIT, timestamp: '2023-10-26T15:30:00Z', actor: 'Cold Chain Movers', details: { vehicleId: 'REEFER-12' }, txHash: '0xstu...901' },
    ]
  }
];

// Mock IoT Data
const MOCK_IOT_DATA: Record<string, IoTData[]> = {
  'B001': Array.from({ length: 50 }, (_, i) => ({
    timestamp: Date.now() - (50 - i) * 60 * 60 * 1000,
    temperature: 18 + Math.sin(i / 5) * 2 + Math.random() * 0.5,
    humidity: 60 + Math.cos(i / 5) * 5 + Math.random(),
  })),
  'B002': Array.from({ length: 20 }, (_, i) => ({
    timestamp: Date.now() - (20 - i) * 60 * 60 * 1000,
    temperature: 22 + Math.sin(i / 3) * 3 + Math.random() * 0.8,
    humidity: 70 + Math.cos(i / 3) * 8 + Math.random(),
  })),
};

// Simulate API calls
const simulateApiCall = <T,>(data: T, delay = 500): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const login = (email: string, pass: string): Promise<User | null> => {
  console.log(`Attempting login for ${email} with password ${pass}`);
  const user = MOCK_USERS.find(u => u.email === email);
  // In a real app, you'd check the password hash
  return simulateApiCall(user || null);
};

export const getBatchesForUser = (user: User): Promise<Batch[]> => {
  let batches: Batch[] = [];
  switch (user.role) {
    case Role.FARMER:
      batches = MOCK_BATCHES.filter(b => b.farmerId === user.id);
      break;
    case Role.DISTRIBUTOR:
       batches = MOCK_BATCHES.filter(b => b.currentStage >= StageName.IN_TRANSIT);
      break;
    case Role.CONSUMER:
       batches = MOCK_BATCHES.filter(b => b.currentStage >= StageName.IN_TRANSIT_TO_CONSUMER);
      break;
  }
  return simulateApiCall(batches);
};

export const getBatchById = (batchId: string): Promise<Batch | undefined> => {
  const batch = MOCK_BATCHES.find(b => b.id === batchId);
  return simulateApiCall(batch);
};

export const getIotData = (batchId: string): Promise<IoTData[]> => {
  const data = MOCK_IOT_DATA[batchId] || [];
  return simulateApiCall(data);
};

export const addBatch = (cropType: string, farmer: User): Promise<Batch> => {
    const newBatchId = `B${(Math.random() * 1000).toFixed(0).padStart(3, '0')}`;
    const newBatch: Batch = {
        id: newBatchId,
        cropType: cropType,
        farmerId: farmer.id,
        farmerName: farmer.name,
        farmLocation: 'Green Valley Farms, CA', // mock
        qrCodeUrl: `#/consumer/${newBatchId}`,
        currentStage: StageName.HARVESTED,
        iotSensorId: `SENSOR-${(Math.random() * 100).toFixed(0)}`,
        history: [
            {
                name: StageName.HARVESTED,
                timestamp: new Date().toISOString(),
                actor: farmer.name,
                details: { quantity: `${(Math.random() * 500 + 100).toFixed(0)} kg` },
                txHash: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
            }
        ]
    };
    MOCK_BATCHES.push(newBatch);
    MOCK_IOT_DATA[newBatchId] = [];
    return simulateApiCall(newBatch);
}

export const updateBatchStage = (batchId: string, newStage: StageName, actor: User, details: Record<string, any>): Promise<Batch | null> => {
    const batchIndex = MOCK_BATCHES.findIndex(b => b.id === batchId);
    if (batchIndex === -1) {
        return simulateApiCall(null);
    }
    const batch = MOCK_BATCHES[batchIndex];
    batch.currentStage = newStage;
    batch.history.push({
        name: newStage,
        timestamp: new Date().toISOString(),
        actor: actor.name,
        details: details,
        txHash: `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`
    });
    MOCK_BATCHES[batchIndex] = batch;
    return simulateApiCall(batch);
}


// Simulate live IoT data
setInterval(() => {
    Object.keys(MOCK_IOT_DATA).forEach(batchId => {
        if (!MOCK_IOT_DATA[batchId] || MOCK_IOT_DATA[batchId].length === 0) {
          // Initialize if empty
          MOCK_IOT_DATA[batchId] = [{ timestamp: Date.now(), temperature: 20, humidity: 65 }];
        }

        const lastData = MOCK_IOT_DATA[batchId][MOCK_IOT_DATA[batchId].length - 1];
        const lastTemp = lastData ? lastData.temperature : 20;
        const lastHum = lastData ? lastData.humidity : 65;
        
        const newTemp = lastTemp + (Math.random() - 0.5) * 0.2;
        const newHum = lastHum + (Math.random() - 0.5) * 0.5;

        MOCK_IOT_DATA[batchId].push({
            timestamp: Date.now(),
            temperature: parseFloat(newTemp.toFixed(2)),
            humidity: parseFloat(newHum.toFixed(2))
        });

        // Keep the array from growing indefinitely
        if (MOCK_IOT_DATA[batchId].length > 200) {
            MOCK_IOT_DATA[batchId].shift();
        }
    });
}, 5000); // New data every 5 seconds
