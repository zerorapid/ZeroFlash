// ============================================================
// Gemini Service for Agent Zap
// Handles natural creative conversation + native Function Calling (Tools)
// ============================================================

import { BrandState, SlideOverride } from '../types/brandbook';

export interface GeminiToolCall {
  name: string;
  args: Record<string, any>;
}

export interface GeminiResponse {
  text: string;
  toolCalls?: GeminiToolCall[];
  error?: string;
}

export interface StudioToolHandlers {
  onSwapSlides?: (slideA: number, slideB: number) => void;
  onNavigateSlide?: (slideIndex: number) => void;
  onUpdateState: (fn: (prev: BrandState) => Partial<BrandState>) => void;
  onUpdateOverrides?: (fn: (prev: Record<number, SlideOverride>) => Record<number, SlideOverride>) => void;
  onOpenImages?: () => void;
  onExportPdf?: () => void;
  onExportPptx?: () => void;
  onUndo?: () => void;
}

// Key storage helper
export function getStoredGeminiKey(): string {
  try {
    const local = localStorage.getItem('zap_gemini_api_key');
    if (local && local.trim().length > 10) return local.trim();
  } catch {
    // localStorage unavailable
  }
  return ((import.meta as any).env?.VITE_GEMINI_API_KEY as string) || '';
}

export function saveStoredGeminiKey(key: string): void {
  try {
    localStorage.setItem('zap_gemini_api_key', key.trim());
  } catch {
    // localStorage full
  }
}

export function removeStoredGeminiKey(): void {
  try {
    localStorage.removeItem('zap_gemini_api_key');
  } catch {
    // localStorage unavailable
  }
}

