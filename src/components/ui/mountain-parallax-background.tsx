
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
  viewBox = "0 0 1440 400", // Standard viewBox, content will scale
}) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], yOffsetRange);

  return (
    <motion.svg
      style={{ y }}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice" // Ensures the SVG fills the container and maintains aspect ratio
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
        d="M0,150 Q360,50 720,100 T1440,80 L1440,400 L0,400 Z" // High arching sky
        fillClass="fill-gray-900"
        opacityClass="opacity-100"
        yOffsetRange={[0, -30]}
        heightClass="h-[calc(100vh+30px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 4: Sunset Glow Band */}
      <MountainLayer
        d="M0,200 Q360,180 720,190 T1440,170 L1440,280 Q720,300 0,270 Z" // Glow band, slightly uneven
        fillClass="fill-red-600"
        opacityClass="opacity-90"
        yOffsetRange={[0, -60]}
        heightClass="h-[calc(100vh+60px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 3: Distant, Hazy Mountains */}
      <MountainLayer
        d="M0,400 L0,280 C100,260 250,300 400,270 C550,240 650,280 720,260 C800,240 950,290 1100,250 L1250,280 L1440,240 L1440,400 Z"
        fillClass="fill-slate-700"
        opacityClass="opacity-85"
        yOffsetRange={[0, -100]}
        heightClass="h-[calc(100vh+100px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 2: Mid-Ground Mountains */}
      <MountainLayer
        d="M0,400 L0,300 C150,330 300,280 450,310 C600,340 700,290 800,320 C900,350 1050,300 1200,330 L1350,290 L1440,320 L1440,400 Z"
        fillClass="fill-neutral-800"
        opacityClass="opacity-100"
        yOffsetRange={[0, -150]}
        heightClass="h-[calc(100vh+150px)]"
        viewBox="0 0 1440 400"
      />
      {/* Layer 1: Foreground Mountains (Closest) */}
      <MountainLayer
        d="M-5,400 L-5,320 C100,350 200,280 350,340 C500,400 580,300 720,350 C850,400 950,310 1100,360 C1250,410 1350,320 1445,370 L1445,400 Z"
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
