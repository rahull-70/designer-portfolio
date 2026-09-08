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
    <div className="w-full h-full rounded-xl overflow-hidden shadow-xl bg-black">
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

export default function ChallengesSection({ data }: { data: ProjectData }) {
  const media1 = data.showcase?.secondaryMedia1;
  const media2 = data.showcase?.secondaryMedia2;

  return (
    <section className="w-full min-h-screen mx-auto px-6 py-16 flex flex-col gap-24 md:gap-36">
      {/* 1. Asymmetric Media Layout (Wide Left, Small Right) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-8 aspect-[16/10]">
          <MediaItem media={media1} alt={`${data.name} Challenge Visual 1`} />
        </div>
        <div className="lg:col-span-4 aspect-square">
          <MediaItem media={media2} alt={`${data.name} Challenge Visual 2`} />
        </div>
      </div>

      {/* 2. Staggered Paragraph Text */}
      <div className="w-full flex flex-col gap-16 md:gap-24 text-justify">
        <div className="w-full md:w-[35%] flex justify-start">
          <p className="text-xl md:text-2xl font-sans font-normal leading-[1.35] tracking-tight text-[#0A0908]">
            {data.challengesParagraph1}
          </p>
        </div>

        <div className="w-full flex justify-end text-justify">
          <div className="w-full md:w-[35%]">
            <p className="text-xl md:text-2xl font-sans font-normal leading-[1.35] tracking-tight text-[#0A0908]">
              {data.challengesParagraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}