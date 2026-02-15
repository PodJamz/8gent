import { WeatherWidget } from '@/components/weather/WeatherWidget';

export const metadata = {
  title: 'Weather | OpenClaw-OS',
  description: 'SF and Dublin weather with Irish sayings',
};

export default function WeatherPage() {
  return <WeatherWidget />;
}
