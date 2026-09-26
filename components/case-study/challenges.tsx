'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData, MediaSpec } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function MediaItem({ media, alt }: { media?: MediaSpec; alt: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = media?.type === 'video';

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
    <div className='w-full h-full rounded-xl overflow-hidden shadow-xl'>
      {isVideo ? (
        <video
          ref={videoRef}
          src={media.src}
          preload='metadata'
          loop
          muted
          playsInline
          className='w-full h-full object-cover'
        />
      ) : (
        <img
          src={media.src}
          alt={alt}
          className='w-full h-full'
        />
      )}
    </div>
  );
}

export default function ChallengesSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const leftFrameRef = useRef<HTMLDivElement>(null);
  const rightFrameRef = useRef<HTMLDivElement>(null);

  const media1 = data.media?.challengesLeft;
  const media2 = data.media?.challengesRight;

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      [leftFrameRef.current, rightFrameRef.current].forEach((frame) => {
        if (!frame) return;

        gsap.fromTo(
          frame,
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
              trigger: frame,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className='w-full min-h-screen mx-auto py-16 flex flex-col justify-center select-none'
    >
      {/* Asymmetric Media Layout (Center Curtain Reveal - Video & Image Support) */}
      <div className='w-full grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start'>
        <div
          ref={leftFrameRef}
          className='lg:col-span-8 aspect-[16/9] p-8 md:p-20 bg-[#dbdbdb] rounded-2xl will-change-[clip-path,transform]'
        >
          <MediaItem media={media1} alt={`${data.name} Challenge Visual 1`} />
        </div>
        <div
          ref={rightFrameRef}
          className='lg:col-span-4 aspect-square p-8 md:p-20 bg-[#dbdbdb] rounded-2xl will-change-[clip-path,transform]'
        >
          <MediaItem media={media2} alt={`${data.name} Challenge Visual 2`} />
        </div>
      </div>
    </section>
  );
}