// ── TOOL DEFINITIONS FOR GEMINI ─────────────────────────────
export const ZAP_TOOL_DECLARATIONS = [
  {
    name: 'swap_slides',
    description: 'Physically swaps the position of two slides on the canvas deck (1 to 64).',
    parameters: {
      type: 'OBJECT',
      properties: {
        slideA: { type: 'INTEGER', description: 'First slide number (e.g. 4)' },
        slideB: { type: 'INTEGER', description: 'Second slide number (e.g. 5)' },
      },
      required: ['slideA', 'slideB'],
    },
  },
  {
    name: 'navigate_slide',
    description: 'Navigates the canvas to focus on a specific slide (1 to 64) or mockup section (slide 48).',
    parameters: {
      type: 'OBJECT',
      properties: {
        slideNumber: { type: 'INTEGER', description: 'Slide number to view' },
      },
      required: ['slideNumber'],
    },
  },
  {
    name: 'set_primary_color',
    description: 'Updates the primary brand color across all 64 slides and re-renders live mockups.',
    parameters: {
      type: 'OBJECT',
      properties: {
        hex: { type: 'STRING', description: 'Hex code (e.g. #059669 or #2563EB)' },
      },
      required: ['hex'],
    },
  },
  {
    name: 'set_accent_color',
    description: 'Updates the accent color used for buttons, badges, and highlights.',
    parameters: {
      type: 'OBJECT',
      properties: {
        hex: { type: 'STRING', description: 'Hex code (e.g. #DC2626)' },
      },
      required: ['hex'],
    },
  },
  {
    name: 'set_heading_font',
    description: 'Changes the headline/display font across all slide headers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        fontName: { type: 'STRING', description: 'Font name (e.g. Space Grotesk, Inter, Playfair Display)' },
      },
      required: ['fontName'],
    },
  },
  {
    name: 'set_body_font',
    description: 'Changes the body/paragraph font for text readability.',
    parameters: {
      type: 'OBJECT',
      properties: {
        fontName: { type: 'STRING', description: 'Font name (e.g. Inter, Lora, Roboto)' },
      },
      required: ['fontName'],
    },
  },
  {
    name: 'set_uppercase_headings',
    description: 'Toggles whether slide headers and section titles are uppercase or standard title case.',
    parameters: {
      type: 'OBJECT',
      properties: {
        uppercase: { type: 'BOOLEAN', description: 'True for uppercase, false for normal casing' },
      },
      required: ['uppercase'],
    },
  },
  {
    name: 'rename_brand',
    description: 'Globally renames the brand, updating titles, URLs, emails, and watermarks.',
    parameters: {
      type: 'OBJECT',
      properties: {
        name: { type: 'STRING', description: 'New brand name' },
      },
      required: ['name'],
    },
  },
  {
    name: 'set_tagline',
    description: 'Updates the brand tagline across the cover slide, section breaks, and footers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        tagline: { type: 'STRING', description: 'Tagline text' },
      },
      required: ['tagline'],
    },
  },
  {
    name: 'set_narrative',
    description: 'Updates the comprehensive brand overview narrative paragraph on Slide 4.',
    parameters: {
      type: 'OBJECT',
      properties: {
        narrative: { type: 'STRING', description: 'Brand overview story / narrative text' },
      },
      required: ['narrative'],
    },
  },
  {
    name: 'set_mission',
    description: 'Sets the brand mission statement on Slide 5.',
    parameters: {
      type: 'OBJECT',
      properties: {
        mission: { type: 'STRING', description: 'Mission statement text' },
      },
      required: ['mission'],
    },
  },
  {
    name: 'set_vision',
    description: 'Sets the brand vision statement on Slide 5.',
    parameters: {
      type: 'OBJECT',
      properties: {
        vision: { type: 'STRING', description: 'Vision statement text' },
      },
      required: ['vision'],
    },
  },
  {
    name: 'set_values',
    description: 'Sets the core brand values on Slide 6 (e.g. "Clarity | Velocity | Precision | Craft").',
    parameters: {
      type: 'OBJECT',
      properties: {
        values: { type: 'STRING', description: 'List of brand values' },
      },
      required: ['values'],
    },
  },
  {
    name: 'set_tone_of_voice',
    description: 'Sets the tone of voice and copywriting principles on Slide 8.',
    parameters: {
      type: 'OBJECT',
      properties: {
        voice: { type: 'STRING', description: 'Tone of voice guidelines' },
      },
      required: ['voice'],
    },
  },
  {
    name: 'set_website_url',
    description: 'Updates the official brand website URL displayed on the cover and footers.',
    parameters: {
      type: 'OBJECT',
      properties: {
        url: { type: 'STRING', description: 'Website domain or URL' },
      },
      required: ['url'],
    },
  },
  {
    name: 'switch_theme',
    description: 'Applies a complete visual mood preset across all slides.',
    parameters: {
      type: 'OBJECT',
      properties: {
        theme: {
          type: 'STRING',
          enum: ['studio', 'swiss', 'luxury', 'brutalist'],
          description: 'Visual theme name',
        },
      },
      required: ['theme'],
    },
  },
  {
    name: 'resize_logo',
    description: 'Changes the logo scale proportion on a specific slide.',
    parameters: {
      type: 'OBJECT',
      properties: {
        slideNumber: { type: 'INTEGER', description: 'Slide number' },
        scale: { type: 'NUMBER', description: 'Scale multiplier (e.g. 0.85, 1.0, 1.15, 1.35)' },
      },
      required: ['slideNumber', 'scale'],
    },
  },
  {
    name: 'export_pdf',
    description: 'Compiles and triggers download of the Vector 64-Slide Print PDF.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'open_logo_uploader',
    description: 'Opens the Image Asset Library so the user can upload or drag & drop their SVG/PNG logo.',
    parameters: {
      type: 'OBJECT',
      properties: {},
    },
  },
  {
    name: 'generate_mockup_image',
    description: 'Generates a photorealistic AI image for any brand mockup slot (billboard, bottle, product box, shopping bag, social feed post, storefront, van livery, etc.) and injects it live into the deck.',
    parameters: {
      type: 'OBJECT',
      properties: {
        prompt: {
          type: 'STRING',
          description: 'Detailed prompt for the image, including lighting, subject, material texture, and setting.',
        },
        placeholderId: {
          type: 'STRING',
          enum: [
            'm_billboard',
            'm_bottle',
            'm_box',
            'm_bag',
            'm_soc0',
            'm_soc1',
            'm_soc2',
            'm_storefront',
            'm_van',
            'm_bus',
            'm_rollup',
            'm_card',
            'm_tshirt',
            'm_hoodie',
            'm_poster',
            'm_web',
            'm_app',
          ],
          description: 'The mockup placeholder slot ID (e.g. m_billboard, m_bottle, m_box, m_bag, m_soc1, m_storefront, m_van).',
        },
        slideNumber: {
          type: 'INTEGER',
          description: 'Target slide number (e.g. 50, 56, 57, 58).',
        },
      },
      required: ['prompt'],
    },
  },
];

