import React from 'react';
import { SlideDefinition, SlideItem, BrandState } from '../../types/brandbook';
import { GX, GY } from '../../utils/deckGenerator';
import { isDark, norm } from '../../utils/colorUtils';
import * as LucideIcons from 'lucide-react';
import { Image as ImageIcon, X } from 'lucide-react';
import { SmartMockupRenderer } from './SmartMockupRenderer';

interface SlideRendererProps {
  slide: SlideDefinition;
  slideIndex: number;
  brandState: BrandState;
  guides?: boolean;
  isSelected?: boolean;
  isPrint?: boolean;
  onSelect?: () => void;
  onTextChange?: (itemId: string, newText: string) => void;
  onRemoveImage?: (imageId: string) => void;
  onPlaceholderClick?: (placeholderId: string) => void;
}

const PX = (v: number) => ((v / GX) * 100).toFixed(3) + '%';
const PY = (v: number) => ((v / GY) * 100).toFixed(3) + '%';

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  slideIndex,
  brandState,
  guides,
  isSelected,
  isPrint,
  onSelect,
  onTextChange,
  onRemoveImage,
  onPlaceholderClick,
}) => {
  const S = brandState;

  const renderItem = (it: SlideItem, ix: number) => {
    if (it.hid) return null;

    const style: React.CSSProperties = {
      position: 'absolute',
      left: PX(it.x),
      top: PY(it.y),
      width: PX(it.w),
      height: PY(it.h),
    };

    if (it.k === 'r') {
      const radius = it.ell ? '50%' : it.rd === 0 ? '0' : '0.4cqw';
      return (
        <div
          key={ix}
          style={{
            ...style,
            background: it.fill || 'transparent',
            opacity: it.op !== undefined ? it.op : 1,
            border: it.line ? `1px ${it.dash ? 'dashed' : 'solid'} ${it.line}` : undefined,
            borderRadius: radius,
          }}
        />
      );
    }

    if (it.k === 'i') {
      const own = it.key && S.img[it.key];
      const src = own || S.logo;
      return (
        <img
          key={ix}
          src={src}
          alt="Brand Logo"
          style={{
            ...style,
            objectFit: 'contain',
            objectPosition: it.a === 'left' ? 'left center' : it.a === 'right' ? 'right center' : 'center center',
            filter: it.inv && !own ? 'brightness(0) invert(1)' : undefined,
          }}
        />
      );
    }

    if (it.k === "ic") {
      const rawName = (it.name || "").trim().toLowerCase();
      // Normalize to PascalCase (e.g. "layers" -> "Layers", "book-open" -> "BookOpen")
      const pascalCase = rawName
        .split(/[-_\s]+/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      
      const IconComponent =
        (LucideIcons as any)[pascalCase] ||
        (LucideIcons as any)[rawName.charAt(0).toUpperCase() + rawName.slice(1)] ||
        (LucideIcons as any)[it.name || ""] ||
        LucideIcons.Sparkles;

      return (
        <div
          key={ix}
          style={{
            ...style,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: it.c || "#111827",
          }}
        >
          <IconComponent style={{ width: "100%", height: "100%" }} />
        </div>
      );
    }

    if (it.k === 't') {
      const isHeading = it.f === 'h';
      const fontFamily = isHeading ? S.hf : S.bf;
      const fontSize = `${((it.s || 12) * 0.10417).toFixed(3)}cqw`;
      const fontWeight = it.b ? (isHeading ? (S.hw || 700) : 700) : 400;

      return (
        <div
          key={ix}
          contentEditable={Boolean(!isPrint && it.id)}
          suppressContentEditableWarning
          onBlur={e => {
            if (it.id && onTextChange) {
              onTextChange(it.id, e.currentTarget.textContent || '');
            }
          }}
          style={{
            ...style,
            fontFamily: `'${fontFamily}', sans-serif`,
            fontSize,
            color: it.c || '#111827',
            fontWeight,
            textAlign: it.a || 'left',
            lineHeight: 1.25,
            whiteSpace: 'pre-wrap',
            transform: it.rot ? `rotate(${it.rot}deg)` : undefined,
            cursor: !isPrint && it.id ? 'text' : 'default',
          }}
          className={!isPrint && it.id ? 'hover:outline-dashed hover:outline-1 hover:outline-zinc-400 rounded-xs' : ''}
        >
          {it.t}
        </div>
      );
    }

    if (it.k === 'p') {
      const own = S.img[it.id];
      const src = own || (it.fb ? S.logo : '');
      const fit = it.m || 'cover';

      if (src) {
        return (
          <div
            key={ix}
            style={{
              ...style,
              background: '#FFFFFF',
              border: '1px solid #E4E4E7',
              borderRadius: '0.4cqw',
              overflow: 'hidden',
            }}
            className="group relative"
          >
            <img
              src={src}
              alt={it.label || 'Asset'}
              style={{
                width: '100%',
                height: '100%',
                objectFit: fit,
                padding: fit === 'contain' ? '1cqw' : 0,
              }}
            />
            {onRemoveImage && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onRemoveImage(it.id);
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      }

      // Check if this placeholder is a mockup (ID starts with 'm_' or contains mockup terms)
      const isMockup = Boolean(
        it.id && (
          it.id.startsWith('m_') ||
          it.id.includes('card') ||
          it.id.includes('letter') ||
          it.id.includes('env') ||
          it.id.includes('web') ||
          it.id.includes('app') ||
          it.id.includes('pack') ||
          it.id.includes('sign') ||
          it.id.includes('tshirt') ||
          it.id.includes('hoodie') ||
          it.id.includes('banner') ||
          it.id.includes('poster') ||
          it.id.includes('book')
        )
      );

      if (isMockup) {
        return (
          <div key={ix} style={style}>
            <SmartMockupRenderer
              id={it.id}
              label={it.label || 'Mockup'}
              brand={S}
              onUploadClick={() => onPlaceholderClick?.(it.id)}
            />
          </div>
        );
      }

      return (
        <div
          key={ix}
          style={{
            ...style,
            background: it.bgc || '#F8FAFC',
            border: `1px dashed ${it.tc || '#CBD5E1'}`,
            borderRadius: '0.4cqw',
            color: it.tc || '#64748B',
            cursor: 'pointer',
          }}
          onClick={() => onPlaceholderClick?.(it.id)}
          className="flex flex-col items-center justify-center text-center p-2 select-none hover:bg-zinc-100/80 transition-colors"
        >
          <ImageIcon className="w-5 h-5 opacity-60 mb-1" />
          <b className="text-[0.9cqw] font-semibold">{it.label}</b>
          <span className="text-[0.7cqw] opacity-70">Click or drop image</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div
      onClick={onSelect}
      style={{
        background: slide.bg,
        aspectRatio: '16/9',
      }}
      className={`relative w-full overflow-hidden select-none @container ${
        isPrint
          ? 'border-0 rounded-none shadow-none w-full h-full'
          : `rounded-2xl border transition-all duration-200 ${
              isSelected
                ? 'border-zinc-950 ring-2 ring-zinc-950/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.14),0_2px_6px_rgba(0,0,0,0.06)]'
                : 'border-zinc-200/90 hover:border-zinc-400/80 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]'
            }`
      }`}
    >
      {/* Slide Index Badge */}
      {!isPrint && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-zinc-950/75 text-white backdrop-blur-md border border-white/10 shadow-sm tabular-nums">
          {slideIndex + 1}
        </div>
      )}

      {/* Margin Guides */}
      {!isPrint && guides && (
        <div className="absolute inset-[7%] border border-dashed border-rose-400 pointer-events-none z-20 opacity-60" />
      )}

      {/* Slide Items */}
      {slide.items.map((it, ix) => renderItem(it, ix))}
    </div>
  );
};
