'use client';

import { useState, useEffect, useRef } from 'react';
import { useHorizontalScroll } from '@/hooks';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Cloud, Droplets, Wind, Eye,
  MapPin, Thermometer, Loader2, Gauge,
  Plus, X, Search, ChevronDown, ChevronUp,
  Compass, CloudRain, RefreshCw
} from 'lucide-react';
import { useWeather } from './useWeather';
import { WeatherAnimation, WEATHER_BACKGROUNDS } from './WeatherAnimation';
import { getDailySaying } from './IrishSayings';
import { WeatherIcon, WeatherIconMini } from './WeatherIcon';
import type { WeatherData, WeatherConditionType, SavedLocation, HourlyForecast, DayForecast } from './types';

// Default locations
const DEFAULT_LOCATIONS: SavedLocation[] = [
  { id: 'sf', city: 'San Francisco,US', isPrimary: true },
  { id: 'dublin', city: 'Dublin,IE' },
];

// Maximum number of locations
const MAX_LOCATIONS = 12;

// Local storage key
const STORAGE_KEY = 'weather-locations';

// Load locations from localStorage
function loadLocations(): SavedLocation[] {
  if (typeof window === 'undefined') return DEFAULT_LOCATIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load locations:', e);
  }
  return DEFAULT_LOCATIONS;
}

// Save locations to localStorage
function saveLocations(locations: SavedLocation[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
  } catch (e) {
    console.error('Failed to save locations:', e);
  }
}

// ============================================================================
// Sub-components for the enhanced weather display
// ============================================================================

