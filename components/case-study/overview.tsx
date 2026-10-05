'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface OverviewProps {
  data: ProjectData;
}

export default function OverviewSection({ data }: OverviewProps) {
  const containerRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const media = data.media?.hero;
  const mediaSrc = media?.src || data.heroVideo;
  const isVideo =
    media?.type === 'video' || Boolean(!media?.type && data.heroVideo);

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
      { threshold: 0.2 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [mediaSrc, isVideo]);

  useEffect(() => {
    if (!containerRef.current || !frameRef.current) return;

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
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className='flex flex-col justify-center w-full min-h-screen gap-16 py-16 mx-auto select-none'
    >
      {/* Geometry Center Curtain Reveal (Image or Video) */}
      {mediaSrc && (
        <div className='flex justify-center w-full'>
          <div
            ref={frameRef}
            className='w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#dbdbdb] will-change-[clip-path,transform] shadow-xl'
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={mediaSrc}
                preload='metadata'
                loop
                muted
                playsInline
                className='w-full h-full p-8 shadow-xl md:p-20'
              />
            ) : (
              <img
                src={mediaSrc}
                alt={`${data.name} Hero`}
                className='w-full h-full p-8 shadow-xl md:p-20'
              />
            )}
          </div>
        </div>
      )}

      {/* Overview Text Block below media */}
      {(data.overviewParagraph1 || data.overviewParagraph2) && (
        <div className='flex items-start justify-between w-full px-40 text-[16px]'>
          <span>Overview</span>
          <div className='flex flex-col max-w-lg gap-4'>
            {data.overviewParagraph1 && <p>{data.overviewParagraph1}</p>}
            {data.overviewParagraph2 && <p>{data.overviewParagraph2}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
