/**
 * HeroImage — Monthly hero photo with SVG clip-path wave divider,
 * glossy overlay, weather badge, and weather overlay effects.
 */

import { memo, useState, useRef, useEffect } from 'react';
import { getHeroImage } from '../../data/heroImages';
import { useWeather } from '../../hooks/useWeather';
import styles from '../../styles/calendar.module.css';
import type { WeatherCondition } from '../../lib/calendarTypes';

interface HeroImageProps {
  month: number;
  isTransitioning: boolean;
}

/** CSS rain drops for rainy weather */
function RainOverlay() {
  const drops = Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 5) + Math.random() * 3}%`,
    delay: `${Math.random() * 1.2}s`,
    duration: `${0.8 + Math.random() * 0.6}s`,
  }));

  return (
    <div className={`${styles.weatherOverlay}`}>
      {drops.map((drop, i) => (
        <div
          key={i}
          className={styles.raindrop}
          style={{
            left: drop.left,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
          }}
        />
      ))}
    </div>
  );
}

/** CSS snow for snowy weather */
function SnowOverlay() {
  const flakes = Array.from({ length: 12 }, (_, i) => ({
    left: `${(i * 8) + Math.random() * 5}%`,
    delay: `${Math.random() * 3}s`,
    size: `${3 + Math.random() * 3}px`,
  }));

  return (
    <div className={styles.weatherOverlay}>
      {flakes.map((flake, i) => (
        <div
          key={i}
          className={styles.snowflake}
          style={{
            left: flake.left,
            animationDelay: flake.delay,
            width: flake.size,
            height: flake.size,
          }}
        />
      ))}
    </div>
  );
}

/** Get weather overlay component */
function WeatherOverlayEffect({ condition }: { condition: WeatherCondition }) {
  switch (condition) {
    case 'rainy': return <RainOverlay />;
    case 'snowy': return <SnowOverlay />;
    case 'sunny':
      return <div className={`${styles.weatherOverlay} ${styles.sunny}`} />;
    case 'cloudy':
      return <div className={`${styles.weatherOverlay} ${styles.cloudy}`} />;
    case 'foggy':
      return <div className={`${styles.weatherOverlay} ${styles.foggy}`} />;
    default:
      return null;
  }
}

const HeroImage = memo(function HeroImage({
  month,
  isTransitioning,
}: HeroImageProps) {
  const hero = getHeroImage(month);
  const weather = useWeather();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset loaded state on month change
  useEffect(() => {
    setLoaded(false);
  }, [month]);

  return (
    <div className={styles.heroWrapper}>
      <img
        ref={imgRef}
        src={hero.url}
        alt={hero.alt}
        className={`${styles.heroImage} ${isTransitioning ? styles.heroCrossfade : ''}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        width="520"
        height="220"
        style={{ 
          opacity: loaded ? 1 : 0, 
          transition: 'opacity 350ms ease-in-out',
          transform: 'translate(calc(var(--mouse-x, 0) * -15px), calc(var(--mouse-y, 0) * -10px)) scale(1.05)'
        }}
      />

      {/* Glossy photo paper overlay */}
      <div className={styles.heroOverlay} />

      {/* Weather overlay */}
      {weather && <WeatherOverlayEffect condition={weather.condition} />}

      {/* Weather badge */}
      {weather && (
        <div className={styles.weatherBadge}>
          <span>{weather.icon}</span>
          <span>{weather.tempC}°C</span>
        </div>
      )}

      {/* SVG wave divider */}
      <div className={styles.waveDivider}>
        <svg
          viewBox="0 0 520 32"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,16 C60,28 120,4 180,16 C240,28 300,4 360,16 C420,28 480,4 520,16 L520,32 L0,32 Z"
            fill="var(--paper-base)"
          />
        </svg>
      </div>
    </div>
  );
});

export default HeroImage;
