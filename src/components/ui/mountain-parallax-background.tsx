
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
  viewBox = "0 0 1440 400",
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], yOffsetRange);

  return (
    <motion.svg
      style={{ y }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-x-0 top-0 w-full ${heightClass} ${fillClass} ${opacityClass}`}
      aria-hidden="true"
    >
      <path d={d} />
    </motion.svg>
  );
};

const MountainParallaxBackground: FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Layer 4: Furthest, deep sunset sky color */}
      <MountainLayer
        d="M0,400 L0,320 Q360,280 720,300 T1440,270 L1440,400 Z"
        fillClass="fill-purple-800" // Deep purple/red for distant sunset sky
        opacityClass="opacity-70"
        yOffsetRange={[0, -40]}
        heightClass="h-[calc(100vh+40px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 3: Rich red-orange */}
      <MountainLayer
        d="M0,400 L0,300 L150,330 L300,280 C400,260 500,290 600,270 L750,310 L900,250 C1000,230 1100,280 1200,270 L1350,290 L1440,280 L1440,400 Z"
        fillClass="fill-red-700" // Rich red-orange
        opacityClass="opacity-80"
        yOffsetRange={[0, -80]}
        heightClass="h-[calc(100vh+80px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 2: Bright orange */}
      <MountainLayer
        d="M0,400 L0,280 L200,350 L380,260 L550,340 L720,240 L900,330 L1050,250 L1200,320 L1350,270 L1440,300 L1440,400 Z"
        fillClass="fill-orange-600" // Bright orange
        opacityClass="opacity-90"
        yOffsetRange={[0, -130]}
        heightClass="h-[calc(100vh+130px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 1: Closest, bright yellow-orange */}
      <MountainLayer
        d="M0,400 L0,250 L100,320 L250,220 L400,340 L580,180 L720,300 L850,200 L1000,330 L1150,230 L1300,310 L1440,260 L1440,400 Z"
        fillClass="fill-yellow-500" // Brightest yellow-orange hitting the peaks
        opacityClass="opacity-100"
        yOffsetRange={[0, -200]}
        heightClass="h-[calc(100vh+200px)]"
        viewBox="0 0 1440 400"
      />
    </div>
  );
};

export default MountainParallaxBackground;
