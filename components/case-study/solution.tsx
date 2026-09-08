'use client';

import React from 'react';
import { ProjectData } from '@/data/projects';

export default function SolutionSection({ data }: { data: ProjectData }) {
  return (
    <section className="w-full min-h-screen mx-auto px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center">
      <div className="max-w-[820px]">
        <p className="text-xl md:text-2xl font-sans font-normal leading-[1.35] tracking-tight text-[#0A0908]">
          {data.solution}
        </p>
      </div>
    </section>
  );
}