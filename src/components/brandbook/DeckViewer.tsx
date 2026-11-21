import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideDefinition, BrandState } from '../../types/brandbook';
import { SlideRenderer } from './SlideRenderer';
import { AceternityCanvas } from '../ui/AceternityCanvas';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

interface DeckViewerProps {
  slides: SlideDefinition[];
  brandState: BrandState;
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  viewMode: 'all' | 'one';
  guides: boolean;
  onTextChange: (slideIndex: number, textId: string, newText: string) => void;
  onRemoveImage: (imageId: string) => void;
  onPlaceholderClick?: (placeholderId: string) => void;
}

export const DeckViewer: React.FC<DeckViewerProps> = ({
  slides,
  brandState,
  activeSlide,
  setActiveSlide,
  viewMode,
  guides,
  onTextChange,
  onRemoveImage,
  onPlaceholderClick,
}) => {
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.isContentEditable || target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'ArrowRight') {
        setActiveSlide(Math.min(slides.length - 1, activeSlide + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveSlide(Math.max(0, activeSlide - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlide, slides.length, setActiveSlide]);

  if (!slides.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-zinc-500">
        <p>No slides to display.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full rounded-2xl bg-white border border-zinc-200/90 shadow-xs overflow-hidden flex flex-col relative">
      <AceternityCanvas className="relative h-full">
        {/* Scrollable Stage Viewport */}
      <div className="flex-1 overflow-y-auto px-8 py-10 flex justify-center">
        <div
          className="w-full max-w-5xl transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomScale})` }}
        >
          {viewMode === 'all' ? (
            <div className="space-y-10 pb-20">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className="transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <SlideRenderer
                    slide={s}
                    slideIndex={idx}
                    brandState={brandState}
                    guides={guides}
                    isSelected={activeSlide === idx}
                    onSelect={() => setActiveSlide(idx)}
                    onTextChange={(id, txt) => onTextChange(idx, id, txt)}
                    onRemoveImage={onRemoveImage}
                    onPlaceholderClick={onPlaceholderClick}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center pb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 8, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.99 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="w-full"
                >
                  <SlideRenderer
                    slide={slides[activeSlide] || slides[0]}
                    slideIndex={activeSlide}
                    brandState={brandState}
                    guides={guides}
                    isSelected={true}
                    onTextChange={(id, txt) => onTextChange(activeSlide, id, txt)}
                    onRemoveImage={onRemoveImage}
                    onPlaceholderClick={onPlaceholderClick}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Aceternity Floating Canvas Zoom Controller (Bottom Right) */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1 rounded-xl border border-zinc-200/80 bg-white/85 p-1 shadow-lg shadow-zinc-950/5 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-zinc-600 hover:text-zinc-950"
          onClick={() => setZoomScale(s => Math.max(0.6, s - 0.1))}
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <span className="min-w-10 text-center font-mono text-[11px] font-semibold text-zinc-700">
          {Math.round(zoomScale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-zinc-600 hover:text-zinc-950"
          onClick={() => setZoomScale(s => Math.min(1.4, s + 0.1))}
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <div className="w-[1px] h-4 bg-zinc-200 mx-0.5" />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg text-zinc-600 hover:text-zinc-950"
          onClick={() => setZoomScale(1)}
          title="Reset zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </AceternityCanvas>
    </div>
  );
};
