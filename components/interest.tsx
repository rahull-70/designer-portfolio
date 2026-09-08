'use client';

import React, { useState, useEffect, useRef } from 'react';

// ============================================================================
// 🎨 DATA CONFIGURATION
// ============================================================================

export interface CapabilityItem {
  id: string;
  title: string;
  image: string;
  category: string;
}

const SECTIONS = [
  {
    category: 'Capabilities',
    items: [
      {
        id: 'web-design',
        title: 'Web design',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&q=80',
      },
      {
        id: 'animation-interaction',
        title: 'Animation & interaction',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
      },
    ],
  },
  {
    category: 'Expertise',
    items: [
      {
        id: 'art-direction',
        title: 'Art Direction',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&q=80',
      },
    ],
  },
  {
    category: 'My Inspiration',
    items: [
      {
        id: 'music',
        title: 'Music',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&q=80',
      },
      {
        id: 'posters',
        title: 'Posters',
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1000&q=80',
      },
      {
        id: 'animations',
        title: 'Animations',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80',
      },
      {
        id: 'motion-design',
        title: 'Motion Design',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1000&q=80',
      },
      {
        id: 'typography',
        title: 'Typography',
        image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?w=1000&q=80',
      },
      {
        id: 'video-games',
        title: 'Video Games',
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1000&q=80',
      },
      {
        id: 'art',
        title: 'Art',
        image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&q=80',
      },
    ],
  },
];

const FLAT_ITEMS = SECTIONS.flatMap((sec) =>
  sec.items.map((item) => ({ ...item, category: sec.category }))
);

// ============================================================================
// 🚀 CAPABILITIES SECTION COMPONENT
// ============================================================================

export default function CapabilitiesSection() {
  const [activeId, setActiveId] = useState<string>(FLAT_ITEMS[0].id);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Highlight item closest to screen center during smooth scroll
  useEffect(() => {
    const handleScroll = () => {
      const centerTarget = window.innerHeight * 0.45;
      let closestId = activeId;
      let minDistance = Infinity;

      Object.entries(itemRefs.current).forEach(([id, el]) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - centerTarget);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = id;
        }
      });

      if (closestId && closestId !== activeId) {
        setActiveId(closestId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeId]);

  return (
    <section className="relative w-full min-h-screen bg-[#EFECE6] text-zinc-900 font-sans px-8 py-28 flex items-center justify-center select-none overflow-hidden">
      
      {/* 🖼️ Far Left Floating Image Preview (Clean Image, No Overlays) */}
      <div className="hidden lg:block absolute left-8 xl:left-14 top-1/2 -translate-y-1/2 z-20">
        <div className="relative w-52 h-72 xl:w-60 xl:h-80 rounded-2xl overflow-hidden shadow-2xl bg-zinc-200 border border-zinc-300/60">
          {FLAT_ITEMS.map((item) => {
            const isActive = activeId === item.id;

            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-all duration-500 ease-out ${
                  isActive
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105 pointer-events-none'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 🎯 Dead-Centered Columns */}
      <div className="w-full max-w-4xl mx-auto space-y-20 z-10">
        {SECTIONS.map((sec) => (
          <div key={sec.category} className="grid grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Category Label */}
            <div className="col-span-5 md:col-span-5 text-zinc-600 font-serif italic text-3xl md:text-4xl lg:text-5xl pt-1 text-right md:text-left">
              {sec.category}
            </div>

            {/* Items List */}
            <div className="col-span-7 md:col-span-7 space-y-4">
              {sec.items.map((item) => {
                const isActive = activeId === item.id;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[item.id] = el;
                    }}
                    onMouseEnter={() => setActiveId(item.id)}
                    className={`text-3xl md:text-4xl lg:text-5xl tracking-tight transition-all duration-300 cursor-pointer origin-left ${
                      isActive
                        ? 'text-zinc-900 font-medium translate-x-2'
                        : 'text-zinc-900/25 font-normal hover:text-zinc-900/60'
                    }`}
                  >
                    {item.title}
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}