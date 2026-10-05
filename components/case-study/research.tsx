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
      { threshold: 0.2 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [media?.src, isVideo]);

  if (!media?.src) return null;

  return (
    <div className='w-full h-full rounded-xl overflow-hidden bg-[#dbdbdb] p-8 md:p-20'>
      {isVideo ? (
        <video
          ref={videoRef}
          src={media.src}
          preload='metadata'
          loop
          muted
          playsInline
          className='object-cover w-full h-full shadow-xl rounded-xl'
        />
      ) : (
        <img
          src={media.src}
          alt={alt}
          className='w-full h-full shadow-xl rounded-xl'
        />
      )}
    </div>
  );
}

export default function ResearchSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const media = data.media?.research;

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
      className='flex flex-col justify-center w-full min-h-screen py-16 mx-auto select-none'
    >
      {/* Wide Left-Aligned Media Frame (Center Curtain Reveal - Video & Image Support) */}
      <div className='flex justify-start w-full py-20'>
        <div
          ref={frameRef}
          className='w-full md:w-[65%] aspect-[16/9] will-change-[clip-path,transform]'
        >
          <MediaItem media={media} alt={`${data.name} Research Visual`} />
        </div>
      </div>

      {(data.researchParagraph1 ||
        data.researchParagraph2 ||
        data.researchParagraph3) && (
        <div className='flex items-start justify-between px-40 justw-full'>
          <span>Research</span>
          <div className='flex flex-col max-w-lg gap-4'>
            {data.researchParagraph1 && <p>{data.researchParagraph1}</p>}
            {data.researchParagraph2 && <p>{data.researchParagraph2}</p>}
            {data.researchParagraph3 && <p>{data.researchParagraph3}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
