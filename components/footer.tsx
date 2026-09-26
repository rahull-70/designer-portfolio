'use client';

import React, { useRef, useEffect, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const COLS = 110;
const CUSTOM_RAMP = ' .:`-^~*+?s%#@$';
const HOVER_RADIUS_CELLS = 7.5;

interface ScrambleParticle {
  r: number;
  c: number;
  char: string;
  originalChar: string;
  duration: number;
  startTime: number;
}

class AsciiCanvasHand {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imagePath: string;
  cols: number;
  rows: number = 0;
  charGrid: string[][] = [];
  activeParticles: Map<string, ScrambleParticle> = new Map();
  isLoaded: boolean = false;
  fontSize: number = 10;
  cellWidth: number = 6;
  cellHeight: number = 10;

  constructor(canvas: HTMLCanvasElement, imagePath: string) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true })!;
    this.imagePath = imagePath;
    this.cols = COLS;
  }

  load(onComplete?: () => void) {
    if (this.isLoaded) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = this.imagePath;

    img.onload = () => {
      const charAspect = 0.55;
      this.rows = Math.floor(
        this.cols * ((img.height / img.width) * charAspect)
      );

      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCanvas.width = this.cols;
      offCanvas.height = this.rows;

      offCtx.filter = 'contrast(1.6) brightness(0.95)';
      offCtx.drawImage(img, 0, 0, this.cols, this.rows);
      const pixels = offCtx.getImageData(0, 0, this.cols, this.rows).data;

      this.charGrid = [];
      for (let r = 0; r < this.rows; r++) {
        const row: string[] = [];
        for (let c = 0; c < this.cols; c++) {
          const idx = (r * this.cols + c) * 4;
          const rPixel = pixels[idx];
          const gPixel = pixels[idx + 1];
          const bPixel = pixels[idx + 2];
          const alpha = pixels[idx + 3];

          if (alpha < 20 || (rPixel > 240 && gPixel > 240 && bPixel > 240)) {
            row.push(' ');
          } else {
            const brightness =
              (0.299 * rPixel + 0.587 * gPixel + 0.114 * bPixel) / 255;
            const darkness = 1.0 - brightness;
            const normalized = Math.max(0, Math.min(1, darkness));
            const rawIdx = Math.floor(normalized * (CUSTOM_RAMP.length - 1));
            row.push(CUSTOM_RAMP[rawIdx]);
          }
        }
        this.charGrid.push(row);
      }

      this.resizeCanvas();
      this.isLoaded = true;
      if (onComplete) onComplete();
    };
  }

  resizeCanvas() {
    if (!this.rows || !this.cols) return;
    const dpr = window.devicePixelRatio || 1;
    // Updated cell width calculation targeting dynamic 44% width span
    this.cellWidth = Math.max(4, Math.floor((window.innerWidth * 0.48) / this.cols));
    this.cellHeight = Math.floor(this.cellWidth / 0.55);
    this.fontSize = this.cellHeight;

    const displayWidth = this.cols * this.cellWidth;
    const displayHeight = this.rows * this.cellHeight;

    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.ctx.scale(dpr, dpr);
    this.ctx.font = `${this.fontSize}px 'Courier New', monospace`;
    this.ctx.textBaseline = 'top';
  }

  triggerProximity(mouseX: number, mouseY: number) {
    if (!this.isLoaded) return;
    const rect = this.canvas.getBoundingClientRect();
    const relX = mouseX - rect.left;
    const relY = mouseY - rect.top;

    const targetCol = relX / this.cellWidth;
    const targetRow = relY / this.cellHeight;

    const rMin = Math.max(0, Math.floor(targetRow - HOVER_RADIUS_CELLS));
    const rMax = Math.min(this.rows - 1, Math.ceil(targetRow + HOVER_RADIUS_CELLS));
    const cMin = Math.max(0, Math.floor(targetCol - HOVER_RADIUS_CELLS));
    const cMax = Math.min(this.cols - 1, Math.ceil(targetCol + HOVER_RADIUS_CELLS));

    const now = performance.now();

    for (let r = rMin; r <= rMax; r++) {
      for (let c = cMin; c <= cMax; c++) {
        const dy = (r - targetRow) * 1.5;
        const dx = c - targetCol;
        const dist = Math.hypot(dx, dy);

        if (dist / HOVER_RADIUS_CELLS <= 1.0) {
          const probability = Math.pow(1 - dist / HOVER_RADIUS_CELLS, 1.8);
          if (Math.random() < probability) {
            const orig = this.charGrid[r]?.[c];
            if (orig && orig !== ' ') {
              const key = `${r}_${c}`;
              if (!this.activeParticles.has(key)) {
                this.activeParticles.set(key, {
                  r,
                  c,
                  char: CUSTOM_RAMP[Math.floor(Math.random() * CUSTOM_RAMP.length)],
                  originalChar: orig,
                  duration: 100 + Math.random() * 180,
                  startTime: now,
                });
              }
            }
          }
        }
      }
    }
  }

  render() {
    if (!this.isLoaded) return;
    const now = performance.now();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.activeParticles.forEach((p, key) => {
      if (now - p.startTime > p.duration) {
        this.activeParticles.delete(key);
      } else {
        p.char = CUSTOM_RAMP[Math.floor(Math.random() * CUSTOM_RAMP.length)];
      }
    });

    const isDark = document.documentElement.classList.contains('dark');
    const defaultColor = isDark ? '#ffffff' : '#000000';
    const activeBg = isDark ? '#ffffff' : '#000000';
    const activeFg = isDark ? '#000000' : '#ffffff';

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const key = `${r}_${c}`;
        const active = this.activeParticles.get(key);
        const char = active ? active.char : this.charGrid[r][c];

        if (char !== ' ') {
          if (active) {
            this.ctx.fillStyle = activeBg;
            this.ctx.fillRect(
              c * this.cellWidth,
              r * this.cellHeight,
              this.cellWidth,
              this.cellHeight
            );
            this.ctx.fillStyle = activeFg;
          } else {
            this.ctx.fillStyle = defaultColor;
          }
          this.ctx.fillText(char, c * this.cellWidth, r * this.cellHeight);
        }
      }
    }
  }
}

