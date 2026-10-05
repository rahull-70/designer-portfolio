'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ============================================================================
// ⚙️ ULTRASMOOTH ANIMATION CONFIG
// ============================================================================
const CONFIG = {
  MAX_CENTER_SCALE: 0.3,
  CENTER_Z_OVERLAY: 1.5,
  SCALE_PROXIMITY_FOCUS: 0.45,

  SCALE_SMOOTHNESS: 0.08,
  MOVEMENT_SMOOTHNESS: 0.08,

  DRAG_SENSITIVITY: 0.00025,
  DRAG_FRICTION: 0.92,
  HOVER_LIFT_AMOUNT: 0.6,
};

const baseImages = [
  '/project/project-img-1.png',
  '/project/project-img-2.png',
  '/project/project-img-3.png',
  '/project/project-img-4.png',
];

const REPEAT_COUNT = 6;
const imageUrls = Array(REPEAT_COUNT).fill(baseImages).flat();

export default function Projects() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (!canvasContainerRef.current || !sectionRef.current) return;

    const container = canvasContainerRef.current;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    // Dynamic drop shadow texture generation (Canvas optimized)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx2d = shadowCanvas.getContext('2d');
    if (ctx2d) {
      const gradient = ctx2d.createRadialGradient(64, 64, 10, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.15)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx2d.fillStyle = gradient;
      ctx2d.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    const shadowMeshes: THREE.Mesh[] = [];

    const cardSpacing = 3.6;
    const totalCards = imageUrls.length;
    const totalTrailLength = totalCards * cardSpacing;

    // Shared geometries to minimize memory footprint & GPU draw calls
    const sharedCardGeometry = new THREE.PlaneGeometry(5.2, 5.2 / (16 / 9));
    const sharedShadowGeometry = new THREE.PlaneGeometry(6.0, 6.0 / (16 / 9));

    const shadowMaterial = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.35,
    });

    // Lazy load fallback canvas
    let cachedFallbackTexture: THREE.CanvasTexture | null = null;
    const getFallbackTexture = () => {
      if (cachedFallbackTexture) return cachedFallbackTexture;
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 256, 160);
        grad.addColorStop(0, '#111111');
        grad.addColorStop(1, '#222222');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 160);
      }
      cachedFallbackTexture = new THREE.CanvasTexture(canvas);
      return cachedFallbackTexture;
    };

    function createCard(texture: THREE.Texture, index: number) {
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(sharedCardGeometry, material);
      mesh.userData = {
        index,
        hoverLift: 0,
        targetHoverLift: 0,
      };
      trackGroup.add(mesh);
      meshes.push(mesh);

      const shadowMesh = new THREE.Mesh(sharedShadowGeometry, shadowMaterial);
      shadowMesh.userData = { index };
      trackGroup.add(shadowMesh);
      shadowMeshes.push(shadowMesh);
    }

    // Process texture loading asynchronously to avoid main thread frame drop
    imageUrls.forEach((url, index) => {
      requestAnimationFrame(() => {
        textureLoader.load(
          url,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            createCard(texture, index);
          },
          undefined,
          () => {
            createCard(getFallbackTexture(), index);
          }
        );
      });
    });

    let currentProgress = 0;
    let targetProgress = 0;

    const revealObj = { progress: 0 };
    let dragOffset = 0;
    let targetDragOffset = 0;
    let dragVelocity = 0;
    let isDragging = false;
    let pointerDownX = 0;
    let pointerDownY = 0;
    let lastX = 0;

    let hoveredIndex: number | null = null;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const updatePositions = (progress: number, reveal: number, delta: number) => {
      const totalOffset = (progress + dragOffset) * totalTrailLength * 0.8;
      const lerpFactor = 1 - Math.pow(0.001, delta);

      meshes.forEach((mesh) => {
        const index = mesh.userData.index;
        const rawX = index * cardSpacing - totalOffset;

        const wrappedX =
          ((((rawX + totalTrailLength / 2) % totalTrailLength) +
            totalTrailLength) %
            totalTrailLength) -
          totalTrailLength / 2;

        const offsiteX = 28 + index * 0.35;
        const x = THREE.MathUtils.lerp(offsiteX, wrappedX, reveal);

        const diagonalSlope = 0.48;
        const linearY = x * diagonalSlope + 0.5;

        const gaussianEnvelope = Math.exp(-Math.pow(x * 0.12, 2));
        const centerWave = Math.sin(x * -0.25) * 2.2 * gaussianEnvelope * reveal;

        mesh.userData.hoverLift = THREE.MathUtils.lerp(
          mesh.userData.hoverLift,
          mesh.userData.targetHoverLift,
          lerpFactor
        );

        const finalY = linearY + centerWave + mesh.userData.hoverLift;
        const proximity = Math.exp(-Math.pow(x * CONFIG.SCALE_PROXIMITY_FOCUS, 2));

        const targetScale = 1 + CONFIG.MAX_CENTER_SCALE * proximity * reveal;
        const smoothScale = THREE.MathUtils.lerp(
          mesh.scale.x,
          targetScale,
          lerpFactor
        );

        const baseZ = (index % 4) * 0.08;
        const centerZOffset = CONFIG.CENTER_Z_OVERLAY * proximity * reveal;
        const hoverZOffset = mesh.userData.hoverLift > 0.05 ? 0.3 : 0;
        const targetZ = baseZ + centerZOffset + hoverZOffset;

        const smoothZ = THREE.MathUtils.lerp(mesh.position.z, targetZ, lerpFactor);

        mesh.renderOrder = Math.round(proximity * 100) + (hoveredIndex === index ? 50 : 0);

        const rotationZ = index % 2 === 0 ? 0.015 : -0.015;
        const rotationX = 0.01;

        mesh.position.set(x, finalY, smoothZ);
        mesh.rotation.set(rotationX, 0, rotationZ);
        mesh.scale.set(smoothScale, smoothScale, 1);

        const shadowMesh = shadowMeshes.find((s) => s.userData.index === index);
        if (shadowMesh) {
          shadowMesh.renderOrder = mesh.renderOrder - 1;
          shadowMesh.position.set(x - 0.15, finalY - 0.18, smoothZ - 0.04);
          shadowMesh.rotation.set(rotationX, 0, rotationZ);
          shadowMesh.scale.set(smoothScale, smoothScale, 1);
        }
      });
    };

    const updateHoverState = (clientX: number, clientY: number) => {
      if (revealObj.progress < 0.9 || isDragging || meshes.length === 0) return;

      const rect = container.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const topMesh = intersects[0].object as THREE.Mesh;
        const newHoverIndex = topMesh.userData.index;

        if (hoveredIndex !== newHoverIndex) {
          hoveredIndex = newHoverIndex;
          meshes.forEach((m) => {
            m.userData.targetHoverLift =
              m.userData.index === hoveredIndex ? CONFIG.HOVER_LIFT_AMOUNT : 0;
          });
        }
      } else if (hoveredIndex !== null) {
        hoveredIndex = null;
        meshes.forEach((m) => {
          m.userData.targetHoverLift = 0;
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (revealObj.progress < 0.9) return;
      isDragging = true;
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
      lastX = e.clientX;
      dragVelocity = 0;
      setIsGrabbing(true);
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastX;
        lastX = e.clientX;

        const impulse = -deltaX * CONFIG.DRAG_SENSITIVITY;
        dragVelocity = THREE.MathUtils.lerp(dragVelocity, impulse, 0.3);
        targetDragOffset += impulse;
      } else {
        updateHoverState(e.clientX, e.clientY);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      setIsGrabbing(false);
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);

      const distMoved = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      if (distMoved < 6) {
        const rect = container.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
          router.push('/projects');
        }
      }
    };

    const onPointerLeave = () => {
      hoveredIndex = null;
      meshes.forEach((m) => {
        m.userData.targetHoverLift = 0;
      });
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const lerpFactor = 1 - Math.pow(0.001, delta);

      currentProgress = THREE.MathUtils.lerp(
        currentProgress,
        targetProgress,
        lerpFactor
      );

      if (!isDragging && Math.abs(dragVelocity) > 0.00001) {
        targetDragOffset += dragVelocity;
        dragVelocity *= CONFIG.DRAG_FRICTION;
      }

      dragOffset = THREE.MathUtils.lerp(dragOffset, targetDragOffset, lerpFactor);

      updatePositions(currentProgress, revealObj.progress, delta);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // GSAP ScrollTrigger Optimization
    const ctx = gsap.context(() => {
      const words = sectionRef.current?.querySelectorAll('.reveal-word');
      if (words && words.length > 0) {
        gsap.fromTo(
          words,
          {
            opacity: 0,
            filter: 'blur(12px)',
            y: 16,
          },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=150%',
              scrub: 1.2,
            },
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            stagger: 0.12,
            ease: 'power2.out',
          }
        );
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=350%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          onEnter: () => {
            gsap.to(revealObj, {
              progress: 1,
              duration: 2.5,
              ease: 'power4.out',
              onComplete: () => setHasRevealed(true),
            });
          },
          onLeaveBack: () => {
            gsap.to(revealObj, {
              progress: 0,
              duration: 0.4,
              ease: 'power3.in',
              onComplete: () => setHasRevealed(false),
            });
          },
          onUpdate: (self) => {
            if (self.progress > 0.05) {
              targetProgress = (self.progress - 0.05) / 0.95;
            } else {
              targetProgress = 0;
            }
          },
        },
      });
    }, sectionRef);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      ctx.revert();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sharedCardGeometry.dispose();
      sharedShadowGeometry.dispose();
      shadowMaterial.dispose();
      shadowTexture.dispose();
      renderer.dispose();
    };
  }, [router]);

  return (
    <section ref={sectionRef} className="relative w-full h-screen overflow-hidden select-none">
      {/* Background Headline with Blur Word Reveal Animation */}
      <div className="absolute inset-0 z-0 flex items-center justify-center px-4 pointer-events-none">
        <h2 className="font-sans text-4xl tracking-tight text-center sm:text-6xl md:text-9xl text-foreground">
          <span className="reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform]">
            Design
          </span>
          <span className="reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform]">
            that
          </span>
          <span className="reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform]">
            makes
          </span>
          <span className="reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform]">
            an
          </span>
          <span className="reveal-word inline-block mr-[0.25em] opacity-0 blur-[12px] will-change-[opacity,filter,transform]">
            Impact
          </span>
        </h2>
      </div>

      {/* Interactive Canvas Container */}
      <div
        ref={canvasContainerRef}
        className={`absolute inset-0 z-10 touch-none ${
          hasRevealed ? (isGrabbing ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      />
    </section>
  );
}