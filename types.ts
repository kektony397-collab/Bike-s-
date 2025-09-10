
export enum NavigationTab {
  Home = 'Home',
  FindAverage = 'Find Your Bike Average',
  Dashboard = 'Bike Dashboard',
  AiMode = 'AI Mode',
}

export interface BikeData {
  name: string;
  model: string;
  averageMileage: number; // in km/l
}

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  speed: number | null; // in km/h
  error: string | null;
}
