'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Cloud, CloudRain, CloudLightning,
  Snowflake, CloudFog, Droplets, Wind,
  RefreshCw, MapPin, Thermometer, Loader2,
  Plus, X, Search
} from 'lucide-react';
import { useWeather } from './useWeather';
import { WeatherAnimation, WEATHER_BACKGROUNDS } from './WeatherAnimation';
import { getDailySaying } from './IrishSayings';
import type { WeatherData, WeatherConditionType, SavedLocation } from './types';

// Weather icon mapping
const WEATHER_ICONS: Record<WeatherConditionType, React.ReactNode> = {
  sunny: <Sun className="w-full h-full" />,
  cloudy: <Cloud className="w-full h-full" />,
  rainy: <CloudRain className="w-full h-full" />,
  stormy: <CloudLightning className="w-full h-full" />,
  snowy: <Snowflake className="w-full h-full" />,
  foggy: <CloudFog className="w-full h-full" />,
};

// Default locations
const DEFAULT_LOCATIONS: SavedLocation[] = [
  { id: 'sf', city: 'San Francisco,US', isPrimary: true },
  { id: 'dublin', city: 'Dublin,IE' },
];

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

// Individual weather card component
function WeatherCard({
  location,
  onRemove,
  isPrimary = false,
  showAnimation = true,
}: {
  location: SavedLocation;
  onRemove?: () => void;
  isPrimary?: boolean;
  showAnimation?: boolean;
}) {
  const { weather, isLoading, error } = useWeather({ city: location.city });

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
  const icon = WEATHER_ICONS[condition];
  const saying = getDailySaying(condition);
  const unit = weather.unit || 'F';
  const windUnit = weather.windUnit || 'mph';

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl flex-shrink-0 ${isPrimary ? 'min-h-[280px]' : 'min-h-[200px]'}`}
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

      {/* Remove button */}
      {onRemove && !isPrimary && (
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        >
          <X className="w-4 h-4 text-white/90" />
        </button>
      )}

      {/* Content overlay */}
      <div className="relative z-10 h-full p-5 flex flex-col">
        {/* Location */}
        <div className="flex items-center gap-2 text-white/90">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">
            {weather.location}
          </span>
          {weather.country === 'IE' && <span className="text-base">🍀</span>}
          {isPrimary && (
            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Primary</span>
          )}
        </div>

        {/* Main temperature */}
        <div className="flex items-center gap-4 mt-3">
          <div className="w-14 h-14 text-white drop-shadow-lg">
            {icon}
          </div>
          <div>
            <div className="text-4xl font-light text-white drop-shadow-lg">
              {weather.temperature}°{unit}
            </div>
            <div className="text-white/70 text-sm capitalize">
              {weather.condition.description}
            </div>
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

        {/* Stats */}
        <div className="flex gap-4 mt-auto pt-4 text-white/70">
          <div className="flex items-center gap-1 text-xs">
            <Thermometer className="w-3 h-3" />
            <span>Feels {weather.feelsLike}°{unit}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} {windUnit}</span>
          </div>
        </div>

        {/* Mini forecast for primary */}
        {isPrimary && weather.forecast && weather.forecast.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex justify-between">
              {weather.forecast.slice(0, 5).map((day) => (
                <div key={`${day.day}-${day.high}-${day.low}`} className="flex flex-col items-center gap-1">
                  <span className="text-white/50 text-xs">{day.day}</span>
                  <div className="w-5 h-5 text-white/80">
                    {WEATHER_ICONS[day.condition.type]}
                  </div>
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

// Add location modal
function AddLocationModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (city: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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
    'Sydney,AU', 'Berlin,DE', 'Toronto,CA', 'Amsterdam,NL'
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
          <h2 className="text-xl font-semibold text-white">Add Location</h2>
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

// Main Weather Widget Component
export function WeatherWidget() {
  const [locations, setLocations] = useState<SavedLocation[]>(DEFAULT_LOCATIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnimations, setShowAnimations] = useState(true);
  const [mounted, setMounted] = useState(false);

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
    const id = `loc-${Date.now()}`;
    setLocations((prev) => [...prev, { id, city }]);
  };

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
      <div className="relative z-10 max-w-2xl mx-auto p-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-semibold text-white">Weather</h1>
            <p className="text-white/60 text-sm">{locations.length} location{locations.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAnimations(!showAnimations)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title={showAnimations ? 'Disable animations' : 'Enable animations'}
            >
              <Sun className={`w-5 h-5 text-white ${showAnimations ? '' : 'opacity-50'}`} />
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              title="Add location"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
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
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {otherLocations.map((location) => (
                <WeatherCard
                  key={location.id}
                  location={location}
                  onRemove={() => handleRemoveLocation(location.id)}
                  showAnimation={showAnimations}
                />
              ))}

              {/* Add location card */}
              <motion.button
                onClick={() => setShowAddModal(true)}
                className="flex-shrink-0 w-[280px] min-h-[200px] rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-white/40 hover:text-white/60 hover:border-white/40 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-8 h-8" />
                <span className="text-sm">Add Location</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Empty state for no other locations */}
        {otherLocations.length === 0 && (
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
              <span>Add another location</span>
            </button>
          </motion.div>
        )}

        {/* Last updated info */}
        <motion.p
          className="text-center text-white/30 text-xs mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Weather data refreshes every 30 minutes
        </motion.p>
      </div>

      {/* Add Location Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddLocationModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddLocation}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact widget for home screen
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
  const icon = WEATHER_ICONS[condition];
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
          <div className="w-5 h-5 text-white">
            {icon}
          </div>
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