const RollingText = ({ label }: { label: string }) => (
  <span className="inline-flex overflow-hidden py-0.5">
    {label.split('').map((char, index) => (
      <span
        key={index}
        className="relative inline-block h-[1.15em] overflow-hidden"
      >
        <span
          className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2"
          style={{ transitionDelay: `${index * 25}ms` }}
        >
          <span className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
          <span className="inline-block">{char === ' ' ? '\u00A0' : char}</span>
        </span>
      </span>
    ))}
  </span>
);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const leftHandWrapRef = useRef<HTMLDivElement>(null);
  const rightHandWrapRef = useRef<HTMLDivElement>(null);
  const leftParallaxRef = useRef<HTMLDivElement>(null);
  const rightParallaxRef = useRef<HTMLDivElement>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);

  // 1. Hover Scramble Initialization
  useEffect(() => {
    const canvasLeft = canvasLeftRef.current;
    const canvasRight = canvasRightRef.current;
    const footer = footerRef.current;
    if (!canvasLeft || !canvasRight || !footer) return;

    const leftHand = new AsciiCanvasHand(canvasLeft, '/left-hand.png');
    const rightHand = new AsciiCanvasHand(canvasRight, '/right-hand.png');

    let isFooterVisible = false;
    let animFrameId: number;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isFooterVisible = entry.isIntersecting;
          if (entry.isIntersecting) {
            leftHand.load();
            rightHand.load();
          }
        });
      },
      { rootMargin: '100px' }
    );

    observer.observe(footer);

    const handleMouseMove = (e: MouseEvent) => {
      if (!isFooterVisible) return;
      leftHand.triggerProximity(e.clientX, e.clientY);
      rightHand.triggerProximity(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      leftHand.resizeCanvas();
      rightHand.resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    const renderLoop = () => {
      if (isFooterVisible) {
        leftHand.render();
        rightHand.render();
      }
      animFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // 2. Entrance Reveal Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!footerRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      if (leftHandWrapRef.current) {
        tl.fromTo(
          leftHandWrapRef.current,
          { xPercent: -120, yPercent: 40, scale: 1.2, opacity: 0 },
          { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, ease: 'power3.out', duration: 1 },
          0
        );
      }

      if (rightHandWrapRef.current) {
        tl.fromTo(
          rightHandWrapRef.current,
          { xPercent: 120, yPercent: 40, scale: 1.2, opacity: 0 },
          { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, ease: 'power3.out', duration: 1 },
          0
        );
      }

      const revealItems = footerRef.current.querySelectorAll('.footer-reveal-text');
      if (revealItems.length > 0) {
        tl.fromTo(
          revealItems,
          { y: '100%', opacity: 0 },
          { y: '0%', opacity: 1, stagger: 0.08, ease: 'power3.out', duration: 0.8 },
          0.2
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // 3. 3D Cursor Parallax
  useEffect(() => {
    const footer = footerRef.current;
    const leftParallax = leftParallaxRef.current;
    const rightParallax = rightParallaxRef.current;
    if (!footer || !leftParallax || !rightParallax) return;

    const handleParallax = (e: MouseEvent) => {
      const rect = footer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(leftParallax, {
        x: x * -50, 
        y: y * -30, 
        duration: 1,
        ease: "power3.out",
      });

      gsap.to(rightParallax, {
        x: x * -50,
        y: y * -30,
        duration: 1,
        ease: "power3.out",
      });
    };

    const resetParallax = () => {
      gsap.to([leftParallax, rightParallax], {
        x: 0,
        y: 0,
        duration: 1,
        ease: "power3.out",
      });
    };

    footer.addEventListener('mousemove', handleParallax);
    footer.addEventListener('mouseleave', resetParallax);

    return () => {
      footer.removeEventListener('mousemove', handleParallax);
      footer.removeEventListener('mouseleave', resetParallax);
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative flex flex-col justify-between w-full h-screen px-6 pt-5 pb-8 overflow-hidden font-sans select-none text-foreground bg-background"
    >
      {/* Left Hand Outer Wrapper (Dynamic 44vw) */}
      <div
        ref={leftHandWrapRef}
        className="absolute left-[-1%] top-[20%] -translate-y-1/2 w-[44vw] max-w-[650px] min-w-[320px] pointer-events-none z-0 flex justify-start items-center will-change-transform"
        style={{ opacity: 0 }}
      >
        <div ref={leftParallaxRef} className="will-change-transform">
          <canvas ref={canvasLeftRef} className="block text-foreground" />
        </div>
      </div>

      {/* Right Hand Outer Wrapper (Dynamic 44vw) */}
      <div
        ref={rightHandWrapRef}
        className="absolute right-[-1%] top-[20%] -translate-y-1/2 w-[44vw] max-w-[650px] min-w-[320px] pointer-events-none z-0 flex justify-end items-center will-change-transform"
        style={{ opacity: 0 }}
      >
        <div ref={rightParallaxRef} className="will-change-transform">
          <canvas ref={canvasRightRef} className="block text-foreground" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col justify-between w-full h-full pb-4 pointer-events-none">
        <div className="grid items-start w-full grid-cols-1 gap-8 md:grid-cols-12">
          <div className="pointer-events-auto md:col-span-6">
            <a
              href="mailto:r.prahulparihar70@gmail.com"
              className="group block font-sans text-[7vw] sm:text-[5vw] md:text-[3.8vw] font-normal leading-[1.05] tracking-tight hover:opacity-80 transition-opacity"
            >
              <div className="overflow-hidden">
                <div className="inline-block footer-reveal-text">r.prahulparihar70</div>
              </div>
              <div className="pl-[20%] overflow-hidden">
                <div className="inline-block footer-reveal-text">@gmail.com</div>
              </div>
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-7 flex flex-col gap-1 text-3xl sm:text-4xl md:text-[2.75rem] font-normal tracking-tight text-foreground pointer-events-auto">
            {[
              { label: 'Me', href: '/me' },
              { label: 'Projects', href: '/projects' },
              { label: 'Playground', href: '/playground' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <div key={link.label} className="overflow-hidden">
                <div className="footer-reveal-text">
                  <Link href={link.href} className="relative block group w-fit">
                    <RollingText label={link.label} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="md:col-span-3 flex flex-col gap-0.5 text-sm md:text-base pointer-events-auto">
            {[
              { label: 'Github', href: 'https://github.com', target: '_blank' },
              { label: 'Dribbble', href: 'https://dribbble.com', target: '_blank' },
              { label: 'LinkedIn', href: 'https://linkedin.com', target: '_blank' },
              { label: 'X', href: 'https://x.com', target: '_blank' },
            ].map((link) => (
              <div key={link.label} className="overflow-hidden">
                <div className="footer-reveal-text">
                  <Link
                    href={link.href}
                    target={link.target}
                    rel="noopener noreferrer"
                    className="relative block group w-fit"
                  >
                    <RollingText label={link.label} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid items-end w-full grid-cols-1 gap-8 pointer-events-auto md:grid-cols-12">
          <div className="overflow-hidden md:col-span-6">
            <p className="footer-reveal-text font-sans text-[10px] sm:text-[11px] text-zinc-600 tracking-wider">
              ©2026 Rahul. All Rights Reserved
            </p>
          </div>

          <div className="overflow-hidden md:col-span-3 md:col-start-10">
            <p className="footer-reveal-text text-[20px] font-sans leading-relaxed text-foreground text-justify">
              Designer by curiosity, developer by obsession. I like exploring ideas, building
              things, and learning something new along the way.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}