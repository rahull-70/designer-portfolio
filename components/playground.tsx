'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import gsap from 'gsap';

// ============================================================================
// 🎨 PLAYGROUND DATA CONFIG (12 ITEMS WITH VIDEO PLAYERS)
// ============================================================================

const PLAYGROUND_ITEMS = [
  { id: 1, label: '01', videoUrl: '/playground-videos/component-1.webm' },
  { id: 2, label: '02', videoUrl: '/playground-videos/component-2.webm' },
  { id: 3, label: '03', videoUrl: '/playground-videos/component-3.webm' },
  { id: 4, label: '04', videoUrl: '/playground-videos/component-4.webm' },
  { id: 5, label: '05', videoUrl: '/playground-videos/component-5.webm' },
  { id: 6, label: '06', videoUrl: '/playground-videos/component-6.webm' },
  { id: 7, label: '07', videoUrl: '/playground-videos/component-7.webm' },
  { id: 8, label: '08', videoUrl: '/playground-videos/component-8.webm' },
  { id: 9, label: '09', videoUrl: '/playground-videos/component-9.webm' },
  { id: 10, label: '10', videoUrl: '/playground-videos/component-10.webm' },
  { id: 11, label: '11', videoUrl: '/playground-videos/component-11.webm' },
  { id: 12, label: '12', videoUrl: '/playground-videos/component-12.webm' },
];

// ============================================================================
// 🎥 LAZY VIDEO COMPONENT (Only renders video stream on active hover)
// ============================================================================

const VideoCard = memo(
  ({ isHovered, videoUrl }: { isHovered: boolean; videoUrl: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
      if (isHovered && videoRef.current) {
        videoRef.current.play().catch(() => {
          // Fallback handling for browser autoplay policies
        });
      } else if (!isHovered && videoRef.current) {
        videoRef.current.pause();
      }
    }, [isHovered]);

    return (
      <div
        className={`absolute top-4 left-6 w-48 h-36 bg-black/90 overflow-hidden shadow-2xl transition-all duration-300 ease-out z-30 pointer-events-none ${
          isHovered
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-90 translate-y-2'
        }`}
      >
        {isHovered && videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            preload='none'
            className='object-cover w-full h-full'
          />
        )}
      </div>
    );
  },
);

VideoCard.displayName = 'VideoCard';

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
      const introTl = gsap.timeline();

      introTl
        .fromTo(
          dotCircleRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(2)' },
        )
        .fromTo(
          dotTextRef.current,
          { y: 8, opacity: 0 },
          { y: 0, opacity: 0.7, duration: 0.5, ease: 'power2.out' },
          '-=0.3',
        );

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

    timeline.to(initialDotRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
    });

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
        '-=0.1',
      );
    }
  };

  return (
    <section className='relative flex flex-col items-center justify-center w-full min-h-screen p-8 overflow-hidden font-sans select-none text-foreground md:p-16'>
      {/* Central Starter Dot (Shown before reveal) */}
      {!isRevealed && (
        <button
          ref={initialDotRef}
          onClick={handleReveal}
          className='absolute z-50 flex flex-col items-center justify-center outline-none cursor-pointer group'
        >
          <div className='relative flex items-center justify-center'>
            <div
              ref={pingRingRef}
              className='absolute w-4 h-4 border rounded-full pointer-events-none border-foreground/40'
            />
            <div
              ref={dotCircleRef}
              className='w-4 h-4 transition-transform duration-300 rounded-full shadow-md bg-foreground group-hover:scale-150'
            />
          </div>
          <span
            ref={dotTextRef}
            className='mt-3 text-[10px] font-sans tracking-widest text-zinc-500 group-hover:opacity-100 transition-opacity'
          >
            Click to reveal
          </span>
        </button>
      )}

      {/* Grid Container */}
      <div
        ref={gridContainerRef}
        className='grid w-full max-w-6xl grid-cols-2 py-12 mx-auto sm:grid-cols-4 gap-y-28 gap-x-16 md:gap-y-40 md:gap-x-24 place-items-center'
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
              <div className='z-10 inline-flex items-center gap-2 cursor-pointer'>
                <span className='font-mono text-xs font-normal transition-colors duration-200 text-zinc-600 group-hover:text-foreground'>
                  {item.label}
                </span>
                <div className='w-2.5 h-2.5 rounded-full bg-foreground transition-transform duration-200 group-hover:scale-125' />
              </div>

              {/* Lazy-Loaded Hover Popup Video Player Card */}
              <VideoCard isHovered={isHovered} videoUrl={item.videoUrl} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
