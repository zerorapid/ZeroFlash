import React from 'react';
import { cn } from '../../lib/utils';

interface AceternityCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export const AceternityCanvas: React.FC<AceternityCanvasProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative flex-1 overflow-hidden bg-[#fafafa] flex flex-col",
        className
      )}
    >
      {/* 1. Aceternity Geometric Dot Matrix */}
      <div
        className="absolute inset-0 pointer-events-none opacity-60 [background-image:radial-gradient(#d4d4d8_1.2px,transparent_1.2px)] [background-size:24px_24px]"
        style={{
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 60%, transparent 100%)',
        }}
      />

      {/* 2. Atmospheric Luxury Spotlights (Aceternity Studio Lighting) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-100/40 via-indigo-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[450px] h-[450px] bg-gradient-to-bl from-rose-100/30 via-amber-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-100/25 via-sky-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 3. Foreground Interactive Content */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