// Hourly forecast scroll component
function HourlyForecastScroll({ hourly, unit }: { hourly: HourlyForecast[]; unit: string }) {
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  return (
    <div className="mt-4">
      <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Hourly Forecast</h3>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
      >
        {hourly.map((hour, i) => (
          <motion.div
            key={`hour-${i}`}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl ${
              hour.isNow ? 'bg-white/20' : 'bg-white/5'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <span className={`text-xs ${hour.isNow ? 'text-white font-medium' : 'text-white/60'}`}>
              {hour.time}
            </span>
            <WeatherIconMini condition={hour.condition.type} size={28} />
            <span className="text-white text-sm font-medium">{hour.temperature}°</span>
            {hour.precipProbability > 0 && (
              <span className="text-blue-300 text-[10px] flex items-center gap-0.5">
                <Droplets className="w-2 h-2" />
                {hour.precipProbability}%
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Detailed metrics grid component
function WeatherMetricsGrid({ weather }: { weather: WeatherData }) {
  const unit = weather.unit || 'F';
  const windUnit = weather.windUnit || 'mph';
  const details = weather.details;
  const sunMoon = weather.sunMoon;

  const metrics = [
    {
      icon: '/icons/weather/thermometer.svg',
      label: 'Feels Like',
      value: `${weather.feelsLike}°${unit}`,
      subtext: weather.feelsLike < weather.temperature ? 'Colder' : weather.feelsLike > weather.temperature ? 'Warmer' : 'Same',
    },
    {
      icon: '/icons/weather/humidity.svg',
      label: 'Humidity',
      value: `${weather.humidity}%`,
      subtext: weather.humidity > 70 ? 'High' : weather.humidity < 40 ? 'Low' : 'Normal',
    },
    {
      icon: '/icons/weather/wind.svg',
      label: 'Wind',
      value: `${weather.windSpeed} ${windUnit}`,
      subtext: details?.windDirection ? `From ${details.windDirection}` : '',
    },
    ...(details ? [
      {
        icon: '/icons/weather/barometer.svg',
        label: 'Pressure',
        value: `${details.pressure} hPa`,
        subtext: details.pressureTrend === 'rising' ? 'Rising' : details.pressureTrend === 'falling' ? 'Falling' : 'Steady',
      },
      {
        icon: '/icons/weather/haze.svg',
        label: 'Visibility',
        value: `${details.visibility} ${details.visibilityUnit}`,
        subtext: details.visibility >= 10 ? 'Clear' : details.visibility >= 5 ? 'Moderate' : 'Poor',
      },
      {
        icon: '/icons/weather/raindrops.svg',
        label: 'Precipitation',
        value: `${details.precipProbability}%`,
        subtext: details.precipProbability > 50 ? 'Likely' : details.precipProbability > 20 ? 'Possible' : 'Unlikely',
      },
    ] : []),
  ];

  return (
    <div className="mt-4">
      <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Weather Details</h3>
      <div className="grid grid-cols-3 gap-2">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex flex-col items-center text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <img src={metric.icon} alt={metric.label} className="w-6 h-6 mb-1" />
            <span className="text-white/50 text-[10px] uppercase tracking-wide">{metric.label}</span>
            <span className="text-white font-medium text-sm">{metric.value}</span>
            {metric.subtext && (
              <span className="text-white/40 text-[10px]">{metric.subtext}</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Sun & Moon section
function SunMoonSection({ sunMoon, condition }: { sunMoon: WeatherData['sunMoon']; condition: WeatherConditionType }) {
  if (!sunMoon) return null;

  return (
    <div className="mt-4">
      <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Sun & Moon</h3>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
        <div className="flex justify-between items-center">
          {/* Sunrise */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img src="/icons/weather/sunrise.svg" alt="Sunrise" className="w-10 h-10" />
            <span className="text-white/50 text-xs mt-1">Sunrise</span>
            <span className="text-white font-medium text-sm">{sunMoon.sunrise}</span>
          </motion.div>

          {/* Day length arc visualization */}
          <div className="flex-1 mx-4 relative h-12">
            <svg viewBox="0 0 100 50" className="w-full h-full">
              {/* Arc path */}
              <path
                d="M 10 45 Q 50 5 90 45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Sun position indicator */}
              <circle
                cx="50"
                cy="25"
                r="4"
                fill="#FFD700"
                className="drop-shadow-lg"
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center">
              <span className="text-white/60 text-xs">{sunMoon.dayLength}</span>
            </div>
          </div>

          {/* Sunset */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img src="/icons/weather/sunset.svg" alt="Sunset" className="w-10 h-10" />
            <span className="text-white/50 text-xs mt-1">Sunset</span>
            <span className="text-white font-medium text-sm">{sunMoon.sunset}</span>
          </motion.div>
        </div>

        {/* Moon phase if available */}
        {sunMoon.moonPhase && (
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-2">
            <img src="/icons/weather/moon-full.svg" alt="Moon" className="w-5 h-5 opacity-70" />
            <span className="text-white/50 text-xs">{sunMoon.moonPhase}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Extended 5-day forecast with expandable details
function ExtendedForecast({ forecast, unit }: { forecast: DayForecast[]; unit: string }) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <div className="mt-4">
      <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">5-Day Forecast</h3>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
        {forecast.map((day, i) => (
          <motion.div
            key={`${day.day}-${i}`}
            className={`${i > 0 ? 'border-t border-white/10' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => setExpandedDay(expandedDay === i ? null : i)}
              className="w-full p-3 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              <div className="w-12 text-left">
                <div className="text-white text-sm font-medium">{day.day}</div>
                {day.date && <div className="text-white/40 text-[10px]">{day.date}</div>}
              </div>

              <WeatherIconMini condition={day.condition.type} size={32} />

              <div className="flex-1 flex items-center gap-2">
                {/* Temperature bar visualization */}
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"
                    style={{
                      left: `${((day.low - 30) / 70) * 100}%`,
                      right: `${100 - ((day.high - 30) / 70) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 min-w-[80px] justify-end">
                <span className="text-white/50 text-sm">{day.low}°</span>
                <span className="text-white font-medium text-sm">{day.high}°</span>
              </div>

              {day.precipProbability !== undefined && day.precipProbability > 0 && (
                <div className="flex items-center gap-1 min-w-[40px]">
                  <Droplets className="w-3 h-3 text-blue-300" />
                  <span className="text-blue-300 text-xs">{day.precipProbability}%</span>
                </div>
              )}

              <ChevronDown
                className={`w-4 h-4 text-white/40 transition-transform ${
                  expandedDay === i ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Expanded details */}
            <AnimatePresence>
              {expandedDay === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 pt-1">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <WeatherIcon condition={day.condition.type} size={48} />
                        <div>
                          <div className="text-white font-medium capitalize">{day.condition.description}</div>
                          <div className="text-white/50 text-sm">
                            High: {day.high}°{unit} / Low: {day.low}°{unit}
                          </div>
                        </div>
                      </div>
                      {day.precipProbability !== undefined && (
                        <div className="text-white/60 text-xs flex items-center gap-1">
                          <CloudRain className="w-3 h-3" />
                          {day.precipProbability}% chance of precipitation
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Main Weather Card Component (Enhanced)
// ============================================================================

function WeatherCard({
  location,
  onRemove,
  isPrimary = false,
  showAnimation = true,
  onRefresh,
}: {
  location: SavedLocation;
  onRemove?: () => void;
  isPrimary?: boolean;
  showAnimation?: boolean;
  onRefresh?: () => void;
}) {
  const { weather, isLoading, error, refetch } = useWeather({ city: location.city });
  const [showDetails, setShowDetails] = useState(false);

  if (isLoading) {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-3xl flex-shrink-0 ${isPrimary ? 'min-h-[280px]' : 'min-h-[200px]'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          width: isPrimary ? '100%' : '280px',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-white/60" />
        </div>
      </motion.div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div
        className={`relative overflow-hidden rounded-3xl flex-shrink-0 ${isPrimary ? 'min-h-[280px]' : 'min-h-[200px]'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          width: isPrimary ? '100%' : '280px',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-white/60 p-4">
          <Cloud className="w-8 h-8 mb-2" />
          <span className="text-sm text-center">Unable to load weather for {location.city.split(',')[0]}</span>
        </div>
        {onRemove && !isPrimary && (
          <button
            onClick={onRemove}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        )}
      </motion.div>
    );
  }

  const condition = weather.condition.type;
  const saying = getDailySaying(condition);
  const unit = weather.unit || 'F';
  const windUnit = weather.windUnit || 'mph';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl flex-shrink-0 ${isPrimary ? '' : 'min-h-[200px]'}`}
      style={{ width: isPrimary ? '100%' : '280px' }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background */}
      {showAnimation && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <WeatherAnimation condition={condition} />
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        {isPrimary && (
          <button
            onClick={refetch}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-white/90" />
          </button>
        )}
        {onRemove && !isPrimary && (
          <button
            onClick={onRemove}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          >
            <X className="w-4 h-4 text-white/90" />
          </button>
        )}
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-5">
        {/* Location header */}
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{weather.location}</span>
          {weather.country === 'IE' && <span className="text-base">🍀</span>}
          {isPrimary && (
            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Primary</span>
          )}
        </div>

        {/* Main temperature display */}
        <div className="flex items-center gap-4 mt-3">
          <WeatherIcon condition={condition} size={isPrimary ? 80 : 56} />
          <div>
            <div className="text-5xl font-light text-white drop-shadow-lg">
              {weather.temperature}°
            </div>
            <div className="text-white/70 text-sm capitalize">
              {weather.condition.description}
            </div>
            <div className="text-white/50 text-xs mt-1">
              H:{weather.forecast?.[0]?.high || weather.temperature}° L:{weather.forecast?.[0]?.low || weather.temperature}°
            </div>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="flex gap-4 mt-4 text-white/70">
          <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
            <Thermometer className="w-3 h-3" />
            <span>Feels {weather.feelsLike}°</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-white/10 px-2 py-1 rounded-full">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} {windUnit}</span>
          </div>
        </div>

        {/* Irish saying - only on primary */}
        {isPrimary && (
          <motion.div
            className="mt-4 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-white text-sm italic">"{saying}"</p>
          </motion.div>
        )}

        {/* Primary card: Full details */}
        {isPrimary && (
          <>
            {/* Hourly forecast */}
            {weather.hourlyForecast && weather.hourlyForecast.length > 0 && (
              <HourlyForecastScroll hourly={weather.hourlyForecast} unit={unit} />
            )}

            {/* Toggle details button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-white/60 hover:text-white/80 transition-colors"
            >
              <span className="text-xs">{showDetails ? 'Hide Details' : 'Show More Details'}</span>
              {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Expandable detailed sections */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Weather metrics grid */}
                  <WeatherMetricsGrid weather={weather} />

                  {/* Sun & Moon */}
                  <SunMoonSection sunMoon={weather.sunMoon} condition={condition} />

                  {/* Extended forecast */}
                  {weather.forecast && weather.forecast.length > 0 && (
                    <ExtendedForecast forecast={weather.forecast} unit={unit} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Collapsed: Mini forecast */}
            {!showDetails && weather.forecast && weather.forecast.length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex justify-between">
                  {weather.forecast.slice(0, 5).map((day) => (
                    <div key={`${day.day}-${day.high}-${day.low}`} className="flex flex-col items-center gap-1">
                      <span className="text-white/50 text-xs">{day.day}</span>
                      <WeatherIconMini condition={day.condition.type} size={24} />
                      <span className="text-white text-xs">{day.high}°</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Secondary card: Compact forecast */}
        {!isPrimary && weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex justify-between">
              {weather.forecast.slice(0, 3).map((day) => (
                <div key={`${day.day}-${day.high}-${day.low}`} className="flex flex-col items-center gap-1">
                  <span className="text-white/50 text-xs">{day.day}</span>
                  <WeatherIconMini condition={day.condition.type} size={20} />
                  <span className="text-white text-xs">{day.high}°</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Add Location Modal
// ============================================================================

function AddLocationModal({
  isOpen,
  onClose,
  onAdd,
  remainingSlots,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (city: string) => void;
  remainingSlots: number;
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onAdd(searchTerm.trim());
      setSearchTerm('');
      onClose();
    }
  };

  const popularCities = [
    'London,UK', 'Paris,FR', 'Tokyo,JP', 'New York,US',
    'Sydney,AU', 'Berlin,DE', 'Toronto,CA', 'Amsterdam,NL',
    'Singapore,SG', 'Los Angeles,US', 'Chicago,US', 'Seattle,US'
  ];

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-md bg-gray-900/95 rounded-2xl p-6 shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Add Location</h2>
            <p className="text-white/40 text-xs">{remainingSlots} slot{remainingSlots !== 1 ? 's' : ''} remaining</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search city (e.g., Tokyo,JP)"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40"
              autoFocus
            />
          </div>
          <p className="text-white/40 text-xs mt-2">
            Tip: Add country code for accuracy (e.g., "Dublin,IE" or "Dublin,US")
          </p>

          <button
            type="submit"
            disabled={!searchTerm.trim()}
            className="w-full mt-4 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
          >
            Add Location
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-sm text-white/50 mb-3">Popular Cities</h3>
          <div className="flex flex-wrap gap-2">
            {popularCities.map((city) => (
              <button
                key={city}
                onClick={() => {
                  onAdd(city);
                  onClose();
                }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-sm text-white/80 transition-colors"
              >
                {city.split(',')[0]}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Main Weather Widget Component
// ============================================================================

export function WeatherWidget() {
  const [locations, setLocations] = useState<SavedLocation[]>(DEFAULT_LOCATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useHorizontalScroll<HTMLDivElement>();

  // Load locations from localStorage on mount
  useEffect(() => {
    setMounted(true);
    setLocations(loadLocations());
  }, []);

  // Save locations when they change
  useEffect(() => {
    if (mounted) {
      saveLocations(locations);
    }
  }, [locations, mounted]);

  const handleAddLocation = (city: string) => {
    if (locations.length >= MAX_LOCATIONS) return;
    const id = `loc-${Date.now()}`;
    setLocations((prev) => [...prev, { id, city }]);
  };

  const canAddMore = locations.length < MAX_LOCATIONS;

  const handleRemoveLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const primaryLocation = locations.find((loc) => loc.isPrimary) || locations[0];
  const otherLocations = locations.filter((loc) => loc.id !== primaryLocation?.id);

  // Get primary weather for background
  const { weather: primaryWeather } = useWeather({ city: primaryLocation?.city || 'San Francisco,US' });
  const primaryCondition = primaryWeather?.condition.type || 'cloudy';

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Full page background animation */}
      <div className="fixed inset-0 -z-10">
        <WeatherAnimation condition={primaryCondition} />
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 pb-24">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-semibold text-white">Weather</h1>
            <p className="text-white/60 text-sm">
              {locations.length} of {MAX_LOCATIONS} location{locations.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnimations(!showAnimations)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title={showAnimations ? 'Disable animations' : 'Enable animations'}
            >
              <Sun className={`w-5 h-5 text-white ${showAnimations ? '' : 'opacity-50'}`} />
            </button>
            {canAddMore && (
              <button
                onClick={() => setShowAddModal(true)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                title="Add location"
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Primary Location */}
        {primaryLocation && (
          <WeatherCard
            location={primaryLocation}
            isPrimary
            showAnimation={showAnimations}
          />
        )}

        {/* Other Locations - Scrollable */}
        {otherLocations.length > 0 && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-sm text-white/60 uppercase tracking-wider mb-3">Other Locations</h2>
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              {otherLocations.map((location) => (
                <WeatherCard
                  key={location.id}
                  location={location}
                  onRemove={() => handleRemoveLocation(location.id)}
                  showAnimation={showAnimations}
                />
              ))}

              {/* Add location card */}
              {canAddMore && (
                <motion.button
                  onClick={() => setShowAddModal(true)}
                  className="flex-shrink-0 w-[280px] min-h-[200px] rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/60 hover:border-white/40 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-8 h-8" />
                  <span className="text-sm">Add Location</span>
                  <span className="text-xs text-white/30">{MAX_LOCATIONS - locations.length} remaining</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Empty state for no other locations */}
        {otherLocations.length === 0 && canAddMore && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center gap-2 text-white/40 hover:text-white/60 hover:border-white/40 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add another location ({MAX_LOCATIONS - locations.length} remaining)</span>
            </button>
          </motion.div>
        )}

        {/* Attribution footer */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-white/30 text-xs">
            Weather data refreshes every 30 minutes
          </p>
          <p className="text-white/20 text-[10px] mt-1">
            Icons by <a href="https://github.com/basmilius/weather-icons" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">Bas Milius</a>
          </p>
        </motion.div>
      </div>

      {/* Add Location Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddLocationModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddLocation}
            remainingSlots={MAX_LOCATIONS - locations.length}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Compact Widget for Home Screen
// ============================================================================

export function WeatherWidgetCompact() {
  const { weather, isLoading } = useWeather({ city: 'San Francisco,US' });

  if (isLoading) {
    return (
      <div
        className="w-full h-full rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #87CEEB 0%, #FFE4B5 100%)',
        }}
      >
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  if (!weather) {
    return (
      <div
        className="w-full h-full rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(180deg, #8E9EAB 0%, #B8C6DB 100%)',
        }}
      >
        <Cloud className="w-8 h-8 text-white/60" />
      </div>
    );
  }

  const condition = weather.condition.type;
  const unit = weather.unit || 'F';

  return (
    <div
      className="w-full h-full rounded-2xl relative overflow-hidden"
      style={{
        background: WEATHER_BACKGROUNDS[condition],
      }}
    >
      {/* Simplified animation overlay */}
      <div className="absolute inset-0 opacity-30">
        <WeatherAnimation condition={condition} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full p-3 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-white/80 text-xs font-medium">
            {weather.location}
          </div>
          <WeatherIconMini condition={condition} size={24} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-3xl font-light text-white drop-shadow">
            {weather.temperature}°{unit}
          </span>
        </div>
        <div className="text-white/70 text-xs capitalize truncate">
          {weather.condition.description}
        </div>
      </div>
    </div>
  );
}

export default WeatherWidget;
