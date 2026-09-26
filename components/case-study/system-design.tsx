'use client';

import React, { useRef, useEffect } from 'react';
import { ProjectData } from '@/data/projects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DEFAULT_FONT_MAP: Record<string, string> = {
  'Inter': 'font-inter',
  'Switzer': 'font-switzer',
  'CartographCF': 'font-cartograph',
  'Hoshiko-Satsuki': 'font-hoshiko',
};

const SplitFontSample = ({ text, fontClassName }: { text: string; fontClassName: string }) => {
  const words = text.trim().split(/\s+/);

  return (
    <div className="flex flex-wrap items-baseline gap-x-[0.2em] gap-y-2 overflow-hidden">
      {words.map((word, index) => (
        <span
          key={index}
          className={`font-sample-word inline-block opacity-0 translate-y-8 text-6xl sm:text-8xl md:text-9xl font-normal leading-none tracking-tight will-change-[opacity,transform] ${fontClassName}`}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export default function SystemDesignSection({ data }: { data: ProjectData }) {
  const containerRef = useRef<HTMLElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const colorSystemRef = useRef<HTMLDivElement>(null);

  const { systemDesign } = data;

  useEffect(() => {
    if (!containerRef.current || !systemDesign) return;

    const ctx = gsap.context(() => {
      // 1. Scroll-linked word-by-word reveal
      if (typographyRef.current) {
        const words = typographyRef.current.querySelectorAll('.font-sample-word');

        if (words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              ease: 'none',
              scrollTrigger: {
                trigger: typographyRef.current,
                start: 'top 85%',
                end: 'top 35%',
                scrub: 0.8,
              },
            }
          );
        }
      }

      // 2. Scroll-linked color block reveal
      if (colorSystemRef.current) {
        const colorCards = colorSystemRef.current.children;

        gsap.fromTo(
          colorCards,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: colorSystemRef.current,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 0.8,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [systemDesign]);

  if (!systemDesign) return null;

  return (
    <section
      ref={containerRef}
      className="w-full max-w-[1600px] mx-auto px-6 py-16 flex flex-col gap-20 select-none"
    >
      {/* 1. Typography Grid */}
      <div
        ref={typographyRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-baseline"
      >
        {systemDesign.fonts.map((font, idx) => {
          // Dynamic font class priority: font.className > DEFAULT_FONT_MAP > font-sans
          const fontClassName =
            font.className || DEFAULT_FONT_MAP[font.name] || 'font-sans';

          return (
            <div key={idx} className="flex flex-col gap-6">
              <span className="text-sm text-zinc-500 font-sans tracking-wide">
                {font.name}
              </span>

              <SplitFontSample text={font.sample} fontClassName={fontClassName} />
            </div>
          );
        })}
      </div>

      {/* 2. Color System */}
      <div className="flex flex-col gap-6">
        <div
          ref={colorSystemRef}
          className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-2xl"
        >
          {systemDesign.colors.map((color, idx) => (
            <div
              key={idx}
              className="p-8 h-[35rem] flex flex-col justify-end will-change-[opacity,transform]"
              style={{
                backgroundColor: color.hex,
                color: color.isDark ? '#FFFFFF' : '#0A0908',
                gridColumn: color.isDark ? 'span 7 / span 7' : 'span 5 / span 5',
              }}
            >
              <div className="flex flex-col gap-1 font-sans">
                <span className="text-2xl font-bold tracking-tight">
                  {color.hex}
                </span>
                <span
                  className={`text-xs tracking-wide ${
                    color.isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {color.rgb}
                </span>
                <span
                  className={`text-xs tracking-wide ${
                    color.isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  {color.rgba}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}