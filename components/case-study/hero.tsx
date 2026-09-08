'use client';

import React from 'react';
import { ProjectData } from '@/data/projects';

export default function HeroSection({ data }: { data: ProjectData }) {
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center px-6 md:px-[85px] ">
      {data.logo ? (
        <img
          src={data.logo}
          alt={`${data.name} Logo`}
          className="w-48 md:w-[420px] h-auto object-contain drop-shadow-sm"
        />
      ) : (
        <h1 className="text-6xl sm:text-7xl md:text-8xl tracking-tighter font-sans font-bold text-[#0A0908]">
          {data.name}
        </h1>
      )}
    </section>
  );
}