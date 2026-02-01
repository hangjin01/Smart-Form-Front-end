export interface SensorData {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    co2: number;
    lightIntensity: number;
    timestamp: string;
}

export interface ControlState {
    irrigation: boolean;
    fan: boolean;
    growLight: boolean;
    windows: boolean;
}

export interface Crop {
    id: string;
    name: string;
    variety: string;
    optimalTemp: string;
    optimalHumidity: string;
    optimalSoil: string;
    optimalCo2: string;
    optimalLux: string;
}

export interface SavedInsight {
    id: string;
    crop: string;
    content: string;
    timestamp: string;
}

export interface WelfarePost {
    id: number;
    type: string;
    title: string;
    dDay: string;
    color: string;
    bg: string;
    border: string;
    date?: string;
    desc?: string;
}

export interface LogEntry {
    id: number;
    type: 'control' | 'system' | 'ai' | 'sensor' | 'warning' | 'user';
    message: string;
    timestamp: string;
    status: 'success' | 'info' | 'warning' | 'error';
}
