'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Nav from '@/components/nav';
import Footer from '@/components/footer';

gsap.registerPlugin(ScrollTrigger);

interface PlaygroundCard {
  id: number;
  videoUrl?: string;
  alt: string;
}

const CARDS: PlaygroundCard[] = [
  { id: 1, videoUrl: '/playground-videos/component-1.mp4', alt: 'Experiment 01' },
  { id: 2, videoUrl: '/playground-videos/component-2.mp4', alt: 'Experiment 02' },
  { id: 3, videoUrl: '/playground-videos/component-3.mp4', alt: 'Experiment 03' },
  { id: 4, videoUrl: '/playground-videos/component-4.mp4', alt: 'Experiment 04' },
  { id: 5, videoUrl: '/playground-videos/component-5.mp4', alt: 'Experiment 05' },
  { id: 6, videoUrl: '/playground-videos/component-6.mp4', alt: 'Experiment 06' },
  { id: 7, videoUrl: '/playground-videos/component-7.mp4', alt: 'Experiment 07' },
  { id: 8, videoUrl: '/playground-videos/component-8.mp4', alt: 'Experiment 08' },
  { id: 9, videoUrl: '/playground-videos/component-9.mp4', alt: 'Experiment 09' },
  { id: 10, videoUrl: '/playground-videos/component-10.mp4', alt: 'Experiment 10' },
  { id: 11, videoUrl: '/playground-videos/component-11.mp4', alt: 'Experiment 11' },
  { id: 12, videoUrl: '/playground-videos/component-12.mp4', alt: 'Experiment 12' },
];

function MediaCardItem({ item }: { item: PlaygroundCard }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Play video on viewport enter
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item.videoUrl) return;

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
  }, [item.videoUrl]);

  return (
    <div className="curtain-card relative w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900 will-change-[clip-path,transform]">
      <div className="w-full aspect-[16/10] overflow-hidden flex items-center justify-center transition-opacity hover:opacity-95 cursor-pointer">
        {item.videoUrl && (
          <video
            ref={videoRef}
            src={item.videoUrl}
            preload="metadata"
            loop
            muted
            playsInline
            className="object-cover w-full h-full rounded-xl"
          />
        )}
      </div>
    </div>
  );
}

interface SplitTextProps {
  text: string;
  serifWords?: string[];
  className?: string;
}

const SplitText = ({
  text,
  serifWords = [],
  className = '',
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isSerif = serifWords.some((w) => w.toLowerCase() === cleanWord);

        return (
          <span
            key={index}
            className={`reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform] ${
              isSerif ? 'font-serif italic font-normal' : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

export default function PlaygroundPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const words = container.querySelectorAll('.reveal-word');
      const cards = container.querySelectorAll('.curtain-card');

      // Blur + Rise text reveal animation
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            filter: 'blur(12px)',
            y: 16,
          },
          {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1,
            stagger: 0.05,
            ease: 'power3.out',
          }
        );
      }

      // Center horizontally split curtain reveal for grid cards
      cards.forEach((card) => {
        gsap.fromTo(
          card,
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
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col justify-between w-full min-h-screen select-none text-foreground bg-background"
    >
      <Nav />

      <main className="flex-grow w-full px-5 pb-20 pt-28">
        <div className="max-w-xl pb-12 sm:pb-16">
          <h1 className="text-base sm:text-[20px] leading-snug font-sans">
            <SplitText
              text="A collection of ideas, experiments, and components—where curiosity turns into interfaces."
              serifWords={['ideas', 'experiments', 'components']}
            />
          </h1>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-1 md:grid-cols-2">
          {CARDS.map((card) => (
            <MediaCardItem key={card.id} item={card} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}