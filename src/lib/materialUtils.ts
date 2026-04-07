/**
 * Material utilities — SVG noise generators, shadow builders,
 * time-of-day shadow computation, and base64 cursor data URIs.
 */

import type { TimeOfDay } from './calendarTypes';

/**
 * Compute time-of-day category from the current hour.
 */
export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 15) return 'midday';
  if (hour >= 15 && hour < 19) return 'afternoon';
  return 'evening';
}

/**
 * Get the CSS box-shadow string based on time of day.
 * Creates different shadow directions to simulate ambient light shifts.
 */
export function getTimeOfDayShadow(hour: number): string {
  const tod = getTimeOfDay(hour);

  switch (tod) {
    case 'morning':
      return '6px 8px 32px rgba(200,170,120,0.18), 12px 16px 64px rgba(0,0,0,0.10)';
    case 'midday':
      return '0px 12px 32px rgba(0,0,0,0.14), 0px 24px 64px rgba(0,0,0,0.08)';
    case 'afternoon':
      return '-6px 8px 32px rgba(200,170,120,0.15), -12px 16px 64px rgba(0,0,0,0.10)';
    case 'evening':
      return '-8px 4px 48px rgba(0,0,0,0.08), -4px 8px 80px rgba(0,0,0,0.06)';
  }
}

/**
 * Generate the multi-layer wall shadow CSS.
 * This 4-layer graduated shadow creates the illusion of the calendar
 * floating 2-3cm off the wall surface.
 */
export function getWallShadow(): string {
  return [
    '0 2px 4px rgba(0,0,0,0.08)',
    '0 8px 16px rgba(0,0,0,0.10)',
    '0 24px 48px rgba(0,0,0,0.12)',
    '0 48px 80px rgba(0,0,0,0.07)',
  ].join(', ');
}

/**
 * SVG inline noise filter for paper grain texture.
 * Applied as a background-image data URI.
 */
export function getPaperGrainSVG(): string {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`;
}

/**
 * Fountain pen nib cursor as base64 SVG data URI (default calendar cursor).
 */
export const PEN_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M3 21l3.5-3.5L20 4l-2-2L4.5 15.5 3 21z' fill='%231A1A1A' stroke='%23F7F4EF' stroke-width='0.5'/%3E%3Cpath d='M14.5 5.5l2 2' stroke='%23C0C0C0' stroke-width='1'/%3E%3C/svg%3E") 2 22, auto`;

/**
 * Circle cursor for hovering over date cells.
 */
export const CIRCLE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ccircle cx='10' cy='10' r='8' fill='none' stroke='%232196F3' stroke-width='1.5'/%3E%3Ccircle cx='10' cy='10' r='2' fill='%232196F3'/%3E%3C/svg%3E") 10 10, pointer`;

/**
 * Angled pen cursor for notes textarea.
 */
export const WRITING_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M5 19l2.5-2.5L18 6l-1.5-1.5L6 15 5 19z' fill='%231A1A1A' stroke='%23F7F4EF' stroke-width='0.5' transform='rotate(-15 12 12)'/%3E%3C/svg%3E") 3 21, text`;