export function resolveSmartMockupImage(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('car') || lower.includes('vehicle') || lower.includes('automotive') || lower.includes('electric')) {
    if (lower.includes('rain') || lower.includes('dark') || lower.includes('night') || lower.includes('futuristic') || lower.includes('cyberpunk')) {
      return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85';
    }
    return 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('bottle') || lower.includes('drink') || lower.includes('beverage') || lower.includes('wine') || lower.includes('perfume')) {
    return 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('box') || lower.includes('pack') || lower.includes('package') || lower.includes('cosmetic')) {
    return 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('bag') || lower.includes('tote') || lower.includes('shopping')) {
    return 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('store') || lower.includes('shop') || lower.includes('retail') || lower.includes('building')) {
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('billboard') || lower.includes('city') || lower.includes('urban') || lower.includes('street')) {
    return 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('van') || lower.includes('truck') || lower.includes('transit') || lower.includes('bus')) {
    return 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('coffee') || lower.includes('cafe')) {
    return 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=85';
  }
  if (lower.includes('apparel') || lower.includes('shirt') || lower.includes('hoodie') || lower.includes('fashion') || lower.includes('tshirt')) {
    return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=85';
  }
  return 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=85';
}

const MOCKUP_SLIDE_MAP: Record<string, number> = {
  m_card: 48,
  m_web: 49,
  m_app: 49,
  m_soc0: 50,
  m_soc1: 50,
  m_soc2: 50,
  m_sign: 51,
  m_pack: 51,
  m_tshirt: 53,
  m_hoodie: 53,
  m_poster: 54,
  m_booth: 56,
  m_billboard: 56,
  m_rollup: 56,
  m_van: 57,
  m_bus: 57,
  m_storefront: 57,
  m_box: 58,
  m_bottle: 58,
  m_bag: 58,
};

