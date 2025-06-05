
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { FC } from 'react';

interface MountainLayerProps {
  d: string;
  fillColor: string; // Changed from fillClass to fillColor
  opacityClass?: string;
  yOffsetRange: [number, number];
  heightClass: string;
  viewBox?: string;
}

const MountainLayer: FC<MountainLayerProps> = ({
  d,
  fillColor, // Use fillColor
  opacityClass = 'opacity-100',
  yOffsetRange,
  heightClass,
  viewBox = "0 0 1440 400",
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], yOffsetRange);

  return (
    <motion.svg
      style={{ y }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      // Removed fillClass from here, it's now applied to the path
      className={`absolute inset-x-0 top-0 w-full ${heightClass} ${opacityClass}`}
      aria-hidden="true"
    >
      {/* Apply fillColor directly to the path */}
      <path d={d} style={{ fill: fillColor }} />
    </motion.svg>
  );
};

const MountainParallaxBackground: FC = () => {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: '#eed1b5' }}
      aria-hidden="true"
    >
      {/* Layer 3: Distant Mountains */}
      <MountainLayer
        d="M0,280 Q180,220 360,250 T720,230 Q900,210 1080,240 T1440,220 L1440,400 L0,400 Z"
        fillColor="#735446" // Updated color
        opacityClass="opacity-85"
        yOffsetRange={[0, -80]}
        heightClass="h-[calc(100vh+80px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 2: Mid-Ground Mountains */}
      <MountainLayer
        d="M0,320 Q150,250 300,280 Q450,220 600,270 Q750,200 900,260 Q1050,230 1200,280 L1440,250 L1440,400 L0,400 Z"
        fillColor="#735446" // Updated color
        opacityClass="opacity-95"
        yOffsetRange={[0, -130]}
        heightClass="h-[calc(100vh+130px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 1: Foreground Mountains */}
      <MountainLayer
        d="M0,400 L0,350 Q120,280 240,310 Q360,240 480,300 Q600,220 720,290 Q840,250 960,320 Q1080,260 1200,310 L1320,280 L1440,340 L1440,400 Z"
        fillColor="#735446" // Updated color
        opacityClass="opacity-100"
        yOffsetRange={[0, -200]}
        heightClass="h-[calc(100vh+200px)]"
        viewBox="0 0 1440 400"
      />
    </div>
  );
};

export default MountainParallaxBackground;
