'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData } from '@/data/projects';

interface OverviewProps {
  data: ProjectData;
}

export default function OverviewSection({ data }: OverviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const media = data.showcase?.mainMedia;

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch((err) => {
        console.warn('Autoplay prevented or failed:', err);
      });
    }
  }, [media?.src]);

  return (
    <section className="w-full min-h-screen mx-auto px-6 py-16 flex flex-col gap-24 md:gap-36">
      {/* 1. Full-Width Showcase Frame */}
      <div className="w-full flex justify-center">
        <div className="w-full aspect-[16/9] rounded-xl overflow-hidden shadow-2xl bg-black">
          {media?.type === 'video' ? (
            <video
              ref={videoRef}
              src={media.src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={media?.src || data.heroVideo}
              alt={`${data.name} Showcase`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* 2. Staggered Text Layout */}
      <div className="w-full flex flex-col gap-16 md:gap-24 text-justify">
        {/* Left Paragraph */}
        <div className="w-full md:w-[35%] flex justify-start">
          <p className="text-xl md:text-2xl font-sans font-normal leading-[1.35] tracking-tight">
            {data.overviewParagraph1}
          </p>
        </div>

        {/* Right Paragraph */}
        <div className="w-full flex justify-end text-justify">
          <div className="w-full md:w-[35%]">
            <p className="text-xl md:text-2xl font-sans font-normal leading-[1.35] tracking-tight">
              {data.overviewParagraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}