'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextProps {
  text: string;
  className?: string;
}

const SplitText = ({ text, className = '' }: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className='reveal-word inline-block mr-[0.22em] opacity-0 translate-y-[15px] will-change-[opacity,transform]'
        >
          {word}
        </span>
      ))}
    </span>
  );
};

export default function SolutionSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const ctx = gsap.context(() => {
      const words = textRef.current?.querySelectorAll('.reveal-word');

      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            ease: 'power1.out',
            force3D: true,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              end: 'bottom 40%',
              scrub: 0.5, // Reduced scrub smooths out high-frequency scroll spikes
              invalidateOnRefresh: true, // Recalculate triggers on resize/font-load
            },
          },
        );
      }
    }, containerRef);

    // Refresh ScrollTrigger after custom fonts finish loading to prevent offset jumps
    if (document.fonts) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => ctx.revert();
  }, [data?.solution]);

  return (
    <section
      ref={containerRef}
      className='w-full min-h-screen mx-auto px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center select-none'
    >
      <div ref={textRef} className='max-w-[820px]'>
        <p className='text-xl md:text-2xl font-playfair font-normal leading-[1.35] tracking-tight'>
          <SplitText text={data?.solution || ''} />
        </p>
      </div>
    </section>
  );
}