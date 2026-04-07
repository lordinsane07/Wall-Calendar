/**
 * WallMount — Mounting pins above the coil and wall shadow layer.
 * Two SVG nail graphics that cast tiny drop-shadows.
 */

import { memo } from 'react';
import styles from '../../styles/calendar.module.css';

const WallMount = memo(function WallMount() {
  return (
    <div className={styles.mountingPins}>
      <NailPin />
      <NailPin />
    </div>
  );
});

/** Single nail/pin SVG */
function NailPin() {
  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 12 20"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="pinHead" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#B0B0B0" />
          <stop offset="60%" stopColor="#787878" />
          <stop offset="100%" stopColor="#606060" />
        </radialGradient>
        <filter id="pinShadow" x="-50%" y="-20%" width="200%" height="200%">
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      {/* Pin shaft */}
      <line
        x1="6"
        y1="8"
        x2="6"
        y2="18"
        stroke="#888"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Pin head */}
      <circle
        cx="6"
        cy="6"
        r="5"
        fill="url(#pinHead)"
        filter="url(#pinShadow)"
      />
      {/* Highlight on pin head */}
      <circle
        cx="4.5"
        cy="4.5"
        r="1.5"
        fill="rgba(255,255,255,0.4)"
      />
    </svg>
  );
}

export default WallMount;
