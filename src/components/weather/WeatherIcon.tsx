'use client';

import Image from 'next/image';
import type { WeatherConditionType } from './types';

/**
 * Weather Icon Component using Meteocons by Bas Milius
 * @see https://github.com/basmilius/weather-icons
 * @license MIT
 */

// Mapping from our weather condition types to Meteocons icon names
const WEATHER_ICON_MAP: Record<WeatherConditionType, string> = {
  sunny: 'clear-day',
  cloudy: 'cloudy',
  rainy: 'rain',
  stormy: 'thunderstorms-rain',
  snowy: 'snow',
  foggy: 'fog',
};

interface WeatherIconProps {
  condition: WeatherConditionType;
  size?: number;
  className?: string;
  /** Use animated SVG (default: true) */
  animated?: boolean;
}

/**
 * Animated weather icon using Meteocons
 * Icons by Bas Milius - https://basmilius.github.io/weather-icons
 */
export function WeatherIcon({
  condition,
  size = 64,
  className = '',
  animated = true,
}: WeatherIconProps) {
  const iconName = WEATHER_ICON_MAP[condition] || 'cloudy';
  const iconPath = `/icons/weather/${iconName}.svg`;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Using img tag for animated SVG support */}
      <img
        src={iconPath}
        alt={`${condition} weather`}
        width={size}
        height={size}
        className="w-full h-full object-contain drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))',
        }}
      />
    </div>
  );
}

// Additional icon variants for forecast
export const FORECAST_ICONS: Record<WeatherConditionType, string> = {
  sunny: '/icons/weather/clear-day.svg',
  cloudy: '/icons/weather/cloudy.svg',
  rainy: '/icons/weather/rain.svg',
  stormy: '/icons/weather/thunderstorms-rain.svg',
  snowy: '/icons/weather/snow.svg',
  foggy: '/icons/weather/fog.svg',
};

/**
 * Mini weather icon for forecasts
 */
export function WeatherIconMini({
  condition,
  size = 24,
  className = '',
}: Omit<WeatherIconProps, 'animated'>) {
  const iconPath = FORECAST_ICONS[condition] || FORECAST_ICONS.cloudy;

  return (
    <img
      src={iconPath}
      alt={`${condition} weather`}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

export default WeatherIcon;
