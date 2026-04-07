/**
 * Curated hero images keyed by month index (0-11).
 * Using picsum.photos for guaranteed reliability — no API key needed.
 * Each month has a fixed seed so the image is consistent.
 */

import type { HeroImageEntry } from '../lib/calendarTypes';

const heroImages: Record<number, HeroImageEntry> = {
  0: {
    url: 'https://picsum.photos/seed/january-winter/800/400',
    alt: 'Snow-covered winter landscape',
    credit: 'Picsum',
  },
  1: {
    url: 'https://picsum.photos/seed/february-love/800/400',
    alt: 'Warm cozy February scene',
    credit: 'Picsum',
  },
  2: {
    url: 'https://picsum.photos/seed/march-spring/800/400',
    alt: 'Early spring flowers blooming',
    credit: 'Picsum',
  },
  3: {
    url: 'https://picsum.photos/seed/april-rain/800/400',
    alt: 'April spring showers and blooms',
    credit: 'Picsum',
  },
  4: {
    url: 'https://picsum.photos/seed/may-green/800/400',
    alt: 'Lush green hills and meadows',
    credit: 'Picsum',
  },
  5: {
    url: 'https://picsum.photos/seed/june-summer/800/400',
    alt: 'Golden sunset at the beach',
    credit: 'Picsum',
  },
  6: {
    url: 'https://picsum.photos/seed/july-sunshine/800/400',
    alt: 'Bright summer landscape',
    credit: 'Picsum',
  },
  7: {
    url: 'https://picsum.photos/seed/august-lake/800/400',
    alt: 'Late summer lakeside view',
    credit: 'Picsum',
  },
  8: {
    url: 'https://picsum.photos/seed/september-fall/800/400',
    alt: 'Autumn foliage in warm amber',
    credit: 'Picsum',
  },
  9: {
    url: 'https://picsum.photos/seed/october-mist/800/400',
    alt: 'Misty October forest',
    credit: 'Picsum',
  },
  10: {
    url: 'https://picsum.photos/seed/november-frost/800/400',
    alt: 'Late autumn bare trees with frost',
    credit: 'Picsum',
  },
  11: {
    url: 'https://picsum.photos/seed/december-snow/800/400',
    alt: 'December winter wonderland',
    credit: 'Picsum',
  },
};

export function getHeroImage(month: number): HeroImageEntry {
  return heroImages[month] ?? heroImages[0]!;
}

export default heroImages;
