import { BrandState, SlideOverride, ChatOption } from '../types/brandbook';
import { CNAMES, THEMES, VIBES, TONES, FONTS, MOREFONTS } from '../data/brandbookData';
import { norm, mix, hex2hsv, hsv2hex, clamp } from './colorUtils';
import { cleanSVG, svgURL } from './svgProcessor';

export interface CommandContext {
  activeSlide: number;
  selectedElement: number | null;
  state: BrandState;
  overrides: Record<number, SlideOverride>;
}

export interface CommandResponse {
  text: string;
  html?: string;
  options?: ChatOption[];
  undoable?: boolean;
}

export function sanitizeFont(f: string): string {
  const cleaned = f.replace(/['"]/g, '').trim();
  if (/^inter\b/i.test(cleaned)) return 'Inter';
  if (/^plus\s*jakarta/i.test(cleaned)) return 'Plus Jakarta Sans';
  if (/^space\s*grotesk/i.test(cleaned)) return 'Space Grotesk';
  if (/^dm\s*sans/i.test(cleaned)) return 'DM Sans';
  if (/^playfair/i.test(cleaned)) return 'Playfair Display';
  if (/^syne/i.test(cleaned)) return 'Syne';
  if (/^manrope/i.test(cleaned)) return 'Manrope';
  if (/^outfit/i.test(cleaned)) return 'Outfit';
  if (/^lora/i.test(cleaned)) return 'Lora';
  for (const fontName of MOREFONTS) {
    if (cleaned.toLowerCase().includes(fontName.toLowerCase())) return fontName;
  }
  return cleaned;
}

export function resolveTheme(raw: string): string | null {
  const t = raw.toLowerCase().trim();
  if (THEMES[t]) return t;
  if (t.includes('design') || t.includes('studio')) return 'studio';
  if (t.includes('swiss') || t.includes('clean') || t.includes('modern')) return 'swiss';
  if (t.includes('dark') || t.includes('tech') || t.includes('cyber')) return 'technical';
  if (t.includes('brutal')) return 'brutalist';
  if (t.includes('lux') || t.includes('gold')) return 'luxury';
  if (t.includes('warm') || t.includes('craft') || t.includes('earth')) return 'warm';
  if (t.includes('corp') || t.includes('business')) return 'corporate';
  if (t.includes('edit') || t.includes('serif')) return 'editorial';
  return null;
}

const FIELD_KEYS = [
  'brand\\s*name', 'brand', 'company', 'name',
  'tagline', 'slogan',
  'description', 'desc', 'overview', 'narrative', 'about',
  'website', 'web', 'url', 'site',
  'email', 'contact',
  'colors?', 'palette',
  'theme', 'style',
  'heading\\s*font', 'headline\\s*font', 'title\\s*font', 'hf',
  'body\\s*font', 'interface\\s*font', 'content\\s*font', 'bf',
  'mission(?:\\s*statement)?',
  'vision(?:\\s*statement)?',
  'core\\s*values?', 'values?',
  'personality', 'traits', 'attributes',
  'voice', 'tone', 'brand\\s*voice',
  'we\\s*say', 'say',
  "we\\s*don'?t\\s*say", "don'?t\\s*say", "don'?t",
  'clearspace', 'clear\\s*space', 'clear',
  'minimum\\s*size', 'min\\s*size', 'minsize',
  'logo', 'svg',
];

const DELIM = `(?=(?:[\\r\\n]+|\\s+)(?:${FIELD_KEYS.join('|')}):|[\\r\\n]+|$)`;

function extractField(text: string, keyPattern: string): string | null {
  const re = new RegExp(`(?:${keyPattern}):\\s*([\\s\\S]*?)${DELIM}`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

const NUMWORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
};

export function cnorm(s: string): string {
  let t = String(s || '').toLowerCase().replace(/[’`]/g, "'").replace(/[“”]/g, '"').trim();
  t = t.replace(/\b(colou?r|colur|clor|colour)\b/g, 'color')
       .replace(/\b(sldie|silde|slid|slde|sldies)\b/g, 'slide')
       .replace(/\b(chnage|chage|cange|chang|cahnge)\b/g, 'change')
       .replace(/\b(backgrnd|bckground|bakground)\b/g, 'background')
       .replace(/\bbg\b/g, 'background');
  t = t.replace(/^(hey|hi|hello|yo|ok|okay|please|pls|kindly)[\s,]+/i, '');
  t = t.replace(/^(can|could|would|will)\s+(you|we|i)\s+(please\s+)?/i, '');
  t = t.replace(/^(i\s+(want|need|would like|wanna)\s+(you\s+to\s+)?)/i, '');
  return t.trim();
}

export function findColor(t: string, stateColors: { n: string; h: string }[]): string | null {
  const hx = t.match(/#([0-9a-f]{6}|[0-9a-f]{3})\b/i);
  if (hx) return norm(hx[0]);
  
  // Search standard color dictionary
  const keys = Object.keys(CNAMES).sort((a, b) => b.length - a.length);
  for (const k of keys) {
    if (new RegExp('\\b' + k.replace(/ /g, '\\s+') + '\\b').test(t)) return CNAMES[k];
  }

  // Search existing brand palette names
  for (const c of stateColors) {
    if (c.n.length > 2 && t.includes(c.n.toLowerCase())) return norm(c.h);
  }
  return null;
}

export function findTheme(t: string): string | null {
  const keys = Object.keys(THEMES);
  for (const k of keys) {
    if (t.includes(k) || t.includes(THEMES[k].n.toLowerCase())) return k;
  }
  return null;
}

export function findSlide(t: string, ctx: CommandContext): number | null {
  if (/\b(this|current|here)\b/.test(t)) return ctx.activeSlide;
  const m = t.match(/\bslide\s*(?:number\s*|#)?(\d+)/i);
  if (m) return parseInt(m[1], 10) - 1;
  return null;
}

export function executeCommand(
  rawInput: string,
  ctx: CommandContext,
  mutateState: (updater: (prev: BrandState) => Partial<BrandState>) => void,
  mutateOverrides: (updater: (prev: Record<number, SlideOverride>) => Record<number, SlideOverride>) => void,
  triggerUndo: () => void,
  triggerRedo: () => void,
  openImageModal: () => void
): CommandResponse {
  const input = cnorm(rawInput);

  // 1. Undo / Redo
  if (/\b(undo|revert|go back)\b/.test(input)) {
    triggerUndo();
    return { text: 'Undone.' };
  }
  if (/\b(redo|do it again)\b/.test(input)) {
    triggerRedo();
    return { text: 'Redone.' };
  }

  // 2. Help
  if (/^(help|what can you do|commands|examples)/.test(input)) {
    return {
      text: 'Agent Zap can calibrate your brand system instantly with 0 API calls. Select a directive or type your command:',
      options: [
        { label: 'Harmonize Premium Mood', value: 'make it feel premium', icon: 'gem' },
        { label: 'Switch to Brutalist', value: 'switch to brutalist', icon: 'zap' },
        { label: 'Set Electric Cyan Accent', value: 'set accent to #00F0FF', icon: 'palette' },
        { label: 'Find Slide Images', value: 'find images', icon: 'image' },
        { label: 'Audit WCAG Contrast', value: 'check contrast', icon: 'shield' },
      ],
    };
  }

  // 3. Find Images
  if (/\b(find|search|add)\b.*\b(image|images|photo|photos)\b/.test(input)) {
    openImageModal();
    return { text: 'Opening image asset drawer (Unsplash, Openverse, direct URLs, or vector SVG upload).' };
  }

  // 3b. RAW SVG CODE DETECTOR
  const svgMatch = rawInput.match(/<\?xml[\s\S]*?<\/svg>|<svg[\s\S]*?<\/svg>/i);
  let attachedSvg = false;
  let parsedSvgLogo: string | null = null;
  if (svgMatch) {
    const rawSvgCode = svgMatch[0].replace(/<\?xml[\s\S]*?\?>/i, '').trim();
    const cleaned = cleanSVG(rawSvgCode);
    if (cleaned) {
      parsedSvgLogo = svgURL(cleaned.txt);
      attachedSvg = true;
    }
  }

  // 3c. UNIVERSAL BRAND MANIFEST / MULTI-ATTRIBUTE PROMPT PARSER
  const isManifestCandidate =
    attachedSvg ||
    rawInput.includes('\n') ||
    rawInput.includes(';') ||
    /(?:name|brand|palette|colors?|mission|vision|values|theme|tagline|logo|font|clearspace|minimum\s*size):/i.test(rawInput) ||
    (rawInput.trim().startsWith('{') && rawInput.trim().endsWith('}'));

  if (isManifestCandidate) {
    const patch: Partial<BrandState> = {};

    // A. Parse JSON if provided
    let parsedJson: any = null;
    if (rawInput.trim().startsWith('{') && rawInput.trim().endsWith('}')) {
      try {
        parsedJson = JSON.parse(rawInput.trim());
      } catch {}
    }

    if (parsedJson) {
      if (parsedJson.name || parsedJson.brand) patch.name = String(parsedJson.name || parsedJson.brand);
      if (parsedJson.tagline) patch.tagline = String(parsedJson.tagline);
      if (parsedJson.desc || parsedJson.description) patch.desc = String(parsedJson.desc || parsedJson.description);
      if (parsedJson.mission) patch.mission = String(parsedJson.mission);
      if (parsedJson.vision) patch.vision = String(parsedJson.vision);
      if (parsedJson.values) patch.values = String(parsedJson.values);
      if (parsedJson.theme && THEMES[parsedJson.theme]) patch.theme = parsedJson.theme;
      if (parsedJson.hf) patch.hf = sanitizeFont(String(parsedJson.hf));
      if (parsedJson.bf) patch.bf = sanitizeFont(String(parsedJson.bf));
      if (Array.isArray(parsedJson.colors) && parsedJson.colors.length >= 2) {
        patch.colors = parsedJson.colors.map((c: string, i: number) => ({
          n: i === 0 ? 'Primary' : i === 1 ? 'Secondary' : `Accent ${i}`,
          h: norm(c),
          p: ''
        }));
      }
      if (parsedJson.logo) {
        const rawSvg = String(parsedJson.logo).replace(/<\?xml[\s\S]*?\?>/i, '').trim();
        const cl = cleanSVG(rawSvg);
        if (cl) patch.logo = svgURL(cl.txt);
      }
    } else {
      // B. Key-Value & Boundary-Aware Natural Language Parser
      // 1. Brand Name
      const nameVal = extractField(rawInput, 'brand(?:\\s*name)?|company|name');
      if (nameVal) patch.name = nameVal;

      // 2. Tagline
      const tagVal = extractField(rawInput, 'tagline|slogan');
      if (tagVal) patch.tagline = tagVal;

      // 3. Narrative / Description
      const descVal = extractField(rawInput, 'description|desc|overview|narrative|about');
      if (descVal) patch.desc = descVal;

      // 4. Mission & Vision
      const misVal = extractField(rawInput, 'mission(?:\\s*statement)?');
      if (misVal) patch.mission = misVal;
      const visVal = extractField(rawInput, 'vision(?:\\s*statement)?');
      if (visVal) patch.vision = visVal;

      // 5. Values
      const valVal = extractField(rawInput, 'core\\s*values?|values?');
      if (valVal) {
        if (valVal.includes('|')) {
          patch.values = valVal.split('|').map(v => v.trim()).filter(Boolean).join('\n');
        } else {
          patch.values = valVal;
        }
      }

      // 6. Theme
      const themeVal = extractField(rawInput, 'theme|style');
      if (themeVal) {
        const resolved = resolveTheme(themeVal);
        if (resolved) patch.theme = resolved;
      }

      // 7. Heading & Body Fonts
      const hfVal = extractField(rawInput, 'heading\\s*font|headline\\s*font|title\\s*font|hf');
      if (hfVal) patch.hf = sanitizeFont(hfVal);
      const bfVal = extractField(rawInput, 'body\\s*font|interface\\s*font|content\\s*font|bf');
      if (bfVal) patch.bf = sanitizeFont(bfVal);

      // 8. Colors extraction: target Colors field first
      const colorField = extractField(rawInput, 'colors?|palette');
      const targetColorText = colorField || rawInput;
      const hexMatches = targetColorText.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g);
      if (hexMatches && hexMatches.length >= 2) {
        const uniqueHex = Array.from(new Set(hexMatches.map(norm)));
        patch.colors = [
          { n: 'Primary', h: uniqueHex[0], p: '' },
          { n: 'Secondary', h: uniqueHex[1] || '#FFFFFF', p: '' },
          { n: 'Accent', h: uniqueHex[2] || '#276EF1', p: '' },
          { n: 'Light Surface', h: uniqueHex[3] || '#F8F9FA', p: '' },
          { n: 'Dark Neutral', h: uniqueHex[4] || '#14161A', p: '' },
        ];
        if (uniqueHex[2]) patch.accent = uniqueHex[2];
        else if (uniqueHex[1] && uniqueHex[1] !== '#ffffff') patch.accent = uniqueHex[1];
      }

      // 8b. Additional Brand Metadata
      const urlVal = extractField(rawInput, 'website|web|url|site');
      if (urlVal) patch.url = urlVal;

      const emailVal = extractField(rawInput, 'email|contact');
      if (emailVal) patch.email = emailVal;

      const persVal = extractField(rawInput, 'personality|traits|attributes');
      if (persVal) patch.pers = persVal;

      const voiceVal = extractField(rawInput, 'voice|tone|brand\\s*voice');
      if (voiceVal) patch.voice = voiceVal;

      const sayVal = extractField(rawInput, 'we\\s*say|say');
      if (sayVal) patch.say = sayVal;

      const dontVal = extractField(rawInput, "we\\s*don'?t\\s*say|don'?t\\s*say|don'?t");
      if (dontVal) patch.dont = dontVal;

      const clearVal = extractField(rawInput, 'clearspace|clear\\s*space|clear');
      if (clearVal) patch.clear = clearVal;

      const minVal = extractField(rawInput, 'minimum\\s*size|min\\s*size|minsize');
      if (minVal) patch.minsize = minVal;

      // 9. Attach parsed SVG logo if present
      if (parsedSvgLogo) {
        patch.logo = parsedSvgLogo;
      }
    }

    if (Object.keys(patch).length > 0) {
      mutateState(prev => ({ ...prev, ...patch }));

      const feedback = [
        patch.name ? `• Brand Name: "${patch.name}"` : '',
        patch.tagline ? `• Tagline: "${patch.tagline}"` : '',
        patch.desc ? `• Narrative: "${patch.desc.slice(0, 50)}${patch.desc.length > 50 ? '...' : ''}"` : '',
        patch.colors ? `• Palette: ${patch.colors.map(c => c.h).join(', ')}` : '',
        patch.accent ? `• Accent Color: ${patch.accent}` : '',
        patch.theme ? `• Theme Preset: ${patch.theme}` : '',
        patch.hf || patch.bf ? `• Typography: ${patch.hf || 'Inter'} / ${patch.bf || 'Inter'}` : '',
        patch.mission ? `• Mission Statement synchronized` : '',
        patch.vision ? `• Vision Statement synchronized` : '',
        patch.values ? `• Brand Values: ${patch.values.split('\n').join(' | ')}` : '',
        patch.pers ? `• Personality: ${patch.pers}` : '',
        patch.url ? `• Website: ${patch.url}` : '',
        patch.email ? `• Email: ${patch.email}` : '',
        patch.clear ? `• Clearspace: ${patch.clear}` : '',
        patch.minsize ? `• Minimum Size: ${patch.minsize}` : '',
        patch.logo ? `• Vector SVG logo sanitized & synced across all 64 slides` : '',
      ].filter(Boolean);

      return {
        text: `Brand Manifest Synchronized\nYour custom brand system was calibrated across all 64 slides:\n\n${feedback.join('\n')}`,
        undoable: true,
      };
    }
  }

  // 4. Vibe / Aesthetic Mood
  for (const [vibeKey, vibeConfig] of Object.entries(VIBES)) {
    if (new RegExp('\\b' + vibeKey + '\\b').test(input)) {
      mutateState(() => vibeConfig);
      return {
        text: `Applied "${vibeKey}" mood: switched theme, border radius, and typography settings.`,
        undoable: true,
      };
    }
  }

  // 5. Change Theme
  const matchedTheme = findTheme(input);
  if (matchedTheme && /\b(theme|style|switch|use|try)\b/.test(input)) {
    mutateState(() => ({ theme: matchedTheme }));
    return {
      text: `Switched theme to ${THEMES[matchedTheme].n}.`,
      undoable: true,
    };
  }

  // 6. Accent Color
  const foundColor = findColor(input, ctx.state.colors);
  if (foundColor && /\baccent|highlight|main color\b/.test(input)) {
    mutateState(() => ({ accent: foundColor }));
    return {
      text: `Updated brand accent to ${norm(foundColor)}.`,
      undoable: true,
    };
  }

  // 7. Slide Background
  if (foundColor && /\bbackground\b/.test(input)) {
    const slideIdx = findSlide(input, ctx) ?? ctx.activeSlide;
    mutateOverrides(prev => ({
      ...prev,
      [slideIdx]: { ...(prev[slideIdx] || {}), bg: foundColor },
    }));
    return {
      text: `Updated background of Slide ${slideIdx + 1} to ${norm(foundColor)}.`,
      undoable: true,
    };
  }

  // 8. Darker / Lighter Adjustments
  if (/\b(darker|lighter|cooler|warmer|softer)\b/.test(input)) {
    const isDarker = /\bdarker|deeper\b/.test(input);
    mutateState(prev => {
      const curAccent = prev.accent || THEMES[prev.theme].acc;
      const newHex = isDarker ? mix(curAccent, '#000000', 0.82) : mix('#FFFFFF', curAccent, 0.82);
      return { accent: newHex };
    });
    return {
      text: `Adjusted accent luminance ${isDarker ? 'darker' : 'lighter'}.`,
      undoable: true,
    };
  }

  // 9. Brand Name & Tagline update
  const nameMatch = rawInput.match(/(?:called|name(?:d)?|brand)\s+['"]?([a-zA-Z0-9\s&]+?)['"]?(?:\s+(?:with|in|for|that|and)|$)/i);
  if (nameMatch) {
    const bName = nameMatch[1].trim().replace(/^(called|named|brand)\s+/i, '');
    mutateState(() => ({ name: bName }));
    return {
      text: `Brand name updated to "${bName}".`,
      undoable: true,
    };
  }

  // 10. Fallback disambiguation
  return {
    text: `Understood command "${rawInput}". Select an action below or specify a brand parameter:`,
    options: [
      { label: 'Set Accent Color', value: 'set accent to ' + (foundColor || '#276EF1'), icon: 'palette' },
      { label: 'Apply Swiss Theme', value: 'switch to swiss', icon: 'sliders' },
      { label: 'Apply Luxury Theme', value: 'switch to luxury', icon: 'gem' },
      { label: 'Find Slide Images', value: 'find images', icon: 'image' },
    ],
  };
}
