/**
 * RangeAnnotation — SVG handwriting underline with stroke-dashoffset draw-in.
 * Used under range labels in the notes panel.
 */

import { memo, useId } from 'react';
import styles from '../../styles/notes.module.css';

interface RangeAnnotationProps {
  text: string;
}

const RangeAnnotation = memo(function RangeAnnotation({ text }: RangeAnnotationProps) {
  const id = useId();

  // Generate a slightly wobbly path that spans the text width
  const pathD =
    'M 0,6 Q 8,3 16,6 T 32,6 T 48,6 T 64,6 T 80,6 T 96,6 T 112,6 T 128,6 T 144,6 T 160,5';

  return (
    <span className={styles.rangeAnnotation}>
      {text}
      <svg viewBox="0 0 160 12" preserveAspectRatio="none" aria-hidden="true">
        <path
          d={pathD}
          className={styles.annotationPath}
          key={id + text} /* Re-trigger animation on text change */
        />
      </svg>
    </span>
  );
});

export default RangeAnnotation;
