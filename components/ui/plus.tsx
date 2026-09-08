"use client";

import { motion } from "motion/react";
import type { HTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface PlusIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface PlusIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  isOpen?: boolean;
}

const PlusIcon = forwardRef<PlusIconHandle, PlusIconProps>(
  ({ className, size = 28, isOpen = false, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    // Calculates total rotation:
    // Base rotation: 0° when closed (+), 135° when open (x)
    // Hover rotation: adds +180° rotation on hover
    const baseRotation = isOpen ? 135 : 0;
    const hoverRotation = isHovered ? 180 : 0;
    const totalRotation = baseRotation + hoverRotation;

    return (
      <div
        className={cn("cursor-pointer select-none inline-flex items-center justify-center", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        <motion.svg
          animate={{ rotate: totalRotation }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          fill="none"
          height={size}
          width={size}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </motion.svg>
      </div>
    );
  }
);

PlusIcon.displayName = "PlusIcon";

export { PlusIcon };