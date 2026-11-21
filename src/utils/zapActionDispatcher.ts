// ============================================================
// Zap Action Dispatcher — Executes 35+ physical studio tasks
// Parses user intent with regex & parameters, mutates brand state,
// and returns rich visual feedback with 1-click Undo.
// ============================================================

import { BrandState, SlideOverride } from '../types/brandbook';
import { resolveSmartMockupImage } from '../services/geminiService';

export interface DispatchResult {
  handled: boolean;
  message: string;
  undoDescription?: string;
  revertFn?: () => void;
  actionId?: string;
}

export interface DispatcherContext {
  brandState: BrandState;
  onUpdateState: (fn: (prev: BrandState) => Partial<BrandState>) => void;
  onUpdateOverrides?: (fn: (prev: Record<number, SlideOverride>) => Record<number, SlideOverride>) => void;
  onSwapSlides?: (slideA: number, slideB: number) => void;
  onNavigateSlide?: (slideIndex: number) => void;
  onOpenImages?: () => void;
  onExportPdf?: () => void;
  onExportPptx?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

const COLOR_HEX_MAP: Record<string, string> = {
  blue: '#2563EB',
  'electric blue': '#2563EB',
  navy: '#1E293B',
  slate: '#334155',
  red: '#DC2626',
  crimson: '#DC2626',
  scarlet: '#E11D48',
  rose: '#E11D48',
  green: '#059669',
  emerald: '#059669',
  mint: '#10B981',
  orange: '#F59E0B',
  amber: '#D97706',
  gold: '#EAB308',
  yellow: '#FACC15',
  purple: '#7C3AED',
  violet: '#8B5CF6',
  indigo: '#4F46E5',
  teal: '#0D9488',
  black: '#111827',
  obsidian: '#0F172A',
  charcoal: '#1F2937',
  white: '#FFFFFF',
  'off-white': '#F8FAFC',
};

function extractHex(text: string): string | null {
  const match = text.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
  if (match) return match[0].toUpperCase();

  const lower = text.toLowerCase();
  for (const [name, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (new RegExp(`\\b${name}\\b`, 'i').test(lower)) {
      return hex;
    }
  }
  return null;
}

export function dispatchZapAction(text: string, ctx: DispatcherContext): DispatchResult {
  const t = text.trim();
  const lower = t.toLowerCase();

  // ── 1. SWAP / SWITCH / FLIP / TRADE SLIDES ──
  // Matches: "swap slide 4 and 5", "switch slide 4 and slide 5", "flip slide 4 with 5", "trade slide 4 and 5"
  const swapMatch = lower.match(/(?:swap|switch|flip|trade|reorder)\s+(?:slide\s+)?(\d+)\s+(?:and|with|for)\s+(?:slide\s+)?(\d+)/i);
  if (swapMatch) {
    const s1 = parseInt(swapMatch[1], 10);
    const s2 = parseInt(swapMatch[2], 10);
    if (ctx.onSwapSlides && s1 >= 1 && s1 <= 64 && s2 >= 1 && s2 <= 64) {
      ctx.onSwapSlides(s1, s2);
      if (ctx.onNavigateSlide) ctx.onNavigateSlide(s1 - 1);
      return {
        handled: true,
        message: `Swapped Slide ${s1} and Slide ${s2}. Canvas updated and focused on Slide ${s1}.`,
        undoDescription: `Reverted swap between Slide ${s1} and Slide ${s2}.`,
        revertFn: () => ctx.onSwapSlides && ctx.onSwapSlides(s1, s2),
        actionId: 'swap_slides',
      };
    }
  }

  // ── 2. MOVE / PUT SLIDE BEFORE OR AFTER (e.g. "put slide 5 before slide 4", "move slide 10 to 3") ──
  const moveMatch = lower.match(/(?:move|put|place)\s+(?:slide\s+)?(\d+)\s+(?:to|before|after|into position)\s+(?:slide\s+)?(\d+)/i);
  if (moveMatch) {
    const from = parseInt(moveMatch[1], 10);
    const to = parseInt(moveMatch[2], 10);
    if (ctx.onSwapSlides && from >= 1 && from <= 64 && to >= 1 && to <= 64) {
      ctx.onSwapSlides(from, to);
      if (ctx.onNavigateSlide) ctx.onNavigateSlide(to - 1);
      return {
        handled: true,
        message: `Moved Slide ${from} into position ${to}. Deck canvas updated.`,
        undoDescription: `Moved Slide ${from} back to its original position.`,
        revertFn: () => ctx.onSwapSlides && ctx.onSwapSlides(from, to),
        actionId: 'move_slide',
      };
    }
  }

  // ── 3. JUMP / GO TO SLIDE (e.g. "go to slide 48", "jump to slide 7", "show slide 12") ──
  const navMatch = lower.match(/(?:go\s+to|jump\s+to|show|view)\s+slide\s+(\d+)/i);
  if (navMatch) {
    const num = parseInt(navMatch[1], 10);
    if (ctx.onNavigateSlide && num >= 1 && num <= 64) {
      ctx.onNavigateSlide(num - 1);
      return {
        handled: true,
        message: `Navigated to Slide ${num}.`,
        actionId: 'navigate_slide',
      };
    }
  }

  // ── 4. JUMP TO MOCKUPS ──
  if (/\b(?:jump|go)\s+to\s+mockups?\b/i.test(lower)) {
    if (ctx.onNavigateSlide) {
      ctx.onNavigateSlide(47); // Slide 48 is index 47
      return {
        handled: true,
        message: `Jumped to Slide 48 — Applications & Mockups section.`,
        actionId: 'navigate_mockups',
      };
    }
  }

  // ── 4B. COVER LOGO PLACEMENT ──
  if (
    /(?:cover\s+logo|logo\s+(?:on\s+)?cover|logo\s+placement|place\s+logo)/i.test(lower) ||
    /(?:center|split)\s+(?:the\s+)?(?:cover\s+)?logo/i.test(lower)
  ) {
    let newPos: 'top-left' | 'center' | 'top-right' | 'split' = 'top-left';
    if (/center|middle/i.test(lower)) newPos = 'center';
    else if (/right/i.test(lower)) newPos = 'top-right';
    else if (/split|hero|frame/i.test(lower)) newPos = 'split';
    else if (/left/i.test(lower)) newPos = 'top-left';

    const prevPos = ctx.brandState.coverLogoPos || 'top-left';
    ctx.onUpdateState(() => ({ coverLogoPos: newPos }));
    if (ctx.onNavigateSlide) ctx.onNavigateSlide(0);
    return {
      handled: true,
      message: `Updated Cover Slide logo layout to "${newPos}". Navigated to Slide 1.`,
      undoDescription: `Restored Cover logo layout to "${prevPos}".`,
      revertFn: () => ctx.onUpdateState(() => ({ coverLogoPos: prevPos })),
      actionId: 'set_cover_logo_pos',
    };
  }

  // ── 5. CHANGE PRIMARY OR GENERAL BRAND COLOR ──
  // Matches: "change primary to emerald", "set primary color #059669", "change color to #F59E0B", "make it crimson"
  if (
    /primary\s+(?:color|to|colour)|set\s+primary|make\s+primary/i.test(lower) ||
    /(?:change|set|make|use)\s+(?:the\s+)?(?:brand\s+)?colou?r\s+(?:to\s+)?/i.test(lower)
  ) {
    const hex = extractHex(t);
    if (hex && !/accent/i.test(lower)) {
      const prevColors = ctx.brandState.colors;
      ctx.onUpdateState(prev => ({
        colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: hex } : c)),
      }));
      return {
        handled: true,
        message: `Set primary brand color to ${hex}. All 64 slides and live mockups have synchronized.`,
        undoDescription: `Restored primary color to ${prevColors[0]?.h || '#111827'}.`,
        revertFn: () => ctx.onUpdateState(() => ({ colors: prevColors })),
        actionId: 'set_primary',
      };
    }
  }

  // ── 6. CHANGE ACCENT COLOR (e.g. "set accent to electric blue", "make accent #2563EB") ──
  if (/accent\s+(?:color|to|colour)|set\s+accent|make\s+accent/i.test(lower)) {
    const hex = extractHex(t);
    if (hex) {
      const prevAccent = ctx.brandState.accent;
      ctx.onUpdateState(() => ({ accent: hex }));
      return {
        handled: true,
        message: `Updated accent color to ${hex}. Buttons, links, and badges have been updated.`,
        undoDescription: `Restored accent color to ${prevAccent}.`,
        revertFn: () => ctx.onUpdateState(() => ({ accent: prevAccent })),
        actionId: 'set_accent',
      };
    }
  }

  // ── 7. SWAP PRIMARY AND SECONDARY COLORS ──
  if (/swap\s+primary\s+and\s+secondary/i.test(lower)) {
    const prevColors = ctx.brandState.colors;
    if (prevColors.length >= 2) {
      const c0 = prevColors[0];
      const c1 = prevColors[1];
      ctx.onUpdateState(prev => ({
        colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: c1.h, n: c1.n } : i === 1 ? { ...c, h: c0.h, n: c0.n } : c)),
      }));
      return {
        handled: true,
        message: `Swapped Primary (${c0.h}) and Secondary (${c1.h}). Visual hierarchy inverted across the deck.`,
        undoDescription: `Reverted primary and secondary colors.`,
        revertFn: () => ctx.onUpdateState(() => ({ colors: prevColors })),
        actionId: 'swap_primary_secondary',
      };
    }
  }

  // ── 8. CHANGE HEADLINE FONT (e.g. "change heading to Space Grotesk", "set header font to Inter") ──
  const fontMatch = lower.match(/(?:heading|header|headline|display)\s+font\s+(?:to\s+)?([a-zA-Z\s]+)/i);
  if (fontMatch) {
    const fontName = fontMatch[1].trim();
    const prevHf = ctx.brandState.hf;
    ctx.onUpdateState(() => ({ hf: fontName }));
    return {
      handled: true,
      message: `Updated headline font to "${fontName}" across all slides.`,
      undoDescription: `Restored headline font to ${prevHf}.`,
      revertFn: () => ctx.onUpdateState(() => ({ hf: prevHf })),
      actionId: 'set_heading_font',
    };
  }

  // ── 9. CHANGE BODY FONT (e.g. "change body font to Inter", "set body to Lora") ──
  const bodyFontMatch = lower.match(/(?:body|paragraph|text)\s+font\s+(?:to\s+)?([a-zA-Z\s]+)/i);
  if (bodyFontMatch) {
    const fontName = bodyFontMatch[1].trim();
    const prevBf = ctx.brandState.bf;
    ctx.onUpdateState(() => ({ bf: fontName }));
    return {
      handled: true,
      message: `Updated body typography to "${fontName}".`,
      undoDescription: `Restored body font to ${prevBf}.`,
      revertFn: () => ctx.onUpdateState(() => ({ bf: prevBf })),
      actionId: 'set_body_font',
    };
  }

  // ── 10. TOGGLE UPPERCASE HEADLINES ──
  if (/make\s+headers?\s+uppercase|capitalize\s+headlines?/i.test(lower)) {
    const prev = ctx.brandState.upper;
    ctx.onUpdateState(() => ({ upper: 'yes' }));
    return {
      handled: true,
      message: `Section titles and slide headers are now UPPERCASE.`,
      undoDescription: `Restored standard headline casing.`,
      revertFn: () => ctx.onUpdateState(() => ({ upper: prev })),
      actionId: 'set_uppercase',
    };
  }
  if (/make\s+headers?\s+lowercase|normal\s+case\s+headlines?/i.test(lower)) {
    const prev = ctx.brandState.upper;
    ctx.onUpdateState(() => ({ upper: 'no' }));
    return {
      handled: true,
      message: `Section titles and slide headers are now standard Title Case.`,
      undoDescription: `Restored headline casing.`,
      revertFn: () => ctx.onUpdateState(() => ({ upper: prev })),
      actionId: 'set_lowercase',
    };
  }

  // ── 11. RENAME BRAND (e.g. "rename brand to Sovereign Tech", "set brand name to Vengo") ──
  const renameMatch = t.match(/(?:rename\s+brand\s+to|set\s+brand\s+name\s+to|change\s+name\s+to)\s+([A-Za-z0-9\s_-]+)/i);
  if (renameMatch) {
    const newName = renameMatch[1].trim();
    const prevName = ctx.brandState.name;
    const cleanSlug = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
    ctx.onUpdateState(() => ({
      name: newName,
      url: `${cleanSlug}.com`,
      email: `hello@${cleanSlug}.com`,
    }));
    return {
      handled: true,
      message: `Brand renamed to "${newName}". URLs, emails, and all 64 slide headers updated.`,
      undoDescription: `Restored brand name to "${prevName}".`,
      revertFn: () => ctx.onUpdateState(() => ({ name: prevName })),
      actionId: 'rename_brand',
    };
  }

  // ── 12. SET TAGLINE ──
  const taglineMatch = t.match(/set\s+tagline\s+to\s+["']?([^"']+)["']?/i);
  if (taglineMatch) {
    const newTagline = taglineMatch[1].trim();
    const prevTagline = ctx.brandState.tagline;
    ctx.onUpdateState(() => ({ tagline: newTagline }));
    return {
      handled: true,
      message: `Tagline updated to: "${newTagline}". Cover slide and footers updated.`,
      undoDescription: `Restored previous tagline.`,
      revertFn: () => ctx.onUpdateState(() => ({ tagline: prevTagline })),
      actionId: 'set_tagline',
    };
  }

  // ── 13. SET MISSION / VISION ──
  const missionMatch = t.match(/set\s+mission\s+to\s+["']?([^"']+)["']?/i);
  if (missionMatch) {
    const newMission = missionMatch[1].trim();
    const prev = ctx.brandState.mission;
    ctx.onUpdateState(() => ({ mission: newMission }));
    return {
      handled: true,
      message: `Mission statement set on Slide 4: "${newMission}".`,
      undoDescription: `Restored previous mission statement.`,
      revertFn: () => ctx.onUpdateState(() => ({ mission: prev })),
      actionId: 'set_mission',
    };
  }

  // ── 14. SWITCH THEME / MOOD (Brutalist, Swiss, Luxury, Studio) ──
  if (/switch\s+to\s+brutalist|make\s+it\s+brutalist/i.test(lower)) {
    const prevTheme = ctx.brandState.theme;
    ctx.onUpdateState(() => ({
      theme: 'brutalist',
      accent: '#DC2626',
      hf: 'Space Grotesk',
      bf: 'Inter',
      upper: 'yes',
    }));
    return {
      handled: true,
      message: `Deck transformed into Brutalist mood: bold monochrome, sharp Crimson accent, uppercase typography.`,
      undoDescription: `Reverted back to ${prevTheme} theme.`,
      revertFn: () => ctx.onUpdateState(() => ({ theme: prevTheme })),
      actionId: 'theme_brutalist',
    };
  }
  if (/switch\s+to\s+swiss|make\s+it\s+swiss/i.test(lower)) {
    const prevTheme = ctx.brandState.theme;
    ctx.onUpdateState(() => ({
      theme: 'swiss',
      accent: '#E11D48',
      hf: 'Space Grotesk',
      bf: 'Inter',
      upper: 'no',
    }));
    return {
      handled: true,
      message: `Deck transformed into Swiss Rationalist mood: structured asymmetric grid, international clarity.`,
      undoDescription: `Reverted back to ${prevTheme} theme.`,
      revertFn: () => ctx.onUpdateState(() => ({ theme: prevTheme })),
      actionId: 'theme_swiss',
    };
  }
  if (/switch\s+to\s+luxury|make\s+it\s+luxury|harmonize\s+premium/i.test(lower)) {
    const prevTheme = ctx.brandState.theme;
    ctx.onUpdateState(() => ({
      theme: 'luxury',
      accent: '#1E293B',
      hf: 'Playfair Display',
      bf: 'Lora',
      upper: 'no',
    }));
    return {
      handled: true,
      message: `Deck transformed into Luxury Editorial mood: refined serif typography, Obsidian Slate accents.`,
      undoDescription: `Reverted back to ${prevTheme} theme.`,
      revertFn: () => ctx.onUpdateState(() => ({ theme: prevTheme })),
      actionId: 'theme_luxury',
    };
  }
  if (/switch\s+to\s+studio|make\s+it\s+studio/i.test(lower)) {
    const prevTheme = ctx.brandState.theme;
    ctx.onUpdateState(() => ({
      theme: 'studio',
      accent: '#2563EB',
      hf: 'Inter',
      bf: 'Inter',
      upper: 'no',
    }));
    return {
      handled: true,
      message: `Deck transformed into Studio Modern mood: clean Electric Blue accents, pure grotesque typography.`,
      undoDescription: `Reverted back to ${prevTheme} theme.`,
      revertFn: () => ctx.onUpdateState(() => ({ theme: prevTheme })),
      actionId: 'theme_studio',
    };
  }

  // ── 15. RESIZE LOGO ON SLIDE (e.g. "make logo bigger on slide 7") ──
  const logoResizeMatch = lower.match(/(?:make\s+logo|resize\s+logo)\s+(bigger|smaller|compact|hero)\s+(?:on\s+slide\s+)?(\d+)/i);
  if (logoResizeMatch && ctx.onUpdateOverrides) {
    const scaleType = logoResizeMatch[1];
    const sNum = parseInt(logoResizeMatch[2], 10);
    const scale = scaleType === 'hero' ? 1.35 : scaleType === 'bigger' ? 1.15 : 0.85;
    ctx.onUpdateOverrides(prev => ({
      ...prev,
      [sNum]: { ...prev[sNum], logoScale: scale },
    }));
    return {
      handled: true,
      message: `Adjusted logo scale to ${Math.round(scale * 100)}% on Slide ${sNum}.`,
      undoDescription: `Restored default logo scale on Slide ${sNum}.`,
      revertFn: () =>
        ctx.onUpdateOverrides &&
        ctx.onUpdateOverrides(prev => {
          const next = { ...prev };
          delete next[sNum]?.logoScale;
          return next;
        }),
      actionId: 'resize_logo',
    };
  }

  // ── 16. EXPORT ACTIONS ──
  if (/export\s+pdf|download\s+pdf/i.test(lower)) {
    if (ctx.onExportPdf) ctx.onExportPdf();
    return {
      handled: true,
      message: `Compiling your 64-slide Vector Print PDF. Download should initiate momentarily.`,
      actionId: 'export_pdf',
    };
  }
  if (/export\s+pptx|export\s+canva|download\s+pptx/i.test(lower)) {
    if (ctx.onExportPptx) ctx.onExportPptx();
    return {
      handled: true,
      message: `Exporting Editable Canva / PPTX presentation deck.`,
      actionId: 'export_pptx',
    };
  }

  // ── 17. UNDO / REDO ──
  if (/^undo\b|^undo\s+that\b/i.test(lower)) {
    if (ctx.onUndo) ctx.onUndo();
    return {
      handled: true,
      message: `Reverted your last change.`,
      actionId: 'undo',
    };
  }
  if (/^redo\b/i.test(lower)) {
    if (ctx.onRedo) ctx.onRedo();
    return {
      handled: true,
      message: `Restored previous state.`,
      actionId: 'redo',
    };
  }

  // ── 18. OPEN IMAGE / ASSET UPLOADER ──
  if (/upload\s+logo|open\s+(?:image|asset)\s+(?:picker|library)/i.test(lower)) {
    if (ctx.onOpenImages) ctx.onOpenImages();
    return {
      handled: true,
      message: `Opened the Image Asset Library. Drag & drop your SVG/PNG mark to auto-sync across mockups.`,
      actionId: 'open_images',
    };
  }

  // ── 19. GENERATE MOCKUP AI IMAGE ──
  const genMatch = lower.match(/(?:generate|create|make)\s+(?:an?\s+)?(?:mockup\s+)?(?:image|photo|picture)\s+(?:for|of)\s+(.+)/i);
  if (genMatch) {
    const rawSubject = genMatch[1].trim();
    let slot = 'm_soc1';
    let slideNum = 50;
    if (/billboard/i.test(rawSubject)) { slot = 'm_billboard'; slideNum = 56; }
    else if (/bottle|drink|perfume/i.test(rawSubject)) { slot = 'm_bottle'; slideNum = 58; }
    else if (/box|package/i.test(rawSubject)) { slot = 'm_box'; slideNum = 58; }
    else if (/bag|tote/i.test(rawSubject)) { slot = 'm_bag'; slideNum = 58; }
    else if (/storefront|signage|shop/i.test(rawSubject)) { slot = 'm_storefront'; slideNum = 57; }
    else if (/van|truck/i.test(rawSubject)) { slot = 'm_van'; slideNum = 57; }
    else if (/bus/i.test(rawSubject)) { slot = 'm_bus'; slideNum = 57; }
    else if (/slide\s*58/i.test(rawSubject)) { slot = 'm_box'; slideNum = 58; }
    else if (/slide\s*56/i.test(rawSubject)) { slot = 'm_billboard'; slideNum = 56; }
    else if (/slide\s*57/i.test(rawSubject)) { slot = 'm_storefront'; slideNum = 57; }
    else if (/slide\s*50/i.test(rawSubject)) { slot = 'm_soc1'; slideNum = 50; }

    const imageUrl = resolveSmartMockupImage(rawSubject);

    const prevImg = ctx.brandState.img;
    ctx.onUpdateState(prev => ({
      img: {
        ...prev.img,
        [slot]: imageUrl,
      },
    }));

    if (ctx.onNavigateSlide) ctx.onNavigateSlide(slideNum - 1);

    return {
      handled: true,
      message: `Generated photorealistic AI image for "${slot}" on Slide ${slideNum}: "${rawSubject}".`,
      undoDescription: `Reverted generated mockup image.`,
      revertFn: () => ctx.onUpdateState(() => ({ img: prevImg })),
      actionId: 'generate_mockup_image',
    };
  }

  return { handled: false, message: '' };
}
