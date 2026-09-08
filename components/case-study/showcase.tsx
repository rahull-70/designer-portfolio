'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData, MediaSpec } from '@/data/projects';

function MediaFrame({ media, alt }: { media?: MediaSpec; alt: string }) {
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
    <div className="w-full h-full rounded-xl overflow-hidden bg-black ">
      {media.type === 'video' ? (
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
          src={media.src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default function ShowcaseSection({ data }: { data: ProjectData }) {
  const { sideVisual1, sideVisual2, sideVisual3 } = data.showcase || {};

  if (!sideVisual1 && !sideVisual2 && !sideVisual3) return null;

  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 py-16 flex flex-col gap-8 md:gap-12">
      {/* 1. Large Top Showcase Image (slash-img-5) */}
      {sideVisual1 && (
        <div className="w-full aspect-[16/9] md:aspect-[21/9]">
          <MediaFrame media={sideVisual1} alt={`${data.name} Showcase 1`} />
        </div>
      )}

      {/* 2. Grid for the remaining 2 Showcase Images (slash-img-6 & slash-img-7) */}
      {(sideVisual2 || sideVisual3) && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {sideVisual2 && (
            <div className="w-full aspect-[4/3]">
              <MediaFrame media={sideVisual2} alt={`${data.name} Showcase 2`} />
            </div>
          )}
          {sideVisual3 && (
            <div className="w-full aspect-[4/3]">
              <MediaFrame media={sideVisual3} alt={`${data.name} Showcase 3`} />
            </div>
          )}
        </div>
      )}
    </section>
  );
}