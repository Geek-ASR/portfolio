
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { FC } from 'react';

interface MountainLayerProps {
  d: string;
  fillClass: string;
  opacityClass?: string;
  yOffsetRange: [number, number];
  heightClass: string;
  viewBox?: string;
}

const MountainLayer: FC<MountainLayerProps> = ({
  d,
  fillClass,
  opacityClass = 'opacity-100',
  yOffsetRange,
  heightClass,
  viewBox = "0 0 1440 400", // Default viewBox, paths should be drawn relative to this
}) => {
  const { scrollYProgress } = useScroll();
  // Transform Y from 0 (top of page scroll) to 1 (bottom of page scroll)
  // to the specified yOffsetRange (e.g., [0, -50] means move up by 50px)
  const y = useTransform(scrollYProgress, [0, 1], yOffsetRange);

  return (
    <motion.svg
      style={{ y }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice" // Ensures the SVG content covers the area, maintaining aspect ratio
      className={`absolute inset-x-0 bottom-0 w-full ${heightClass} ${fillClass} ${opacityClass}`}
      aria-hidden="true"
    >
      <path d={d} />
    </motion.svg>
  );
};

const MountainParallaxBackground: FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Layer 4: Furthest, darkest, moves least */}
      <MountainLayer
        d="M0,400 L0,250 Q180,200 360,260 Q540,190 720,270 Q900,180 1080,260 L1260,220 L1440,240 L1440,400 Z"
        fillClass="fill-blue-900"
        opacityClass="opacity-100"
        yOffsetRange={[0, -40]} // Moves up by max 40px
        heightClass="h-[65vh]" // Covers lower 65% of viewport height
        viewBox="0 0 1440 400"
      />
      {/* Layer 3 */}
      <MountainLayer
        d="M0,400 L0,280 Q200,210 400,290 Q600,220 800,300 L1000,250 L1200,290 L1440,260 L1440,400 Z"
        fillClass="fill-blue-700"
        opacityClass="opacity-90"
        yOffsetRange={[0, -80]} // Moves up by max 80px
        heightClass="h-[75vh]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 2 */}
      <MountainLayer
        d="M0,400 L0,300 Q180,220 360,310 Q540,230 720,320 Q900,240 1080,310 L1260,250 L1440,300 L1440,400 Z"
        fillClass="fill-blue-600"
        opacityClass="opacity-85"
        yOffsetRange={[0, -130]} // Moves up by max 130px
        heightClass="h-[85vh]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 1: Closest, lightest, moves most */}
      <MountainLayer
        d="M0,400 L0,330 Q250,240 500,340 Q750,250 1000,350 L1250,280 L1440,340 L1440,400 Z"
        fillClass="fill-blue-500"
        opacityClass="opacity-80"
        yOffsetRange={[0, -200]} // Moves up by max 200px
        heightClass="h-full" // Covers full height from bottom for the closest layer
        viewBox="0 0 1440 400"
      />
    </div>
  );
};

export default MountainParallaxBackground;
