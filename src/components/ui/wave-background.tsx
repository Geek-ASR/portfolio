
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { FC } from 'react';

interface WaveLayerProps {
  d: string;
  fillColor: string;
  yOffsetRange: [number, number];
  className?: string;
  initialY?: number;
}

const WaveLayer: FC<WaveLayerProps> = ({
  d,
  fillColor,
  yOffsetRange,
  className,
  initialY = 0,
}) => {
  const { scrollYProgress } = useScroll();
  // Adjust transformation: positive values move layer down, negative up
  // We want waves to appear to move "slower" than scroll, or reveal from bottom
  const y = useTransform(scrollYProgress, [0, 1], [initialY, initialY + yOffsetRange[1]]);

  return (
    <motion.svg
      style={{ y, fill: fillColor }}
      viewBox="0 0 1440 320" // Common viewBox for waves
      preserveAspectRatio="xMidYMax slice" // Slice to fill, align bottom
      className={`absolute inset-x-0 bottom-0 w-full h-auto ${className}`} // Position at bottom
      aria-hidden="true"
    >
      <path d={d} />
    </motion.svg>
  );
};

const WaveBackground: FC = () => {
  // Gradient Colors: #0f2027 (darkest), #203a43, #2c5364 (lightest at top, if used that way)
  // For waves, let's use them from bottom up for depth
  const waveColor1 = '#2c5364'; // Lightest blue - furthest wave, appears first from top
  const waveColor2 = '#203a43'; // Mid blue
  const waveColor3 = '#0f2027'; // Darkest blue - closest wave, appears last from top

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#2c5364]"
      aria-hidden="true"
    >
      {/* Waves are stacked. Order in DOM = visual stacking (last is on top) */}
      {/* Furthest wave (appears lower on screen, moves less) */}
      <WaveLayer
        d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,154.7C672,128,768,96,864,106.7C960,117,1056,171,1152,192C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fillColor={waveColor1} // lightest for back
        yOffsetRange={[0, 50]} // Moves slightly
        initialY={-100} // Start slightly off-screen from top if needed, or adjust based on viewport
        className="opacity-70"
      />
      {/* Mid wave */}
      <WaveLayer
        d="M0,224L48,229.3C96,235,192,245,288,250.7C384,256,480,256,576,234.7C672,213,768,171,864,165.3C960,160,1056,192,1152,208C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fillColor={waveColor2}
        yOffsetRange={[0, 100]} // Moves more
        initialY={-50}
        className="opacity-85"
      />
      {/* Closest wave (appears highest on screen, moves most relative to content) */}
      <WaveLayer
        d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,224C672,245,768,267,864,256C960,245,1056,203,1152,192C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        fillColor={waveColor3} // darkest for front
        yOffsetRange={[0, 150]} // Moves most
        initialY={0}
        className="opacity-100"
      />
    </div>
  );
};

export default WaveBackground;