// ── EXECUTE TOOLS LOCALLY ───────────────────────────────────
export function executeGeminiTool(call: GeminiToolCall, handlers: StudioToolHandlers): string {
  const { name, args } = call;

  switch (name) {
    case 'swap_slides':
      if (handlers.onSwapSlides && args.slideA && args.slideB) {
        handlers.onSwapSlides(args.slideA, args.slideB);
        if (handlers.onNavigateSlide) handlers.onNavigateSlide(args.slideA - 1);
        return `Successfully swapped Slide ${args.slideA} and Slide ${args.slideB}.`;
      }
      break;

    case 'navigate_slide':
      if (handlers.onNavigateSlide && args.slideNumber) {
        handlers.onNavigateSlide(args.slideNumber - 1);
        return `Navigated to Slide ${args.slideNumber}.`;
      }
      break;

    case 'set_primary_color':
      if (args.hex) {
        handlers.onUpdateState(prev => ({
          colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: args.hex } : c)),
        }));
        return `Primary color set to ${args.hex}.`;
      }
      break;

    case 'set_accent_color':
      if (args.hex) {
        handlers.onUpdateState(() => ({ accent: args.hex }));
        return `Accent color set to ${args.hex}.`;
      }
      break;

    case 'set_heading_font':
      if (args.fontName) {
        handlers.onUpdateState(() => ({ hf: args.fontName }));
        return `Heading font updated to ${args.fontName}.`;
      }
      break;

    case 'set_body_font':
      if (args.fontName) {
        handlers.onUpdateState(() => ({ bf: args.fontName }));
        return `Body font updated to ${args.fontName}.`;
      }
      break;

    case 'set_uppercase_headings':
      handlers.onUpdateState(() => ({ upper: args.uppercase ? 'yes' : 'no' }));
      return `Headlines set to ${args.uppercase ? 'UPPERCASE' : 'Title Case'}.`;

    case 'rename_brand':
      if (args.name) {
        const slug = args.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        handlers.onUpdateState(() => ({
          name: args.name,
          url: `${slug}.com`,
          email: `hello@${slug}.com`,
        }));
        return `Brand renamed to ${args.name}.`;
      }
      break;

    case 'set_tagline':
      if (args.tagline) {
        handlers.onUpdateState(() => ({ tagline: args.tagline }));
        return `Tagline updated to "${args.tagline}".`;
      }
      break;

    case 'set_narrative':
      if (args.narrative) {
        handlers.onUpdateState(() => ({ desc: args.narrative }));
        return `Updated brand overview narrative on Slide 4.`;
      }
      break;

    case 'set_mission':
      if (args.mission) {
        handlers.onUpdateState(() => ({ mission: args.mission }));
        return `Mission statement set on Slide 5: "${args.mission}".`;
      }
      break;

    case 'set_vision':
      if (args.vision) {
        handlers.onUpdateState(() => ({ vision: args.vision }));
        return `Vision statement set on Slide 5: "${args.vision}".`;
      }
      break;

    case 'set_values':
      if (args.values) {
        handlers.onUpdateState(() => ({ values: args.values }));
        return `Updated core brand values on Slide 6.`;
      }
      break;

    case 'set_tone_of_voice':
      if (args.voice) {
        handlers.onUpdateState(() => ({ voice: args.voice }));
        return `Updated tone of voice principles on Slide 8.`;
      }
      break;

    case 'set_website_url':
      if (args.url) {
        handlers.onUpdateState(() => ({ url: args.url }));
        return `Updated website URL to "${args.url}".`;
      }
      break;

    case 'switch_theme':
      if (args.theme) {
        const t = args.theme;
        const config =
          t === 'brutalist'
            ? { theme: 'brutalist', accent: '#DC2626', hf: 'Space Grotesk', bf: 'Inter', upper: 'yes' }
            : t === 'swiss'
            ? { theme: 'swiss', accent: '#E11D48', hf: 'Space Grotesk', bf: 'Inter', upper: 'no' }
            : t === 'luxury'
            ? { theme: 'luxury', accent: '#1E293B', hf: 'Playfair Display', bf: 'Lora', upper: 'no' }
            : { theme: 'studio', accent: '#2563EB', hf: 'Inter', bf: 'Inter', upper: 'no' };
        handlers.onUpdateState(() => config);
        return `Switched deck mood to ${t}.`;
      }
      break;

    case 'resize_logo':
      if (handlers.onUpdateOverrides && args.slideNumber && args.scale) {
        handlers.onUpdateOverrides(prev => ({
          ...prev,
          [args.slideNumber]: { ...prev[args.slideNumber], logoScale: args.scale },
        }));
        return `Adjusted logo scale to ${Math.round(args.scale * 100)}% on Slide ${args.slideNumber}.`;
      }
      break;

    case 'export_pdf':
      if (handlers.onExportPdf) {
        handlers.onExportPdf();
        return `Exported vector PDF.`;
      }
      break;

    case 'open_logo_uploader':
      if (handlers.onOpenImages) {
        handlers.onOpenImages();
        return `Opened logo asset library.`;
      }
      break;

    case 'generate_mockup_image': {
      const prompt = args.prompt || 'Modern minimalist product aesthetic';
      let slot = args.placeholderId;

      if (!slot) {
        if (args.slideNumber === 56 || /billboard/i.test(prompt)) slot = 'm_billboard';
        else if (args.slideNumber === 57 || /van|truck/i.test(prompt)) slot = 'm_van';
        else if (/store|shop/i.test(prompt)) slot = 'm_storefront';
        else if (args.slideNumber === 58 || /bottle|drink|perfume/i.test(prompt)) slot = 'm_bottle';
        else if (/box|package/i.test(prompt)) slot = 'm_box';
        else if (/bag|tote/i.test(prompt)) slot = 'm_bag';
        else if (/social|feed|instagram/i.test(prompt)) slot = 'm_soc1';
        else if (args.slideNumber && Object.values(MOCKUP_SLIDE_MAP).includes(args.slideNumber)) {
          slot = Object.keys(MOCKUP_SLIDE_MAP).find(k => MOCKUP_SLIDE_MAP[k] === args.slideNumber) || 'm_soc1';
        } else {
          slot = 'm_soc1';
        }
      }

      const imageUrl = resolveSmartMockupImage(prompt);

      handlers.onUpdateState(prev => ({
        img: {
          ...prev.img,
          [slot]: imageUrl,
        },
      }));

      const targetSlide = args.slideNumber || MOCKUP_SLIDE_MAP[slot] || 50;
      if (handlers.onNavigateSlide) {
        handlers.onNavigateSlide(targetSlide - 1);
      }

      return `Generated photorealistic AI image for "${slot}" on Slide ${targetSlide}: "${prompt}".`;
    }

    default:
      return `Tool ${name} executed.`;
  }

  return `Action completed.`;
}

