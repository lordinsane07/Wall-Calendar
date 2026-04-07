/**
 * Curated Unsplash hero images keyed by month index (0-11).
 * Using verified working static URLs — no API key required.
 */

import type { HeroImageEntry } from '../lib/calendarTypes';

const heroImages: Record<number, HeroImageEntry> = {
  0: {
    url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=400&fit=crop&q=80',
    alt: 'Snow-covered winter landscape',
    credit: 'Unsplash',
  },
  1: {
    url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=400&fit=crop&q=80',
    alt: 'Warm candlelight and cozy winter scene',
    credit: 'Unsplash',
  },
  2: {
    url: 'https://images.unsplash.com/photo-1462275646964-a0e3c11f18a6?w=800&h=400&fit=crop&q=80',
    alt: 'Early spring flowers blooming',
    credit: 'Unsplash',
  },
  3: {
    url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=800&h=400&fit=crop&q=80',
    alt: 'Warm lights through spring trees',
    credit: 'Unsplash',
  },
  4: {
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=400&fit=crop&q=80',
    alt: 'Lush green hills and meadows',
    credit: 'Unsplash',
  },
  5: {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=400&fit=crop&q=80',
    alt: 'Golden sunset at the beach',
    credit: 'Unsplash',
  },
  6: {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&q=80',
    alt: 'Mountain peaks in summer sun',
    credit: 'Unsplash',
  },
  7: {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=400&fit=crop&q=80',
    alt: 'Late summer lakeside mountain view',
    credit: 'Unsplash',
  },
  8: {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&q=80',
    alt: 'Autumn foliage in warm amber',
    credit: 'Unsplash',
  },
  9: {
    url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=400&fit=crop&q=80',
    alt: 'Misty autumn forest',
    credit: 'Unsplash',
  },
  10: {
    url: 'https://images.unsplash.com/photo-1510272839903-4b37a1e7f2c0?w=800&h=400&fit=crop&q=80',
    alt: 'Late autumn bare trees',
    credit: 'Unsplash',
  },
  11: {
    url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800&h=400&fit=crop&q=80',
    alt: 'December winter wonderland',
    credit: 'Unsplash',
  },
};

export function getHeroImage(month: number): HeroImageEntry {
  return heroImages[month] ?? heroImages[0]!;
}

export default heroImages;
