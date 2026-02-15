import { NextResponse } from 'next/server';
import type {
  WeatherData,
  DayForecast,
  WeatherCondition,
  TemperatureUnit,
  HourlyForecast,
  WeatherDetails,
  SunMoonData
} from '@/components/weather/types';

// In-memory cache with 30-minute TTL
const cache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Countries that use Fahrenheit
const IMPERIAL_COUNTRIES = ['US', 'BS', 'BZ', 'KY', 'PW', 'PR', 'GU', 'VI'];

// Get UV description from index
function getUVDescription(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

// Convert degrees to compass direction
function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

// Format time from Unix timestamp with timezone
function formatTime(timestamp: number, timezone: number): string {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Calculate day length from sunrise and sunset timestamps
function calculateDayLength(sunrise: number, sunset: number): string {
  const diff = sunset - sunrise;
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Map OpenWeatherMap condition codes to our simplified conditions
function mapCondition(weatherId: number, description: string): WeatherCondition {
  // Thunderstorm (200-299)
  if (weatherId >= 200 && weatherId < 300) {
    return { type: 'stormy', description };
  }
  // Drizzle (300-399) or Rain (500-599)
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return { type: 'rainy', description };
  }
  // Snow (600-699)
  if (weatherId >= 600 && weatherId < 700) {
    return { type: 'snowy', description };
  }
  // Atmosphere/Fog (700-799)
  if (weatherId >= 700 && weatherId < 800) {
    return { type: 'foggy', description };
  }
  // Clear (800)
  if (weatherId === 800) {
    return { type: 'sunny', description };
  }
  // Clouds (801-899)
  if (weatherId > 800) {
    return { type: 'cloudy', description };
  }
  return { type: 'cloudy', description };
}

// Mock data for when API is unavailable
function getMockWeather(city: string): WeatherData {
  const isSF = city.toLowerCase().includes('san francisco') || city.toLowerCase().includes('us');
  const isUS = isSF;
  const unit: TemperatureUnit = isUS ? 'F' : 'C';

  // Convert temps if needed (mock data is in F base)
  const convertTemp = (f: number) => isUS ? f : Math.round((f - 32) * 5 / 9);

  // Generate mock hourly forecast
  const now = new Date();
  const hourlyForecast: HourlyForecast[] = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now.getTime() + i * 3600 * 1000);
    const hourNum = hour.getHours();
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    const baseTemp = isSF ? 62 : 48;
    // Simulate temperature variation through the day
    const tempVariation = Math.sin((hourNum - 6) * Math.PI / 12) * 8;

    return {
      time: i === 0 ? 'Now' : `${hour12}${ampm}`,
      temperature: convertTemp(Math.round(baseTemp + tempVariation)),
      condition: isSF
        ? { type: 'sunny' as const, description: 'Clear' }
        : { type: 'rainy' as const, description: 'Rain' },
      precipProbability: isSF ? 5 : 65,
      isNow: i === 0,
    };
  });

  const details: WeatherDetails = {
    uvIndex: isSF ? 6 : 2,
    uvDescription: isSF ? 'High' : 'Low',
    visibility: isSF ? 10 : 5,
    visibilityUnit: isUS ? 'mi' : 'km',
    pressure: 1015,
    pressureTrend: 'steady',
    dewPoint: convertTemp(isSF ? 52 : 42),
    cloudCover: isSF ? 10 : 85,
    precipProbability: isSF ? 5 : 70,
    windDirection: isSF ? 'W' : 'SW',
    windGust: isSF ? 18 : 45,
  };

  const sunMoon: SunMoonData = {
    sunrise: isSF ? '7:12 AM' : '8:23 AM',
    sunset: isSF ? '5:28 PM' : '4:52 PM',
    moonPhase: 'Waxing Gibbous',
    dayLength: isSF ? '10h 16m' : '8h 29m',
  };

  return {
    location: isSF ? 'San Francisco' : 'Dublin',
    country: isSF ? 'US' : 'IE',
    temperature: convertTemp(isSF ? 62 : 48),
    feelsLike: convertTemp(isSF ? 60 : 45),
    condition: isSF
      ? { type: 'sunny', description: 'Clear sky' }
      : { type: 'rainy', description: 'Light rain' },
    humidity: isSF ? 65 : 82,
    windSpeed: isSF ? 12 : 29,
    windUnit: isUS ? 'mph' : 'km/h',
    icon: isSF ? '01d' : '10d',
    forecast: [
      { day: 'Today', date: 'Jan 17', high: convertTemp(isSF ? 65 : 50), low: convertTemp(isSF ? 52 : 42), condition: isSF ? { type: 'sunny', description: 'Clear' } : { type: 'rainy', description: 'Rain' }, icon: isSF ? '01d' : '10d', precipProbability: isSF ? 5 : 70 },
      { day: 'Sat', date: 'Jan 18', high: convertTemp(isSF ? 68 : 52), low: convertTemp(isSF ? 54 : 44), condition: { type: 'cloudy', description: 'Partly cloudy' }, icon: '02d', precipProbability: 25 },
      { day: 'Sun', date: 'Jan 19', high: convertTemp(isSF ? 64 : 48), low: convertTemp(isSF ? 50 : 40), condition: { type: 'rainy', description: 'Light rain' }, icon: '10d', precipProbability: 80 },
      { day: 'Mon', date: 'Jan 20', high: convertTemp(isSF ? 62 : 46), low: convertTemp(isSF ? 48 : 38), condition: { type: 'cloudy', description: 'Overcast' }, icon: '04d', precipProbability: 40 },
      { day: 'Tue', date: 'Jan 21', high: convertTemp(isSF ? 66 : 50), low: convertTemp(isSF ? 52 : 42), condition: { type: 'sunny', description: 'Clear' }, icon: '01d', precipProbability: 10 },
    ],
    hourlyForecast,
    details,
    sunMoon,
    lastUpdated: new Date().toISOString(),
    unit,
    timezone: isSF ? -28800 : 0, // PST or GMT
  };
}

