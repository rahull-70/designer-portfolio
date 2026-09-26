'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TransitionLink } from './page-transition';

const navItems = [
  { name: 'ME', href: '/me' },
  { name: 'PROJECTS', href: '/projects' },
  { name: 'PLAYGROUND', href: '/playground' },
  { name: 'CONTACT', href: '/contact' },
];

const SCRAMBLE_CHARS = '/\\<>[]{}*#+$%';
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
    this.cellWidth = Math.max(
      3,
      Math.floor((window.innerWidth * 0.48) / this.cols)
    );
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

const AnimatedLogo = () => {
  const slashRef = useRef<HTMLSpanElement>(null);
  const isAnimating = useRef(false);

  const handleHover = () => {
    if (isAnimating.current || !slashRef.current) return;
    isAnimating.current = true;

    const el = slashRef.current;
    let frame = 0;
    const maxFrames = 12;

    const interval = setInterval(() => {
      frame++;
      if (frame < maxFrames) {
        el.textContent =
          SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      } else {
        clearInterval(interval);
        el.textContent = '/';
      }
    }, 30);

    gsap.fromTo(
      el,
      { rotateY: 0, rotateZ: 0, scale: 1 },
      {
        rotateY: 360,
        rotateZ: 12,
        scale: 1.3,
        duration: 0.8,
        ease: 'elastic.out(1.2, 0.4)',
        onComplete: () => {
          gsap.to(el, {
            rotateZ: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              isAnimating.current = false;
            },
          });
        },
      }
    );
  };

  return (
    <TransitionLink
      href="/"
      className="group relative inline-flex items-center justify-center [perspective:1000px]"
      onMouseEnter={handleHover}
    >
      <span
        ref={slashRef}
        className="inline-block font-bold text-[16px] leading-none tracking-tighter text-foreground will-change-transform select-none"
      >
        /
      </span>
    </TransitionLink>
  );
};

const HoverNavLink = ({
  name,
  href,
  onClick,
  className = '',
}: {
  name: string;
  href: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <TransitionLink
      href={href}
      onClick={onClick}
      className={`group relative inline-flex overflow-hidden py-1 leading-none ${className}`}
    >
      {name.split('').map((char, index) => (
        <span
          key={index}
          className="relative inline-block h-[1em] overflow-hidden leading-none"
        >
          <span
            className="flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-1/2"
            style={{ transitionDelay: `${index * 25}ms` }}
          >
            <span className="inline-block h-[1em] leading-none">{char}</span>
            <span className="inline-block h-[1em] leading-none">{char}</span>
          </span>
        </span>
      ))}
    </TransitionLink>
  );
};

const MenuSVGIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="relative w-6 h-[16px] flex items-center justify-center cursor-pointer group">
      <svg
        viewBox="0 0 24 16"
        className="w-6 h-[16px] fill-none stroke-current text-foreground overflow-visible"
      >
        <path
          d="M2 4h20"
          strokeWidth="2"
          strokeLinecap="round"
          className={`transition-all duration-300 ease-out origin-center ${
            isOpen ? 'rotate-45 translate-y-[1px]' : 'group-hover:translate-x-1'
          }`}
        />
        <path
          d="M8 10h14"
          strokeWidth="2"
          strokeLinecap="round"
          className={`transition-all duration-300 ease-out origin-center ${
            isOpen
              ? '-rotate-45 -translate-y-[2px] -translate-x-[3px] scale-x-[1.43]'
              : 'group-hover:-translate-x-1'
          }`}
        />
      </svg>
    </div>
  );
};

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // ASCII Canvas References inside curtain menu
  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const leftHandWrapRef = useRef<HTMLDivElement>(null);
  const rightHandWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBtn(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize ASCII Hands when curtain drawer opens
  useEffect(() => {
    if (!isOpen || !leftCanvasRef.current || !rightCanvasRef.current) return;

    const leftHand = new AsciiCanvasHand(
      leftCanvasRef.current,
      '/left-hand.png'
    );
    const rightHand = new AsciiCanvasHand(
      rightCanvasRef.current,
      '/right-hand.png'
    );

    leftHand.load();
    rightHand.load();

    let animId: number;
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.targetY =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

      leftHand.triggerProximity(e.clientX, e.clientY);
      rightHand.triggerProximity(e.clientX, e.clientY);
    };

    const handleResize = () => {
      leftHand.resizeCanvas();
      rightHand.resizeCanvas();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    const loop = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (leftHandWrapRef.current) {
        gsap.set(leftHandWrapRef.current, {
          x: mouse.x * 20,
          y: mouse.y * 12,
        });
      }
      if (rightHandWrapRef.current) {
        gsap.set(rightHandWrapRef.current, {
          x: -mouse.x * 20,
          y: mouse.y * 12,
        });
      }

      leftHand.render();
      rightHand.render();
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  // GSAP Curtain Toggle & Hand Slide-In Animations
  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      tl.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 0.65,
        ease: 'power4.inOut',
      })
        .fromTo(
          linksRef.current ? linksRef.current.children : [],
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        /* Slide Left Hand in from Offscreen Left (-100%) */
        .fromTo(
          leftHandWrapRef.current,
          { xPercent: -100 },
          {
            xPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.5'
        )
        /* Slide Right Hand in from Offscreen Right (100%) */
        .fromTo(
          rightHandWrapRef.current,
          { xPercent: 100 },
          {
            xPercent: 0,
            duration: 0.8,
            ease: 'power4.out',
          },
          '-=0.8'
        );
    } else {
      document.body.style.overflow = '';

      gsap.to(menuRef.current, {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        duration: 0.5,
        ease: 'power4.inOut',
      });
    }
  }, [isOpen]);

  return (
    <>
      <header className="relative z-[100] flex items-center justify-between px-5 py-2">
        <div className="flex items-center gap-1 font-bold text-[11px] tracking-tighter uppercase">
          <AnimatedLogo />
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold tracking-widest uppercase font-mono">
          {navItems.map((item) => (
            <HoverNavLink key={item.name} name={item.name} href={item.href} />
          ))}
        </nav>

        <button
          onClick={() => setIsOpen(true)}
          className={`md:hidden p-2 focus:outline-none transition-opacity duration-300 ${
            isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Open Menu"
        >
          <MenuSVGIcon isOpen={false} />
        </button>
      </header>

      <div
        className={`fixed top-4 right-5 z-[110] transition-all duration-300 ${
          showFloatingBtn && !isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 focus:outline-none"
          aria-label="Open Menu"
        >
          <MenuSVGIcon isOpen={false} />
        </button>
      </div>

      {/* Fullscreen Curtain Menu with Integrated ASCII Hands */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[120] bg-background flex flex-col justify-between px-5 py-2 select-none overflow-hidden"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
        }}
      >
        <div className="relative z-30 flex items-center justify-between w-full py-2">
          <AnimatedLogo />
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 focus:outline-none"
            aria-label="Close Menu"
          >
            <MenuSVGIcon isOpen={true} />
          </button>
        </div>

        {/* ASCII Left Hand Wrapper (Slides in from -100% X) */}
        <div
          ref={leftHandWrapRef}
          className="absolute bottom-0 left-0 z-10 hidden pointer-events-none sm:block will-change-transform"
        >
          <canvas ref={leftCanvasRef} className="block" />
        </div>

        {/* Navigation Links */}
        <div
          ref={linksRef}
          className="relative z-20 flex flex-col items-center gap-4 pl-4 my-auto font-mono text-4xl font-semibold tracking-tight uppercase sm:text-6xl sm:pl-12"
        >
          {navItems.map((item) => (
            <HoverNavLink
              key={item.name}
              name={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
            />
          ))}
        </div>

        {/* ASCII Right Hand Wrapper (Slides in from +100% X) */}
        <div
          ref={rightHandWrapRef}
          className="absolute right-0 z-10 hidden pointer-events-none top-12 sm:block will-change-transform"
        >
          <canvas ref={rightCanvasRef} className="block" />
        </div>
      </div>
    </>
  );
};

export default Nav;