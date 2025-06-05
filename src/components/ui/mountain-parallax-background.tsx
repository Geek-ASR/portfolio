
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import type { FC } from 'react';

interface MountainLayerProps {
  d: string;
  fillColor: string;
  opacityClass?: string;
  yOffsetRange: [number, number];
  heightClass: string;
  viewBox?: string;
}

const MountainLayer: FC<MountainLayerProps> = ({
  d,
  fillColor,
  opacityClass = 'opacity-100',
  yOffsetRange,
  heightClass,
  viewBox = "0 0 1440 400",
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], yOffsetRange);

  return (
    <motion.svg
      style={{ y, fill: fillColor }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-x-0 top-0 w-full ${heightClass} ${opacityClass}`}
      aria-hidden="true"
    >
      <path d={d} />
    </motion.svg>
  );
};

const MountainParallaxBackground: FC = () => {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: '#ABD3DA' }} 
      aria-hidden="true"
    >
      {/* Layer 4: (Was Layer 4, now furthest) */}
      <MountainLayer
        d="M0,280 Q180,220 360,260 T720,240 Q900,210 1080,250 T1440,230 L1440,400 L0,400 Z"
        fillColor="#5c5964"
        opacityClass="opacity-80"
        yOffsetRange={[0, -70]}
        heightClass="h-[calc(100vh+70px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 3: (Was Layer 3) */}
      <MountainLayer
        d="M0,310 Q160,240 320,280 T640,260 Q800,230 960,270 T1280,250 L1440,280 L1440,400 L0,400 Z"
        fillColor="#807d8b"
        opacityClass="opacity-85"
        yOffsetRange={[0, -110]}
        heightClass="h-[calc(100vh+110px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 2: (Was Layer 2) */}
      <MountainLayer
        d="M0,340 Q140,270 280,310 T560,290 Q700,260 840,300 T1120,280 L1440,320 L1440,400 L0,400 Z"
        fillColor="#acaab3"
        opacityClass="opacity-90"
        yOffsetRange={[0, -160]}
        heightClass="h-[calc(100vh+160px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 1: (Was Layer 1, Closest) */}
      <MountainLayer
        d="M0,370 Q120,300 240,340 T480,320 Q600,290 720,330 T960,310 L1200,350 L1440,330 L1440,400 L0,400 Z"
        fillColor="#c3c2c8"
        opacityClass="opacity-100"
        yOffsetRange={[0, -220]}
        heightClass="h-[calc(100vh+220px)]"
        viewBox="0 0 1440 400"
      />
    </div>
  );
};

export default MountainParallaxBackground;
