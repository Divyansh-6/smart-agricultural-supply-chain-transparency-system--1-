
export enum Role {
  FARMER = 'FARMER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  RETAILER = 'RETAILER',
  CONSUMER = 'CONSUMER',
  INSPECTOR = 'INSPECTOR',
}

export enum StageName {
  HARVESTED = 'HARVESTED',
  IN_TRANSIT = 'IN_TRANSIT',
  AT_DISTRIBUTOR = 'AT_DISTRIBUTOR',
  IN_TRANSIT_TO_CONSUMER = 'IN_TRANSIT_TO_CONSUMER',
  AT_CONSUMER = 'AT_CONSUMER',
  AVAILABLE_FOR_SALE = 'AVAILABLE_FOR_SALE',
  SOLD = 'SOLD'
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  value: number;
  gasUsed: number;
  status: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  walletAddress?: string;
  publicKey?: string;
}

export interface Stage {
  name: StageName;
  timestamp: string;
  actor: string;
  details: Record<string, any>;
  txHash: string;
  blockchainData?: BlockchainTransaction;
  location?: GeoLocation;
  carbonFootprint?: number;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  timestamp: number;
}

export interface Batch {
  id: string;
  cropType: string;
  farmerId: string;
  farmerName: string;
  farmLocation: string;
  qrCodeUrl: string;
  rfidTag?: string;
  currentStage: StageName;
  history: Stage[];
  iotSensorId: string;
  harvestDate: string;
  expiryDate: string;
  sustainabilityScore?: number;
  carbonFootprint?: number;
  certifications?: string[];
  paymentStatus?: PaymentStatus;
  predictedShelfLife?: number;
  batchWeight: number;
  pricePerUnit: number;
}

export interface IoTData {
  timestamp: number;
  temperature: number;
  humidity: number;
  ethylene?: number;
  co2?: number;
  light?: number;
  vibration?: number;
  gpsLocation?: GeoLocation;
  batteryLevel?: number;
}

export interface SpoilagePrediction {
  batchId: string;
  predictedShelfLife: number;
  spoilageRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  confidenceScore: number;
  contributingFactors: {
    temperature: number;
    humidity: number;
    timeInTransit: number;
    handlingConditions: number;
  };
  recommendedActions: string[];
}

export interface CarbonFootprint {
  batchId: string;
  totalScore: number;
  breakdown: {
    farming: number;
    processing: number;
    packaging: number;
    transportation: number;
    storage: number;
  };
  offsetCredits?: number;
  sustainabilityBadges?: string[];
}

export interface SmartContract {
  contractAddress: string;
  contractType: 'PAYMENT' | 'ESCROW' | 'CERTIFICATION' | 'INSURANCE';
  parties: string[];
  terms: Record<string, any>;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED';
  createdAt: string;
  transactions: BlockchainTransaction[];
}

export interface PaymentStatus {
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  paymentDate?: string;
  transactionId?: string;
  paymentMethod?: string;
  fairTradeVerified?: boolean;
}

export interface Alert {
  id: string;
  batchId: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'LOCATION' | 'TAMPERING' | 'DELAY' | 'SPOILAGE_RISK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: number;
  acknowledged: boolean;
  location?: GeoLocation;
}
