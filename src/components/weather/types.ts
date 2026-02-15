export type WeatherConditionType = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
export type TemperatureUnit = 'C' | 'F';

export interface WeatherCondition {
  type: WeatherConditionType;
  description: string;
}

export interface HourlyForecast {
  time: string; // "2pm", "3pm", etc.
  temperature: number;
  condition: WeatherCondition;
  precipProbability: number; // 0-100
  isNow?: boolean;
}

export interface WeatherDetails {
  uvIndex: number;
  uvDescription: string; // "Low", "Moderate", "High", "Very High", "Extreme"
  visibility: number; // in km or miles
  visibilityUnit: 'km' | 'mi';
  pressure: number; // in hPa
  pressureTrend?: 'rising' | 'falling' | 'steady';
  dewPoint: number;
  cloudCover: number; // 0-100 percentage
  precipProbability: number; // 0-100 percentage
  windDirection: string; // "N", "NE", "E", etc.
  windGust?: number;
}

export interface SunMoonData {
  sunrise: string; // "6:42 AM"
  sunset: string; // "5:28 PM"
  moonrise?: string;
  moonset?: string;
  moonPhase?: string; // "Waxing Crescent", "Full Moon", etc.
  dayLength: string; // "10h 46m"
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  windUnit: 'mph' | 'km/h';
  icon: string;
  forecast: DayForecast[];
  hourlyForecast?: HourlyForecast[];
  details?: WeatherDetails;
  sunMoon?: SunMoonData;
  lastUpdated: string;
  unit: TemperatureUnit;
  timezone?: number; // Timezone offset in seconds
}

export interface DayForecast {
  day: string;
  date?: string; // "Jan 18"
  high: number;
  low: number;
  condition: WeatherCondition;
  icon: string;
  precipProbability?: number;
  sunrise?: string;
  sunset?: string;
}

export interface SavedLocation {
  id: string;
  city: string;
  country?: string;
  isPrimary?: boolean;
}
