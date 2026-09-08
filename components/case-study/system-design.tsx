'use client';

import React from 'react';
import { ProjectData } from '@/data/projects';

export default function SystemDesignSection({ data }: { data: ProjectData }) {
  const { systemDesign } = data;
  if (!systemDesign) return null;

  return (
    <section className='w-full max-w-[1600px] mx-auto px-6 py-16 flex flex-col gap-16 font-sans'>
      {/* 1. Typography Display Grid */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-end'>
        {systemDesign.fonts.map((font, idx) => (
          <div key={idx} className='flex flex-col gap-4'>
            {/* Font Name */}
            <span className='text-base text-zinc-500 font-sans tracking-wide'>
              {font.name}
            </span>

            {/* Font Sample Render (Image fallback to styled text) */}
            <div className='h-28 flex items-center justify-start'>
              {font.image ? (
                <img
                  src={font.image}
                  alt={`${font.name} Sample`}
                  className='h-24 object-contain'
                />
              ) : (
                <span className='text-7xl sm:text-8xl font-sans font-medium text-[#0A0908] tracking-tight'>
                  {font.sample}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Color System Section */}
      <div className='flex flex-col gap-6'>
        <div className='grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden shadow-sm'>
          {systemDesign.colors.map((color, idx) => (
            <div
              key={idx}
              className={`p-8 h-130 flex flex-col justify-end ${
                color.isDark
                  ? 'md:col-span-7 bg-[#0A0908] text-white'
                  : 'md:col-span-5 bg-[#EDF2F4] text-[#0A0908]'
              }`}
              style={{ backgroundColor: color.hex }}
            >
              <div className='flex flex-col gap-1'>
                <span className='text-2xl font-bold font-sans tracking-tight'>
                  {color.hex}
                </span>
                <span
                  className={`text-xs font-sans tracking-wide ${
                    color.isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {color.rgb}
                </span>
                <span
                  className={`text-xs font-sans tracking-wide ${
                    color.isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {color.rgba}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
