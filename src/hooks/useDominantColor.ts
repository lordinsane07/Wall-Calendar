/**
 * useDominantColor — Canvas-based palette extraction from hero images.
 * Draws the image to a tiny offscreen canvas, reads pixel data,
 * and extracts dominant colors via simplified median-cut.
 */

import { useState, useEffect, useCallback } from 'react';
import type { DominantPalette } from '../lib/calendarTypes';

const DEFAULT_PALETTE: DominantPalette = {
  primary: '#2196F3',
  light: 'rgba(33, 150, 243, 0.15)',
  dark: '#1565C0',
  contrastText: '#FFFFFF',
};

/** Convert RGB to HSL */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

/** Simple luminance check for contrast text color */
function getContrastText(r: number, g: number, b: number): string {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1A1A1A' : '#FFFFFF';
}

/** Extract dominant color from image using canvas pixel sampling */
function extractDominantColor(img: HTMLImageElement): DominantPalette {
  const canvas = document.createElement('canvas');
  const size = 50;
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return DEFAULT_PALETTE;

  ctx.drawImage(img, 0, 0, size, size);
  const imageData = ctx.getImageData(0, 0, size, size);
  const pixels = imageData.data;

  // Simple color bucketing
  const colorBuckets: Record<string, { r: number; g: number; b: number; count: number }> = {};

  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.round((pixels[i] ?? 0) / 32) * 32;
    const g = Math.round((pixels[i + 1] ?? 0) / 32) * 32;
    const b = Math.round((pixels[i + 2] ?? 0) / 32) * 32;
    const key = `${r},${g},${b}`;

    // Skip near-white and near-black pixels
    const brightness = (r + g + b) / 3;
    if (brightness > 230 || brightness < 25) continue;

    // Skip very desaturated pixels
    const [, sat] = rgbToHsl(r, g, b);
    if (sat < 15) continue;

    if (colorBuckets[key]) {
      colorBuckets[key].count++;
    } else {
      colorBuckets[key] = { r, g, b, count: 1 };
    }
  }

  // Find the most common saturated color
  const sorted = Object.values(colorBuckets).sort((a, b) => b.count - a.count);
  const dominant = sorted[0];

  if (!dominant) return DEFAULT_PALETTE;

  const { r, g, b } = dominant;
  const [h, s, l] = rgbToHsl(r, g, b);

  return {
    primary: `hsl(${h}, ${Math.min(s + 10, 80)}%, ${Math.min(Math.max(l, 35), 55)}%)`,
    light: `hsla(${h}, ${s}%, ${Math.min(l + 25, 85)}%, 0.15)`,
    dark: `hsl(${h}, ${Math.min(s + 15, 85)}%, ${Math.max(l - 15, 20)}%)`,
    contrastText: getContrastText(r, g, b),
  };
}

export function useDominantColor(imageUrl: string): DominantPalette {
  const [palette, setPalette] = useState<DominantPalette>(DEFAULT_PALETTE);

  const extractColors = useCallback((url: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const extracted = extractDominantColor(img);
      setPalette(extracted);

      // Apply to CSS variables on :root
      const root = document.documentElement;
      root.style.setProperty('--accent', extracted.primary);
      root.style.setProperty('--accent-light', extracted.light);
      root.style.setProperty('--accent-dark', extracted.dark);
    };
    img.onerror = () => {
      setPalette(DEFAULT_PALETTE);
    };
    img.src = url;
  }, []);

  useEffect(() => {
    if (imageUrl) {
      extractColors(imageUrl);
    }
  }, [imageUrl, extractColors]);

  return palette;
}
