'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import Nav from '@/components/nav';

const PROJECTS = [
  {
    id: 'slash-ui',
    title: 'Project 1',
    image: '/project/project-img-1.png',
  },
  {
    id: 'questsboard',
    title: 'Project 2',
    image: '/project/project-img-2.png',
  },
  {
    id: '11revens',
    title: 'Project 3',
    image: '/project/project-img-3.png',
  },
  {
    id: 'karma',
    title: 'Project 4',
    image: '/project/project-img-4.png',
  },
];

interface SplitTextProps {
  text: string;
  italicWords?: string[];
  className?: string;
}

const SplitText = ({
  text,
  italicWords = [],
  className = '',
}: SplitTextProps) => {
  const words = text.trim().split(/\s+/);

  return (
    <span className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        const isItalic = italicWords.some((w) => w.toLowerCase() === cleanWord);

        return (
          <span
            key={index}
            className={`reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform] ${
              isItalic ? 'font-serif italic font-normal' : ''
            }`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
};

// 3D Card Component that redirects to /projects/[id] on click
function OrbitCard({
  item,
  angle,
  radius,
  onSelect,
}: {
  item: (typeof PROJECTS)[0];
  angle: number;
  radius: number;
  onSelect: (item: (typeof PROJECTS)[0]) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const hoverLiftRef = useRef(0);

  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 6;

  const cardWidth = isMobile ? 2.4 : 3.2;
  const cardHeight = isMobile ? 1.35 : 1.8;

  const texture = useTexture(item.image);
  texture.colorSpace = THREE.SRGBColorSpace;

  const baseX = Math.sin(angle) * radius;
  const baseZ = Math.cos(angle) * radius;

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    const targetLift = hovered ? (isMobile ? 0.35 : 0.6) : 0;
    hoverLiftRef.current = THREE.MathUtils.lerp(
      hoverLiftRef.current,
      targetLift,
      delta * 10,
    );
    meshRef.current.position.y = hoverLiftRef.current;
  });

  return (
    <group
      ref={groupRef}
      position={[baseX, 0, baseZ]}
      rotation={[0, angle + Math.PI / 2, 0]}
    >
      <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.1}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={() => {
            setHovered(false);
          }}
          onPointerDown={(e) => {
            pointerDownPos.current = { x: e.clientX, y: e.clientY };
          }}
          onPointerUp={(e) => {
            e.stopPropagation();
            const dist = Math.hypot(
              e.clientX - pointerDownPos.current.x,
              e.clientY - pointerDownPos.current.y,
            );
            if (dist < 5) onSelect(item);
          }}
        >
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent={true}
          />
        </mesh>
      </Float>
    </group>
  );
}

function ProjectOrbit({
  onSelect,
}: {
  onSelect: (item: (typeof PROJECTS)[0]) => void;
}) {
  const orbitRef = useRef<THREE.Group>(null);
  const { width } = useThree((state) => state.viewport);
  const isMobile = width < 6;
  const radius = isMobile ? 2.1 : 2.8;

  useFrame((_, delta) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y += delta * 0.22;
  });

  return (
    <group
      ref={orbitRef}
      position={[0, isMobile ? -0.2 : 0, 0]}
      rotation={[0.25, 0, -0.15]}
    >
      {PROJECTS.map((project, index) => {
        const angle = (index / PROJECTS.length) * Math.PI * 2;
        return (
          <OrbitCard
            key={project.id}
            item={project}
            angle={angle}
            radius={radius}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}

export default function OrbitGalleryPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const words = containerRef.current?.querySelectorAll('.reveal-word');
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
        },
      );
    }
  }, []);

  const handleSelectProject = (project: (typeof PROJECTS)[0]) => {
    // Navigates directly to /projects/1, /projects/2, etc.
    router.push(`/projects/${project.id}`);
  };

  return (
    <>
      <style jsx global>{`
        html,
        body {
          overflow: hidden !important;
          height: 100vh !important;
          width: 100vw !important;
          margin: 0;
          padding: 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <Nav />
      <main
        ref={containerRef}
        className='relative flex flex-col justify-between w-screen h-screen overflow-hidden font-sans select-none'
      >
        {/* Top Left Text Overlay */}
        <div className='relative z-20 max-w-full px-6 pt-4 pointer-events-none md:absolute top-20 md:top-20 md:pt-0'>
          <h1 className='text-[16px] leading-snug tracking-tight text-left md:text-justify'>
            <SplitText text='Designing products that solve problems, not just screens.' />
          </h1>
        </div>

        {/* 3D Canvas */}
        <div className='w-full h-[55vh] sm:h-[60vh] md:h-full cursor-default my-auto'>
          <Canvas
            camera={{ position: [0, 0, 10], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={2} />

            <Suspense fallback={null}>
              <ProjectOrbit onSelect={handleSelectProject} />
            </Suspense>

            <OrbitControls
              enableRotate={true}
              enablePan={false}
              enableZoom={true}
              enableDamping={true}
              dampingFactor={0.05}
              rotateSpeed={0.8}
              zoomSpeed={0.8}
              minDistance={5}
              maxDistance={14}
              maxPolarAngle={Math.PI / 2 + 0.1}
              minPolarAngle={Math.PI / 3}
            />
          </Canvas>
        </div>

        {/* Bottom Right Text Overlay */}
        <div className='relative right-0 z-20 max-w-full px-6 pb-6 text-left pointer-events-none md:absolute bottom-6 md:bottom-10 md:right-5 md:pb-0 md:max-w-xs md:text-right'>
          <p className='text-[16px]] leading-relaxed tracking-normal text-left md:text-justify max-w-full md:max-w-[270px]'>
            <SplitText text='A curated collection of projects exploring research, strategy, interaction, and visual design—crafted with people at the center of every decision.' />
          </p>
        </div>
      </main>
    </>
  );
}
