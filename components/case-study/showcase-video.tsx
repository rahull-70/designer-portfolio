'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ShowcaseVideoSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const media = data?.media?.solutionVideo;
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
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (!media || !media.src) return null;

  return (
    <section
      ref={containerRef}
      className="w-full min-h-screen mx-auto py-12 md:py-20 select-none flex items-center justify-center"
    >
      <div
        ref={frameRef}
        className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-[#dbdbdb] p-8 md:p-20 will-change-[clip-path,transform]"
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={media.src}
            preload="metadata"
            loop
            muted
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media.src}
            alt={`${data.name || 'Project'} Solution Showcase`}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </section>
  );
}