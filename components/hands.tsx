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
          (w) => w.toLowerCase() === cleanWord
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
    const rMax = Math.min(
      this.rows - 1,
      Math.ceil(targetRow + HOVER_RADIUS_CELLS)
    );
    const cMin = Math.max(0, Math.floor(targetCol - HOVER_RADIUS_CELLS));
    const cMax = Math.min(
      this.cols - 1,
      Math.ceil(targetCol + HOVER_RADIUS_CELLS)
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

const HandsSection = () => {
  const handsSectionRef = useRef<HTMLElement>(null);
  const leftHandWrapRef = useRef<HTMLDivElement>(null);
  const rightHandWrapRef = useRef<HTMLDivElement>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement>(null);
  const canvasRightRef = useRef<HTMLCanvasElement>(null);
  const middleTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handsSection = handsSectionRef.current;
    const leftWrap = leftHandWrapRef.current;
    const rightWrap = rightHandWrapRef.current;
    const canvasLeft = canvasLeftRef.current;
    const canvasRight = canvasRightRef.current;
    const middleText = middleTextRef.current;

    if (!canvasLeft || !canvasRight) return;

    const leftHandInstance = new AsciiCanvasHand(canvasLeft, '/left-hand.png');
    const rightHandInstance = new AsciiCanvasHand(
      canvasRight,
      '/right-hand.png'
    );

    leftHandInstance.load();
    rightHandInstance.load();

    let animationFrameId: number;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.targetY =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      leftHandInstance.triggerProximity(e.clientX, e.clientY);
      rightHandInstance.triggerProximity(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      leftHandInstance.resizeCanvas();
      rightHandInstance.resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    const renderLoop = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (canvasLeft) {
        canvasLeft.style.transform = `translate3d(${mouse.x * 20}px, ${
          mouse.y * 12
        }px, 0)`;
      }
      if (canvasRight) {
        canvasRight.style.transform = `translate3d(${-mouse.x * 20}px, ${
          mouse.y * 12
        }px, 0)`;
      }

      leftHandInstance.render();
      rightHandInstance.render();

      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const ctx = gsap.context(() => {
      if (handsSection && leftWrap && rightWrap && middleText) {
        const words = middleText.querySelectorAll('.reveal-word');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: handsSection,
            start: 'top top',
            end: '+=250%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          leftWrap,
          {
            xPercent: -100,
            yPercent: 45,
            rotate: -12,
            scale: 0.85,
            autoAlpha: 0,
          },
          {
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            autoAlpha: 1,
            ease: 'power2.out',
          },
          0
        ).fromTo(
          rightWrap,
          {
            xPercent: 100,
            yPercent: -45,
            rotate: 12,
            scale: 0.85,
            autoAlpha: 0,
          },
          {
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            autoAlpha: 1,
            ease: 'power2.out',
          },
          0
        );

        if (words.length > 0) {
          tl.fromTo(
            words,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.4,
              ease: 'power1.out',
            },
            '>-0.25'
          );
        }

        tl.to({}, { duration: 0.6 });

        if (words.length > 0) {
          tl.to(words, {
            opacity: 0,
            y: -10,
            stagger: 0.02,
            duration: 0.3,
            ease: 'power1.in',
          });
        }

        tl.to(
          leftWrap,
          {
            xPercent: -110,
            yPercent: 45,
            rotate: -15,
            scale: 0.85,
            autoAlpha: 0,
            ease: 'power2.in',
          },
          '<'
        ).to(
          rightWrap,
          {
            xPercent: 110,
            yPercent: -45,
            rotate: 15,
            scale: 0.85,
            autoAlpha: 0,
            ease: 'power2.in',
          },
          '<'
        );
      }
    }, handsSectionRef);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={handsSectionRef}
      className="relative flex items-center justify-center w-full h-screen overflow-hidden text-black select-none bg-background dark:text-white"
    >
      {/* Left ASCII Hand Container */}
      <div
        ref={leftHandWrapRef}
        className="absolute left-0 bottom-0 w-[44vw] max-w-[650px] min-w-[320px] pointer-events-auto z-10 origin-bottom-left will-change-transform flex justify-start items-center"
      >
        <canvas ref={canvasLeftRef} className="block" />
      </div>

      {/* Center Framed Quote */}
      <div
        ref={middleTextRef}
        className="relative z-20 max-w-xs px-4 text-center pointer-events-none sm:max-w-md"
      >
        <p className="text-lg italic leading-relaxed tracking-tight font-playfair sm:text-2xl md:text-3xl text-foreground/90">
          <SplitText text="In simple words, i love making websites." />
        </p>
      </div>

      {/* Right ASCII Hand Container */}
      <div
        ref={rightHandWrapRef}
        className="absolute right-0 top-0 w-[44vw] max-w-[650px] min-w-[320px] pointer-events-auto z-10 origin-top-right will-change-transform flex justify-end items-center"
      >
        <canvas ref={canvasRightRef} className="block" />
      </div>
    </section>
  );
};

export default HandsSection;