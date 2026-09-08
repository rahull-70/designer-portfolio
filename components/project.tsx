'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ============================================================================
// ⚙️ ULTRASMOOTH ANIMATION CONFIG
// ============================================================================
const CONFIG = {
  MAX_CENTER_SCALE: 0.3,
  CENTER_Z_OVERLAY: 1.5,
  SCALE_PROXIMITY_FOCUS: 0.45,

  SCALE_SMOOTHNESS: 0.045,
  MOVEMENT_SMOOTHNESS: 0.045,

  DRAG_SENSITIVITY: 0.00025,
  DRAG_FRICTION: 0.92,
  HOVER_LIFT_AMOUNT: 0.6, // Vertical popout distance when hovered
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
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const trackGroup = new THREE.Group();
    scene.add(trackGroup);

    // Drop shadow texture
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx2d = shadowCanvas.getContext('2d');
    if (ctx2d) {
      const gradient = ctx2d.createRadialGradient(128, 128, 20, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.15)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.05)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx2d.fillStyle = gradient;
      ctx2d.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    const shadowMeshes: THREE.Mesh[] = [];

    const cardSpacing = 3.6; // Preserved original spacing
    const totalCards = imageUrls.length;
    const totalTrailLength = totalCards * cardSpacing;

    let loadedCount = 0;

    const createFallbackTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 320;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 512, 320);
        grad.addColorStop(0, '#111111');
        grad.addColorStop(1, '#333333');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 320);
      }
      return new THREE.CanvasTexture(canvas);
    };

    imageUrls.forEach((url, index) => {
      textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;

          const img = texture.image;
          const aspect = img && img.width && img.height ? img.width / img.height : 16 / 9;
          createCard(texture, index, aspect);
        },
        undefined,
        () => {
          const fallback = createFallbackTexture();
          createCard(fallback, index, 16 / 9);
        }
      );
    });

    function createCard(texture: THREE.Texture, index: number, aspect: number) {
      const baseWidth = 5.2;
      const baseHeight = baseWidth / aspect;

      const cardGeometry = new THREE.PlaneGeometry(baseWidth, baseHeight);
      const shadowGeometry = new THREE.PlaneGeometry(baseWidth + 0.8, baseHeight + 0.8);

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });

      const shadowMaterial = new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false,
        opacity: 0.35,
      });

      const mesh = new THREE.Mesh(cardGeometry, material);
      mesh.userData = { 
        index,
        hoverLift: 0,
        targetHoverLift: 0
      };
      trackGroup.add(mesh);
      meshes.push(mesh);

      const shadowMesh = new THREE.Mesh(shadowGeometry, shadowMaterial);
      shadowMesh.userData = { index };
      trackGroup.add(shadowMesh);
      shadowMeshes.push(shadowMesh);

      loadedCount++;
      if (loadedCount === imageUrls.length) {
        updatePositions(0, 0);
      }
    }

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

    const updatePositions = (progress: number, reveal: number) => {
      const totalOffset = (progress + dragOffset) * totalTrailLength * 0.8;

      meshes.forEach((mesh) => {
        const index = mesh.userData.index;

        const rawX = index * cardSpacing - totalOffset;

        let wrappedX =
          ((((rawX + totalTrailLength / 2) % totalTrailLength) +
            totalTrailLength) %
            totalTrailLength) -
          totalTrailLength / 2;

        const offsiteX = 28 + index * 0.35;
        const x = THREE.MathUtils.lerp(offsiteX, wrappedX, reveal);

        // Preserved original curve dynamics
        const diagonalSlope = 0.48;
        const linearY = x * diagonalSlope + 0.5;

        const gaussianEnvelope = Math.exp(-Math.pow(x * 0.12, 2));
        const centerWave = Math.sin(x * -0.25) * 2.2 * gaussianEnvelope * reveal;

        // Smoothly interpolate hover lift value for popout effect
        mesh.userData.hoverLift = THREE.MathUtils.lerp(
          mesh.userData.hoverLift,
          mesh.userData.targetHoverLift,
          0.1
        );

        const finalY = linearY + centerWave + mesh.userData.hoverLift;

        const proximity = Math.exp(-Math.pow(x * CONFIG.SCALE_PROXIMITY_FOCUS, 2));

        const targetScale = 1 + CONFIG.MAX_CENTER_SCALE * proximity * reveal;
        const currentScale = mesh.scale.x;
        const smoothScale = THREE.MathUtils.lerp(
          currentScale,
          targetScale,
          CONFIG.SCALE_SMOOTHNESS
        );

        const baseZ = (index % 4) * 0.08;
        const centerZOffset = CONFIG.CENTER_Z_OVERLAY * proximity * reveal;
        const hoverZOffset = mesh.userData.hoverLift > 0.05 ? 0.3 : 0;
        const targetZ = baseZ + centerZOffset + hoverZOffset;

        const currentZ = mesh.position.z;
        const smoothZ = THREE.MathUtils.lerp(currentZ, targetZ, CONFIG.SCALE_SMOOTHNESS);

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
      if (revealObj.progress < 0.9 || isDragging) return;

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
            m.userData.targetHoverLift = m.userData.index === hoveredIndex ? CONFIG.HOVER_LIFT_AMOUNT : 0;
          });
        }
      } else {
        if (hoveredIndex !== null) {
          hoveredIndex = null;
          meshes.forEach((m) => {
            m.userData.targetHoverLift = 0;
          });
        }
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

    const render = () => {
      currentProgress = THREE.MathUtils.lerp(
        currentProgress,
        targetProgress,
        CONFIG.MOVEMENT_SMOOTHNESS
      );

      if (!isDragging && Math.abs(dragVelocity) > 0.00001) {
        targetDragOffset += dragVelocity;
        dragVelocity *= CONFIG.DRAG_FRICTION;
      }

      dragOffset = THREE.MathUtils.lerp(
        dragOffset,
        targetDragOffset,
        CONFIG.MOVEMENT_SMOOTHNESS
      );

      updatePositions(currentProgress, revealObj.progress);
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // GSAP ScrollTrigger
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
              duration: 3,
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
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
      if (renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      shadowTexture.dispose();
    };
  }, [router]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden select-none">
      {/* Background Headline with Blur Word Reveal Animation */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none px-4">
        <h2 className="text-4xl sm:text-6xl md:text-9xl font-sans tracking-tight text-foreground text-center">
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