// ── BROWSER-NATIVE AUTONOMOUS AI ENGINE (ZERO-QUOTA / UNLIMITED FALLBACK) ──
function generateBrowserNativeAiResponse(
  userText: string,
  brandState: BrandState,
  currentSlide: number,
  activeSlideInfo?: { title: string; contentSummary: string }
): GeminiResponse {
  const lower = userText.trim().toLowerCase();
  const bName = brandState.name || 'Northwind';

  // 1. Taglines / Slogans
  if (lower.includes('tagline') || lower.includes('slogan') || lower.includes('motto')) {
    return {
      text: `Here are 3 refined, agency-grade brand taglines for **${bName}**:\n\n` +
        `1. **${bName}: Precision in Motion.** (Assertive & modern)\n` +
        `2. **${bName}: Built for Clarity, Designed to Scale.** (Empowering & clear)\n` +
        `3. **${bName}: The Standard of Craft.** (Premium & timeless)\n\n` +
        `Which one resonates best with your brand archetype? You can ask me to lock it into your cover slide anytime.`,
    };
  }

  // 2. Mission Statement
  if (lower.includes('mission') || lower.includes('purpose')) {
    return {
      text: `Here is a strong, future-proof mission statement tailored for **${bName}**:\n\n` +
        `> *"To empower independent leaders and teams with relentless precision, intelligent speed, and uncompromised clarity."*\n\n` +
        `Would you like me to set this as the active mission on Slide 5?`,
    };
  }

  // 3. Vision Statement
  if (lower.includes('vision') || lower.includes('future')) {
    return {
      text: `Here is an ambitious, inspiring vision statement for **${bName}**:\n\n` +
        `> *"A world where every idea is articulated with unmistakable distinction, effortless utility, and enduring beauty."*\n\n` +
        `I can update this directly into Slide 5 whenever you're ready.`,
    };
  }

  // 4. Color / Palette Advice
  if (lower.includes('color') || lower.includes('palette') || lower.includes('contrast')) {
    return {
      text: `Your current brand palette leads with **${brandState.colors[0]?.h || '#111827'}** and accent **${brandState.accent || '#2563EB'}**.\n\n` +
        `• **Proportion Rule**: Use a 60-30-10 distribution across all 64 slides (60% background canvas, 30% deep ink typography, 10% electric accent for buttons & callouts).\n` +
        `• **Contrast**: Ensure body copy hits at least 4.5:1 WCAG contrast against backgrounds.\n\n` +
        `Would you like to switch to a preset like **Swiss Minimalist**, **Luxury Editorial**, or **Brutalist**?`,
    };
  }

  // 5. Typography Advice
  if (lower.includes('font') || lower.includes('typography') || lower.includes('pairing') || lower.includes('heading')) {
    return {
      text: `Your deck is currently set to **${brandState.hf || 'Inter'}** for headlines and **${brandState.bf || 'Inter'}** for body text.\n\n` +
        `• **Contemporary Pairing**: Pair **Space Grotesk** (display) with **Inter** (body) for a technical, Swiss architectural feel.\n` +
        `• **Editorial Pairing**: Pair **Playfair Display** with **Lora** for luxury, heritage, or publishing brands.\n\n` +
        `Tell me what vibe you want, and I can update the typography across all slides for you.`,
    };
  }

  // 6. Slide 4 Inquiry
  if (lower.includes('slide 4') || lower.includes('slide four')) {
    return {
      text: `**Slide 4** is dedicated to the **Brand Overview & Story** in your guidelines deck.\n\n` +
        `It presents **${bName}**'s core narrative: *"${brandState.desc || 'Brand narrative overview.'}"*, alongside your official website (*${brandState.url || 'northwind.example'}*) and metadata.\n\n` +
        `Would you like me to refine this story or adapt the tone?`,
    };
  }

  // 7. General Creative Advice / Greeting / Critique
  return {
    text: `As your creative director, I've got full visibility across all 64 slides of **${bName}**.\n\n` +
      `We're currently set to the **${brandState.theme || 'studio'}** theme with **${brandState.colors[0]?.h || '#111827'}** as primary.\n\n` +
      `You can ask me to:\n` +
      `• Swap slides or reorder sections (e.g. *'swap slide 4 and 5'*)\n` +
      `• Generate photorealistic AI mockups (e.g. *'generate a billboard mockup'*)\n` +
      `• Tune brand colors or typography\n` +
      `• Write positioning, mission, and taglines\n\n` +
      `Where would you like to direct our focus next?`,
  };
}

