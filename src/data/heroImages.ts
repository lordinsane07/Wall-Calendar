/**
 * Curated hero images keyed by month index (0-11).
 * Using Unsplash Source with specific photo IDs for guaranteed
 * season-appropriate imagery. Each photo is hand-picked to match
 * the month's theme/season in the Indian context.
 */

import type { HeroImageEntry } from '../lib/calendarTypes';

const heroImages: Record<number, HeroImageEntry> = {
  0: {
    // January — crisp winter morning, frost on grass
    url: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&h=400&fit=crop&crop=center',
    alt: 'Crisp winter morning with frost on fields',
    credit: 'Unsplash',
  },
  1: {
    // February — spring blossoms starting, cherry/almond flowers
    url: 'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=800&h=400&fit=crop&crop=center',
    alt: 'Pink spring blossoms on a tree branch',
    credit: 'Unsplash',
  },
  2: {
    // March — Holi, vibrant spring colors
    url: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=400&fit=crop&crop=center',
    alt: 'Colorful spring flowers in full bloom',
    credit: 'Unsplash',
  },
  3: {
    // April — warm sun, green fields, harvest season
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop&crop=center',
    alt: 'Golden sunlight over green agricultural fields',
    credit: 'Unsplash',
  },
  4: {
    // May — hot Indian summer, blue sky, arid landscape
    url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800&h=400&fit=crop&crop=center',
    alt: 'Hot summer landscape under vast blue sky',
    credit: 'Unsplash',
  },
  5: {
    // June — monsoon approaching, dramatic clouds
    url: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=400&fit=crop&crop=center',
    alt: 'Dramatic monsoon clouds over tropical landscape',
    credit: 'Unsplash',
  },
  6: {
    // July — monsoon rains, lush green, rain-soaked
    url: 'https://images.unsplash.com/photo-1501691223387-dd0500403074?w=800&h=400&fit=crop&crop=center',
    alt: 'Lush green rain-soaked tropical foliage',
    credit: 'Unsplash',
  },
  7: {
    // August — Independence Day month, monsoon greenery, waterfalls
    url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&h=400&fit=crop&crop=center',
    alt: 'Verdant green mountains with monsoon clouds',
    credit: 'Unsplash',
  },
  8: {
    // September — late monsoon, golden light, harvest approaching
    url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&h=400&fit=crop&crop=center',
    alt: 'Golden autumn light filtering through trees',
    credit: 'Unsplash',
  },
  9: {
    // October — festive season (Dussehra, Diwali prep), warm autumn tones
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&crop=center',
    alt: 'Warm amber autumn landscape with golden light',
    credit: 'Unsplash',
  },
  10: {
    // November — Diwali, festive lights, warm harvest tones
    url: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&h=400&fit=crop&crop=center',
    alt: 'Beautiful twilight sunset over calm waters',
    credit: 'Unsplash',
  },
  11: {
    // December — cool winter, pine/cedar scenery, Christmas
    url: 'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&h=400&fit=crop&crop=center',
    alt: 'Serene winter forest with mist and cool tones',
    credit: 'Unsplash',
  },
};

export function getHeroImage(month: number): HeroImageEntry {
  return heroImages[month] ?? heroImages[0]!;
}

export default heroImages;
