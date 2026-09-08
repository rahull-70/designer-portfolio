'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData, MediaSpec } from '@/data/projects';

function MediaItem({ media, alt }: { media?: MediaSpec; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.play().catch(() => {});
    }
  }, [media?.src]);

  if (!media?.src) return null;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-black">
      {media.type === 'video' ? (
        <video
          ref={videoRef}
          src={media.src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <img src={media.src} alt={alt} className="w-full h-full object-cover" />
      )}
    </div>
  );
}

export default function ResearchSection({ data }: { data: ProjectData }) {
  const media = data.showcase?.researchMedia;

  return (
    <section className="w-full min-h-screen mx-auto px-6 py-16 flex flex-col gap-16 md:gap-24">
      {/* 1. Wide Left-Aligned Media Frame */}
      <div className="w-full flex justify-start">
        <div className="w-full md:w-[65%] aspect-[16/10]">
          <MediaItem media={media} alt={`${data.name} Research Visual`} />
        </div>
      </div>

      {/* 2. Right-Aligned Text Paragraph */}
      <div className="w-full flex justify-end">
        <div className="w-full md:w-[35%]">
          <p className="text-xl md:text-2xl font-sans font-normal leading-[1.35] tracking-tight text-[#0A0908]">
            {data.research}
          </p>
        </div>
      </div>
    </section>
  );
}