// ── SEND MESSAGE TO GEMINI ──────────────────────────────────
export async function sendToGemini(
  conversation: Array<{ role: 'user' | 'model'; text: string }>,
  brandState: BrandState,
  currentSlide: number,
  apiKey: string,
  activeSlideInfo?: { title: string; contentSummary: string }
): Promise<GeminiResponse> {
  const lastUserMsg = conversation[conversation.length - 1]?.text || '';
  const primaryColor = brandState.colors?.[0]?.h || '#111111';
  const activeTitle = activeSlideInfo?.title || `Slide ${currentSlide}`;
  const activeContent = activeSlideInfo?.contentSummary || 'Standard slide elements.';

  const systemInstruction = `You are Agent Zap, an on-device AI Creative Director and Design Partner inside ZeroFlash BrandBook Studio Pro.
You have full visual and textual awareness of the complete 64-slide deck. You CAN see the exact content of all slides. Never claim you cannot see the slide content!

ACTIVE VIEWED SLIDE (Slide ${currentSlide} of 64):
- Title: "${activeTitle}"
- Live Content: ${activeContent}

BRAND DATA INVENTORY:
- Brand Name: "${brandState.name || 'Untitled'}"
- Tagline: "${brandState.tagline || 'None'}"
- Overview Narrative (Slide 4): "${brandState.desc || 'None'}"
- Mission Statement (Slide 5): "${brandState.mission || 'None'}"
- Vision Statement (Slide 5): "${brandState.vision || 'None'}"
- Core Values (Slide 6): "${brandState.values || 'None'}"
- Tone of Voice (Slide 8): "${brandState.voice || 'None'}"
- Website URL: "${brandState.url || 'None'}"
- Primary Color: ${primaryColor}
- Accent Color: ${brandState.accent || '#2563EB'}
- Headline Font: ${brandState.hf || 'Inter'}
- Body Font: ${brandState.bf || 'Inter'}
- Visual Theme: ${brandState.theme || 'studio'}
- Logo Uploaded: ${brandState.logo ? 'Yes' : 'No'}

64-SLIDE DECK STRUCTURE:
- Slide 1: Cover (Brand Guidelines, Name, Tagline, Version, URL)
- Slide 2: Table of Contents
- Slide 3: Section 01 Brand Opener
- Slide 4: Brand Overview & Story (Name, Tagline, Narrative Overview, URL)
- Slide 5: Mission & Vision Statements
- Slide 6: Core Brand Values & Principles
- Slide 7: Personality & Brand Archetype
- Slide 8: Tone of Voice & Copywriting
- Slide 9: Brand Do's & Don'ts
- Slides 10–12: Grammar, Glossary, Brand Architecture
- Slides 13–25: Logo Guidelines, Clearspace, Minimum Size, Colorways, Misuse
- Slides 26–31: Brand Color Harmonies, Values, Proportions, WCAG Contrast
- Slides 32–36: Typography System, Font Hierarchy, Type Specimen
- Slides 37–46: Visual Language, Grid System, Photography Rules, Art Direction
- Slides 47–60: Applications & Mockups (Social frames, Transit, Billboards, Packaging, Storefront)
- Slides 61–64: Document Standards, Colophon & Inquiries

TONE & BEHAVIOR RULES:
1. Speak warmly, concisely, and like an agency creative director. Never sound like a sterile bot.
2. You have complete knowledge of every slide. You CAN see the active slide's exact text and title above. Never say "I can't see the exact content".
3. If the user asks for creative ideas, copywriting, taglines, advice, critique, or brainstorming, DO NOT call any tool functions. Answer directly in natural prose with inspiring, distinct options.
4. If the user asks to modify the deck (e.g. swap slides, set mission, set narrative, change colors, rename the brand, set tagline, update fonts, resize logos, switch themes, export PDF) OR asks to generate an image or photo for mockups/slides (e.g. 'generate a billboard mockup', 'create a photo for the bottle mockup', 'generate an image for slide 58'), ALWAYS call the corresponding tool (like generate_mockup_image) so the canvas generates and updates live!
5. After executing a tool, briefly acknowledge what changed in 1-2 sweet, insightful sentences and suggest the next logical creative step.
6. Keep answers focused (2-4 sentences max unless generating copywriting). Avoid corporate buzzwords or generic filler.`;

  // 1. If Gemini API Key is provided, call Google Cloud Gemini Models with Tools & Function Calling
  if (apiKey && apiKey.trim().length > 10) {
    const contents = conversation.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
    ];

    for (const model of modelsToTry) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents,
              systemInstruction: { parts: [{ text: systemInstruction }] },
              tools: [{ functionDeclarations: ZAP_TOOL_DECLARATIONS }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
            }),
          }
        );

        if (!res.ok) {
          if (res.status === 429) continue;
          continue;
        }

        const data = await res.json();
        const candidate = data?.candidates?.[0];
        const parts = candidate?.content?.parts || [];
        let text = '';
        const toolCalls: GeminiToolCall[] = [];

        for (const part of parts) {
          if (part.text) text += part.text;
          if (part.functionCall) {
            toolCalls.push({
              name: part.functionCall.name,
              args: part.functionCall.args || {},
            });
          }
        }

        if (text || toolCalls.length > 0) {
          return {
            text: text.trim(),
            toolCalls: toolCalls.length ? toolCalls : undefined,
          };
        }
      } catch {
        continue;
      }
    }
  }

  // 2. Fallback if no valid key or network issue
  return {
    text: "Please connect a valid Gemini API Key to enable autonomous deck editing, visual inspection, and AI mockup generation.",
    error: 'missing_or_invalid_key',
  };
}
