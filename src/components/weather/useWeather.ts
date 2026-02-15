'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WeatherData } from './types';

interface UseWeatherOptions {
  city: string;
  refreshInterval?: number; // in milliseconds
}

interface UseWeatherReturn {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  refetch: () => Promise<void>; // Alias for refresh
  lastFetched: Date | null;
}

export function useWeather({ city, refreshInterval = 30 * 60 * 1000 }: UseWeatherOptions): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch weather: ${response.statusText}`);
      }

      const data: WeatherData = await response.json();
      setWeather(data);
      setLastFetched(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch weather';
      setError(message);
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [city]);

  // Initial fetch
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Set up refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const intervalId = setInterval(fetchWeather, refreshInterval);
    return () => clearInterval(intervalId);
  }, [fetchWeather, refreshInterval]);

  return {
    weather,
    isLoading,
    error,
    refresh: fetchWeather,
    refetch: fetchWeather, // Alias for refresh
    lastFetched,
  };
}

// Hook to fetch weather for both SF and Dublin
export function useDualCityWeather() {
  const sf = useWeather({ city: 'San Francisco,US' });
  const dublin = useWeather({ city: 'Dublin,IE' });

  return {
    sf,
    dublin,
    isLoading: sf.isLoading || dublin.isLoading,
    hasError: !!sf.error || !!dublin.error,
    refresh: async () => {
      await Promise.all([sf.refresh(), dublin.refresh()]);
    },
  };
}
