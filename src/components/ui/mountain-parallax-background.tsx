
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
      {/* Layer 5: Deep Upper Sky (Furthest) */}
      <MountainLayer
        d="M0,150 Q360,50 720,100 T1440,80 L1440,400 L0,400 Z"
        fillClass="fill-gray-900"
        opacityClass="opacity-100"
        yOffsetRange={[0, -30]}
        heightClass="h-[calc(100vh+30px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 4: Sunset Glow Band */}
      <MountainLayer
        d="M0,200 Q360,180 720,190 T1440,170 L1440,280 Q720,300 0,270 Z"
        fillClass="fill-red-600"
        opacityClass="opacity-90"
        yOffsetRange={[0, -60]}
        heightClass="h-[calc(100vh+60px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 3: Distant, Hazy Mountains (More compressed and higher base) */}
      <MountainLayer
        d="M0,400 L0,280 Q150,270 300,285 Q450,300 600,280 Q750,260 900,275 Q1050,290 1200,270 L1440,290 L1440,400 Z"
        fillClass="fill-slate-700"
        opacityClass="opacity-85"
        yOffsetRange={[0, -100]}
        heightClass="h-[calc(100vh+100px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 2: Mid-Ground Mountains (More compressed, starts lower) */}
      <MountainLayer
        d="M0,400 L0,310 Q200,300 400,315 Q600,330 800,310 Q1000,290 1200,305 L1440,320 L1440,400 Z"
        fillClass="fill-neutral-800"
        opacityClass="opacity-100"
        yOffsetRange={[0, -150]}
        heightClass="h-[calc(100vh+150px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 1: Foreground Mountains (Closest, more prominent peaks, starts lower) */}
      <MountainLayer
        d="M-5,400 L-5,340 C150,330 300,350 450,340 C600,330 750,360 900,350 C1050,340 1200,370 1350,360 L1445,350 L1445,400 Z"
        fillClass="fill-black"
        opacityClass="opacity-100"
        yOffsetRange={[0, -220]}
        heightClass="h-[calc(100vh+220px)]"
        viewBox="0 0 1440 400"
      />
    </div>
  );
};

export default MountainParallaxBackground;
