/**
 * useWeather — Fetches current weather from wttr.in (free, no API key).
 * Maps conditions to CSS overlay presets. Silent fail on error.
 */

import { useState, useEffect } from 'react';
import type { WeatherData, WeatherCondition } from '../lib/calendarTypes';

interface WttrResponse {
  current_condition?: Array<{
    temp_C?: string;
    weatherDesc?: Array<{ value?: string }>;
    weatherCode?: string;
  }>;
}

function mapWeatherCode(code: string): WeatherCondition {
  const c = parseInt(code, 10);
  if (isNaN(c)) return 'clear';

  // wttr.in weather codes
  if (c === 113) return 'sunny';
  if (c === 116 || c === 119 || c === 122) return 'cloudy';
  if (c >= 143 && c <= 148) return 'foggy';
  if (c >= 176 && c <= 359) return 'rainy';
  if (c >= 227 && c <= 230) return 'snowy';
  if (c >= 311 && c <= 338) return 'snowy'; // Sleet/snow codes
  if (c >= 350 && c <= 395) return 'rainy';

  return 'clear';
}

function getWeatherIcon(condition: WeatherCondition): string {
  switch (condition) {
    case 'sunny': return '☀️';
    case 'rainy': return '🌧️';
    case 'snowy': return '❄️';
    case 'foggy': return '🌫️';
    case 'cloudy': return '⛅';
    case 'clear': return '🌤️';
  }
}

export function useWeather(): WeatherData | null {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      try {
        const response = await fetch('https://wttr.in/?format=j1', {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json()) as WttrResponse;
        const current = data.current_condition?.[0];
        if (!current) return;

        const code = current.weatherCode ?? '113';
        const condition = mapWeatherCode(code);

        setWeather({
          tempC: current.temp_C ?? '--',
          condition,
          description: current.weatherDesc?.[0]?.value ?? 'Clear',
          icon: getWeatherIcon(condition),
        });
      } catch {
        // Silent fail — no error state shown to user
      }
    }

    fetchWeather();

    return () => controller.abort();
  }, []);

  return weather;
}
