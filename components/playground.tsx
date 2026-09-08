'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

// ============================================================================
// 🎨 PLAYGROUND DATA CONFIG (12 ITEMS WITH VIDEO PLAYERS)
// ============================================================================

const PLAYGROUND_ITEMS = [
  { id: 1, label: '01', videoUrl: '/videos/component-1.mp4' },
  { id: 2, label: '02', videoUrl: '/videos/component-2.mp4' },
  { id: 3, label: '03', videoUrl: '/videos/component-3.mp4' },
  { id: 4, label: '04', videoUrl: '/videos/component-4.mp4' },
  { id: 5, label: '05', videoUrl: '/videos/component-5.mp4' },
  { id: 6, label: '06', videoUrl: '/videos/component-6.mp4' },
  { id: 7, label: '07', videoUrl: '/videos/component-7.mp4' },
  { id: 8, label: '08', videoUrl: '/videos/component-8.mp4' },
  { id: 9, label: '09', videoUrl: '/videos/component-9.mp4' },
  { id: 10, label: '10', videoUrl: '/videos/component-10.mp4' },
  { id: 11, label: '11', videoUrl: '/videos/component-11.mp4' },
  { id: 12, label: '12', videoUrl: '/videos/component-12.mp4' },
];

// ============================================================================
// 🚀 PLAYGROUND MAIN COMPONENT WITH REVEAL ANIMATION
// ============================================================================

export default function Playground() {
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const initialDotRef = useRef<HTMLButtonElement>(null);
  const dotCircleRef = useRef<HTMLDivElement>(null);
  const dotTextRef = useRef<HTMLSpanElement>(null);
  const pingRingRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // 0. Intro Animation & Ambient Pulse for the Center Trigger
  useEffect(() => {
    if (!initialDotRef.current || isRevealed) return;

    const ctx = gsap.context(() => {
      // Scale-in reveal for the starter dot + label text
      const introTl = gsap.timeline();

      introTl
        .fromTo(
          dotCircleRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)' }
        )
        .fromTo(
          dotTextRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 0.7, duration: 0.5, ease: 'power2.out' },
          '-=0.3'
        );

      // Continuous breathing / ping effect to draw attention
      gsap.to(pingRingRef.current, {
        scale: 2.5,
        opacity: 0,
        duration: 1.8,
        repeat: -1,
        ease: 'power2.out',
      });
    }, initialDotRef);

    return () => ctx.revert();
  }, [isRevealed]);

  const handleReveal = () => {
    if (isRevealed || isAnimating) return;
    setIsAnimating(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsRevealed(true);
        setIsAnimating(false);
      },
    });

    // 1. Shrink and fade out the center trigger button
    timeline.to(initialDotRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
    });

    // 2. Animate all grid items outward from scale 0 to 1 with an elastic stagger
    if (gridContainerRef.current) {
      const items = Array.from(gridContainerRef.current.children);

      timeline.fromTo(
        items,
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.65,
          ease: 'back.out(1.6)',
          stagger: {
            grid: [3, 4],
            from: 'center',
            amount: 0.35,
          },
        },
        '-=0.1'
      );
    }
  };

  return (
    <section className="relative w-full min-h-screen text-foreground font-sans p-8 md:p-16 flex flex-col items-center justify-center select-none overflow-hidden">
      {/* Central Starter Dot (Shown before reveal) */}
      {!isRevealed && (
        <button
          ref={initialDotRef}
          onClick={handleReveal}
          className="absolute z-50 group flex flex-col items-center justify-center cursor-pointer outline-none"
        >
          <div className="relative flex items-center justify-center">
            {/* Ambient Breathing Outer Ring */}
            <div
              ref={pingRingRef}
              className="absolute w-4 h-4 rounded-full border border-foreground/40 pointer-events-none"
            />
            {/* Main Interactive Center Dot */}
            <div
              ref={dotCircleRef}
              className="w-4 h-4 rounded-full bg-foreground group-hover:scale-150 transition-transform duration-300 shadow-md"
            />
          </div>
          <span
            ref={dotTextRef}
            className="mt-3 text-[10px] font-sans tracking-widest text-zinc-500 group-hover:opacity-100 transition-opacity"
          >
            Click to reveal
          </span>
        </button>
      )}

      {/* Grid Container (3 rows of 4 items = 12 items) */}
      <div
        ref={gridContainerRef}
        className="w-full max-w-6xl mx-auto py-12 grid grid-cols-2 sm:grid-cols-4 gap-y-28 gap-x-16 md:gap-y-40 md:gap-x-24 place-items-center"
      >
        {PLAYGROUND_ITEMS.map((item) => {
          const isHovered = activeItem === item.id;

          return (
            <div
              key={item.id}
              className={`relative flex items-center justify-start group ${
                !isRevealed ? 'opacity-0 scale-0 pointer-events-none' : ''
              }`}
              onMouseEnter={() => isRevealed && setActiveItem(item.id)}
              onMouseLeave={() => isRevealed && setActiveItem(null)}
            >
              {/* Number and Dot Trigger */}
              <div className="inline-flex items-center gap-2 cursor-pointer z-10">
                <span className="text-xs font-mono font-normal text-zinc-600 transition-colors duration-200 group-hover:text-foreground">
                  {item.label}
                </span>
                <div className="w-2.5 h-2.5 rounded-full bg-foreground transition-transform duration-200 group-hover:scale-125" />
              </div>

              {/* Hover Popup Video Player Card */}
              <div
                className={`absolute top-4 left-6 w-48 h-36 bg-black/90 overflow-hidden shadow-2xl transition-all duration-300 ease-out z-30 pointer-events-none ${
                  isHovered
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-90 translate-y-2'
                }`}
              >
                {item.videoUrl && (
                  <video
                    src={item.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}