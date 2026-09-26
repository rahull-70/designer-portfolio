'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData, MediaSpec } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function MediaFrame({ media, alt }: { media?: MediaSpec; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = media?.type === 'video';

  useEffect(() => {
    if (!frameRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        {
          clipPath: 'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
          scale: 0.95,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [media?.src, isVideo]);

  if (!media?.src) return null;

  return (
    <div
      ref={frameRef}
      className="w-full h-full rounded-xl overflow-hidden will-change-[clip-path,transform] shadow-xl"
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={media.src}
          preload="metadata"
          loop
          muted
          playsInline
          className="w-full h-full object-cover shadow-xl"
        />
      ) : (
        <img
          src={media.src}
          alt={alt}
          className="w-full h-full object-cover shadow-xl"
        />
      )}
    </div>
  );
}

export default function ShowcaseSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const { showcase1, showcase2, showcase3 } = data.media || {};

  if (!showcase1 && !showcase2 && !showcase3) return null;

  return (
    <section
      ref={containerRef}
      className="w-full min-h-screen mx-auto py-16 flex flex-col gap-12 md:gap-24 select-none"
    >
      {/* 1. Left-aligned top mockup */}
      {showcase1 && (
        <div className="w-full flex justify-start">
          <div className="w-full md:w-[60%] aspect-[16/10]">
            <MediaFrame media={showcase1} alt={`${data.name} Showcase 1`} />
          </div>
        </div>
      )}

      {/* 2. Right-aligned center mockup (overlapping flow) */}
      {showcase2 && (
        <div className="w-full flex justify-end -mt-8 md:-mt-16">
          <div className="w-full md:w-[60%] aspect-[16/10]">
            <MediaFrame media={showcase2} alt={`${data.name} Showcase 2`} />
          </div>
        </div>
      )}

      {/* 3. Left-aligned bottom mockup */}
      {showcase3 && (
        <div className="w-full flex justify-start -mt-8 md:-mt-16">
          <div className="w-full md:w-[60%] aspect-[16/10]">
            <MediaFrame media={showcase3} alt={`${data.name} Showcase 3`} />
          </div>
        </div>
      )}
    </section>
  );
}