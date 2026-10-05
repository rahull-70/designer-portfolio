'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextProps {
  text: string;
  playfairWords?: string[];
  className?: string;
}

const SplitText = ({
  text,
  playfairWords = [],
  className = '',
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isPlayfair = playfairWords.some(
          (w) => w.toLowerCase() === cleanWord,
        );

        return (
          <span
            key={index}
            className={`reveal-word inline-block mr-[0.22em] opacity-0 will-change-[opacity,transform] ${
              isPlayfair ? 'font-playfair italic font-normal' : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

const COLS = 110;
const CUSTOM_RAMP = ' .:`-^~*+?s%#@$';
const HOVER_RADIUS_CELLS = 5.0;

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
  fontSize: number = 11;
  cellWidth: number = 6;
  cellHeight: number = 11;

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
        this.cols * ((img.height / img.width) * charAspect),
      );

      const offCanvas = document.createElement('canvas');
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCanvas.width = this.cols;
      offCanvas.height = this.rows;

      offCtx.drawImage(img, 0, 0, this.cols, this.rows);
      const pixels = offCtx.getImageData(0, 0, this.cols, this.rows).data;

      const bgR = pixels[0];
      const bgG = pixels[1];
      const bgB = pixels[2];

      const brightnessValues: number[] = [];
      let minB = 255;
      let maxB = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const alpha = pixels[i + 3];

        const colorDiff = Math.hypot(r - bgR, g - bgG, b - bgB);

        if (alpha < 20 || colorDiff < 28 || (r > 240 && g > 240 && b > 240)) {
          brightnessValues.push(-1);
        } else {
          const br = 0.299 * r + 0.587 * g + 0.114 * b;
          brightnessValues.push(br);
          if (br < minB) minB = br;
          if (br > maxB) maxB = br;
        }
      }

      const range = maxB - minB || 1;
      this.charGrid = [];

      for (let r = 0; r < this.rows; r++) {
        const row: string[] = [];
        for (let c = 0; c < this.cols; c++) {
          const idx = r * this.cols + c;
          const br = brightnessValues[idx];

          if (br === -1) {
            row.push(' ');
          } else {
            const normalized = (br - minB) / range;
            const darkness = 1.0 - normalized;

            const rampIndex = Math.floor(darkness * (CUSTOM_RAMP.length - 1));
            const clampedIndex = Math.max(
              0,
              Math.min(CUSTOM_RAMP.length - 1, rampIndex),
            );

            row.push(CUSTOM_RAMP[clampedIndex]);
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

    this.cellWidth = Math.max(
      4,
      Math.floor((window.innerWidth * 0.45) / this.cols),
    );
    this.cellHeight = Math.floor(this.cellWidth / 0.55);
    this.fontSize = this.cellHeight;

    const displayWidth = this.cols * this.cellWidth;
    const displayHeight = this.rows * this.cellHeight;

    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.ctx.font = `500 ${this.fontSize}px 'Courier New', monospace`;
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
    const rMax = Math.min(
      this.rows - 1,
      Math.ceil(targetRow + HOVER_RADIUS_CELLS),
    );
    const cMin = Math.max(0, Math.floor(targetCol - HOVER_RADIUS_CELLS));
    const cMax = Math.min(
      this.cols - 1,
      Math.ceil(targetCol + HOVER_RADIUS_CELLS),
    );

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
                  char: CUSTOM_RAMP[
                    Math.floor(Math.random() * CUSTOM_RAMP.length)
                  ],
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
              this.cellHeight,
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

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textBlock1Ref = useRef<HTMLDivElement>(null);
  const textBlock2Ref = useRef<HTMLDivElement>(null);
  const canvasWrap1Ref = useRef<HTMLDivElement>(null);
  const canvasWrap2Ref = useRef<HTMLDivElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;

    if (!canvas1 || !canvas2) return;

    const asciiInstance1 = new AsciiCanvasHand(canvas1, '/img-1.png');
    const asciiInstance2 = new AsciiCanvasHand(canvas2, '/img-2.png');

    asciiInstance1.load();
    asciiInstance2.load();

    let animationFrameId: number;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.targetY =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      asciiInstance1.triggerProximity(e.clientX, e.clientY);
      asciiInstance2.triggerProximity(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      asciiInstance1.resizeCanvas();
      asciiInstance2.resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    const renderLoop = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (canvas1) {
        canvas1.style.transform = `translate3d(${mouse.x * 12}px, ${
          mouse.y * 8
        }px, 0)`;
      }
      if (canvas2) {
        canvas2.style.transform = `translate3d(${-mouse.x * 12}px, ${
          mouse.y * 8
        }px, 0)`;
      }

      asciiInstance1.render();
      asciiInstance2.render();

      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const ctx = gsap.context(() => {
      [textBlock1Ref.current, textBlock2Ref.current].forEach((block) => {
        if (!block) return;
        const words = block.querySelectorAll('.reveal-word');
        if (words.length > 0) {
          gsap.fromTo(
            words,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.4,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: block,
                start: 'top 85%',
                end: 'top 30%',
                scrub: 1,
              },
            },
          );
        }
      });

      [canvasWrap1Ref.current, canvasWrap2Ref.current].forEach((wrap) => {
        if (!wrap) return;
        gsap.fromTo(
          wrap,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: wrap,
              start: 'top 85%',
              end: 'top 40%',
              scrub: 1,
            },
          },
        );
      });
    }, containerRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className='relative w-full select-none bg-background text-foreground'
    >
      {/* SECTION 1: Top CTA */}
      <section className='relative flex flex-col items-center w-full min-h-screen py-20 overflow-hidden md:grid md:grid-cols-12'>
        <div
          ref={textBlock1Ref}
          className='w-full max-w-xs px-8 mb-12 md:px-0 md:col-span-5 md:col-start-3 md:max-w-md md:mb-0'
        >
          <p className='font-sans text-[16px] leading-relaxed text-justify'>
            <SplitText
              text='Looking for an internship or full-time opportunity. Excited to join a creative team, solve meaningful problems, and design experiences people love using.'
              playfairWords={['internship', 'or', 'full-time', 'opportunity.']}
            />
          </p>
        </div>

        {/* Right ASCII Canvas Container */}
        <div className='flex justify-end w-full pointer-events-auto md:col-span-5 md:col-start-8'>
          <div
            ref={canvasWrap1Ref}
            className='relative flex items-center justify-end overflow-hidden'
          >
            <canvas ref={canvas1Ref} className='block will-change-transform' />
          </div>
        </div>
      </section>

      {/* SECTION 2: Bottom CTA */}
      <section className='flex flex-col-reverse items-center w-full min-h-screen gap-12 px-8 py-20 md:grid md:grid-cols-12 md:px-16'>
        {/* Left ASCII Canvas Container */}
        <div className='flex justify-start w-full pointer-events-auto md:col-span-5 md:col-start-2'>
          <div
            ref={canvasWrap2Ref}
            className='relative flex items-center justify-start overflow-hidden'
          >
            <canvas ref={canvas2Ref} className='block will-change-transform' />
          </div>
        </div>

        {/* Right Text Block */}
        <div
          ref={textBlock2Ref}
          className='w-full max-w-xs md:col-span-4 md:col-start-8 md:max-w-sm'
        >
          <p className='font-sans text-[16px] leading-relaxed text-justify'>
            <SplitText
              text="Currently available for internships, freelance, and collaborative projects. Let's create products that are simple thoughtful and impactful work."
              playfairWords={[
                'internships,',
                'freelance,',
                'and',
                'collaborative',
                'projects.',
              ]}
            />
          </p>
        </div>
      </section>
    </div>
  );
}