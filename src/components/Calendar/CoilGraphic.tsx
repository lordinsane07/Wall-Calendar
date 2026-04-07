/**
 * CoilGraphic — Hand-drawn SVG spiral coil at the top of the calendar.
 * Individually rendered loops with metallic gradient, not a repeated pattern.
 */

import { memo } from 'react';

const CoilGraphic = memo(function CoilGraphic() {
  const loops = 14;
  const width = 480;
  const loopSpacing = width / (loops + 1);
  const loopRadius = 8;

  return (
    <svg
      width="100%"
      height="28"
      viewBox={`0 0 ${width} 28`}
      preserveAspectRatio="xMidYMid meet"
      style={{ overflow: 'visible', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        {/* Metallic gradient */}
        <linearGradient id="coilGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4D4D4" />
          <stop offset="35%" stopColor="#8A8A8A" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="65%" stopColor="#8A8A8A" />
          <stop offset="100%" stopColor="#D4D4D4" />
        </linearGradient>
        {/* Shadow filter */}
        <filter id="coilShadow" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>

      {/* Background wire connecting all loops */}
      <line
        x1="0"
        y1="14"
        x2={width}
        y2="14"
        stroke="url(#coilGradient)"
        strokeWidth="2"
        filter="url(#coilShadow)"
      />

      {/* Individual coil loops */}
      {Array.from({ length: loops }, (_, i) => {
        const cx = loopSpacing * (i + 1);
        const cy = 14;
        // Slight variation for hand-drawn feel
        const rxVar = loopRadius + (i % 3 === 0 ? 0.5 : i % 3 === 1 ? -0.3 : 0);
        const ryVar = loopRadius + 3 + (i % 2 === 0 ? 0.5 : -0.3);

        return (
          <ellipse
            key={i}
            cx={cx}
            cy={cy}
            rx={rxVar}
            ry={ryVar}
            fill="none"
            stroke="url(#coilGradient)"
            strokeWidth="2.5"
            filter="url(#coilShadow)"
          />
        );
      })}
    </svg>
  );
});

export default CoilGraphic;
