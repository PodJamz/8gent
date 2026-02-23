import { WeatherWidget } from '@/components/weather/WeatherWidget';

export const metadata = {
  title: 'Weather | 8gent',
  description: 'SF and Dublin weather with Irish sayings',
};

export default function WeatherPage() {
  return <WeatherWidget />;
}
