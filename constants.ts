
import { BikeData } from './types';

export const HONDA_DREAM_YUGA: BikeData = {
  name: 'Honda Dream Yuga',
  model: '2014, Serviced 2.5 years ago',
  averageMileage: 44,
};

export const BIKE_DATA: BikeData[] = [
  HONDA_DREAM_YUGA,
  { name: 'Hero Splendor Plus', model: '2023', averageMileage: 73 },
  { name: 'Honda Shine', model: '2023', averageMileage: 65 },
  { name: 'Bajaj Pulsar 150', model: '2023', averageMileage: 50 },
  { name: 'TVS Apache RTR 160', model: '2023', averageMileage: 45 },
  { name: 'Royal Enfield Classic 350', model: '2023', averageMileage: 37 },
  { name: 'Yamaha FZ-S FI', model: '2023', averageMileage: 48 },
  { name: 'Bajaj Platina 100', model: '2023', averageMileage: 75 },
  { name: 'Suzuki Gixxer', model: '2023', averageMileage: 45 },
  { name: 'KTM 200 Duke', model: '2023', averageMileage: 35 },
  { name: 'TVS Raider 125', model: '2023', averageMileage: 67 },
];

export const DEFAULT_PETROL_PRICE = 94.48;
export const DEFAULT_REAL_MILEAGE = 55;
export const DEFAULT_DAILY_DISTANCE = 120;
export const TANK_CAPACITY = 8.1; // Liters, for Dream Yuga
