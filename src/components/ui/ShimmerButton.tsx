import React from 'react';
import { cn } from '../../lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex h-8 animate-shimmer items-center justify-center rounded-md border border-zinc-800 bg-[linear-gradient(110deg,#18181b,45%,#3f3f46,55%,#18181b)] bg-[length:200%_100%] px-3.5 text-xs font-semibold text-zinc-100 transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-white shadow-xs cursor-pointer select-none",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';