async function fetchWeatherFromAPI(city: string): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn('OPENWEATHER_API_KEY not set, using mock data');
    return null;
  }

  try {
    // First fetch to determine country and get coordinates (use metric as default)
    const initialRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`,
      { next: { revalidate: 1800 } }
    );

    if (!initialRes.ok) {
      console.error(`Weather API error: ${initialRes.status}`);
      return null;
    }

    const initialData = await initialRes.json();
    const country = initialData.sys.country;
    const isImperial = IMPERIAL_COUNTRIES.includes(country);
    const units = isImperial ? 'imperial' : 'metric';
    const unit: TemperatureUnit = isImperial ? 'F' : 'C';
    const windUnit = isImperial ? 'mph' : 'km/h';
    const { lat, lon } = initialData.coord;
    const timezone = initialData.timezone;

    // Fetch with correct units if imperial country
    let currentData = initialData;
    if (isImperial) {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=imperial`,
        { next: { revalidate: 1800 } }
      );
      if (currentRes.ok) {
        currentData = await currentRes.json();
      }
    }

    // Fetch 5-day/3-hour forecast with correct units
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`,
      { next: { revalidate: 1800 } }
    );

    let forecast: DayForecast[] = [];
    let hourlyForecast: HourlyForecast[] = [];

    if (forecastRes.ok) {
      const forecastData = await forecastRes.json();

      // Extract hourly forecast (first 24 entries = 8 hours * 3 = 24 hours roughly)
      hourlyForecast = forecastData.list.slice(0, 8).map((item: {
        dt: number;
        main: { temp: number };
        weather: Array<{ id: number; description: string }>;
        pop: number;
      }, index: number) => {
        const date = new Date(item.dt * 1000);
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return {
          time: index === 0 ? 'Now' : `${hour12}${ampm}`,
          temperature: Math.round(item.main.temp),
          condition: mapCondition(item.weather[0].id, item.weather[0].description),
          precipProbability: Math.round((item.pop || 0) * 100),
          isNow: index === 0,
        };
      });

      // Group forecast by day and get daily highs/lows
      const dailyData: Record<string, {
        temps: number[];
        condition: WeatherCondition;
        icon: string;
        date: string;
        pop: number[];
      }> = {};

      forecastData.list.forEach((item: {
        dt: number;
        main: { temp: number };
        weather: Array<{ id: number; description: string; icon: string }>;
        pop: number;
      }) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        if (!dailyData[dayKey]) {
          dailyData[dayKey] = {
            temps: [],
            condition: mapCondition(item.weather[0].id, item.weather[0].description),
            icon: item.weather[0].icon,
            date: dateStr,
            pop: [],
          };
        }
        dailyData[dayKey].temps.push(item.main.temp);
        dailyData[dayKey].pop.push(item.pop || 0);
      });

      const todayKey = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      forecast = Object.entries(dailyData).slice(0, 5).map(([day, data]) => ({
        day: day === todayKey ? 'Today' : day,
        date: data.date,
        high: Math.round(Math.max(...data.temps)),
        low: Math.round(Math.min(...data.temps)),
        condition: data.condition,
        icon: data.icon,
        precipProbability: Math.round(Math.max(...data.pop) * 100),
      }));
    }

    // Convert wind speed for metric (API returns m/s for metric, convert to km/h)
    const windSpeed = isImperial
      ? Math.round(currentData.wind.speed)
      : Math.round(currentData.wind.speed * 3.6);

    // Build weather details
    const details: WeatherDetails = {
      uvIndex: 0, // Free tier doesn't include UV
      uvDescription: 'N/A',
      visibility: isImperial
        ? Math.round((currentData.visibility || 10000) / 1609.34) // meters to miles
        : Math.round((currentData.visibility || 10000) / 1000), // meters to km
      visibilityUnit: isImperial ? 'mi' : 'km',
      pressure: currentData.main.pressure,
      pressureTrend: 'steady',
      dewPoint: Math.round(currentData.main.temp - ((100 - currentData.main.humidity) / 5)),
      cloudCover: currentData.clouds?.all || 0,
      precipProbability: hourlyForecast[0]?.precipProbability || 0,
      windDirection: getWindDirection(currentData.wind.deg || 0),
      windGust: currentData.wind.gust
        ? (isImperial ? Math.round(currentData.wind.gust) : Math.round(currentData.wind.gust * 3.6))
        : undefined,
    };

    // Build sun/moon data
    const sunMoon: SunMoonData = {
      sunrise: formatTime(currentData.sys.sunrise, timezone),
      sunset: formatTime(currentData.sys.sunset, timezone),
      dayLength: calculateDayLength(currentData.sys.sunrise, currentData.sys.sunset),
    };

    return {
      location: currentData.name,
      country: currentData.sys.country,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      condition: mapCondition(currentData.weather[0].id, currentData.weather[0].description),
      humidity: currentData.main.humidity,
      windSpeed,
      windUnit,
      icon: currentData.weather[0].icon,
      forecast,
      hourlyForecast,
      details,
      sunMoon,
      lastUpdated: new Date().toISOString(),
      unit,
      timezone,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'San Francisco';

  // Check cache first
  const cacheKey = city.toLowerCase();
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  // Try to fetch from API
  const weatherData = await fetchWeatherFromAPI(city);

  if (weatherData) {
    cache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
    return NextResponse.json(weatherData);
  }

  // Fall back to mock data
  const mockData = getMockWeather(city);
  cache.set(cacheKey, { data: mockData, timestamp: Date.now() });

  return NextResponse.json(mockData);
}
