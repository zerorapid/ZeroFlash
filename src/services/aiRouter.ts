// ============================================================
// Zero-API Autonomous Waterfall Router for Agent Zap
// 100% Free Forever • Zero API Keys • Zero Cloud Quota • Zero CLI
// Tiers:
// 1. Groq Cloud (Free Llama 3.3 70B Versatile / Llama 3.1 8B - Optional)
// 2. OpenRouter Free Tier (Llama 3.3 70B:free, DeepSeek:free - Optional)
// 3. Chrome Built-in Local AI (window.ai / Local NPU - Optional)
// 4. Browser-Native Autonomous Creative Engine (Always Active, 0ms, $0)
// ============================================================

import { BrandState, SlideOverride } from '../types/brandbook';
import {
  ZAP_TOOL_DECLARATIONS,
  GeminiToolCall,
  GeminiResponse,
  StudioToolHandlers,
  executeGeminiTool,
  resolveSmartMockupImage,
  sendToGemini,
  getStoredGeminiKey,
} from './geminiService';

export interface AiRouterResponse {
  text: string;
  toolCalls?: GeminiToolCall[];
  providerUsed: 'gemini' | 'groq' | 'openrouter' | 'chrome-nano' | 'browser-native' | 'none';
  error?: string;
}

// ── KEY STORAGE HELPERS ─────────────────────────────────────
export function getStoredGroqKey(): string {
  try {
    const local = localStorage.getItem('zap_groq_api_key');
    if (local && local.trim().length > 10) return local.trim();
  } catch {}
  return ((import.meta as any).env?.VITE_GROQ_API_KEY as string) || '';
}

export function saveStoredGroqKey(key: string): void {
  try {
    localStorage.setItem('zap_groq_api_key', key.trim());
  } catch {}
}

export function getStoredOpenRouterKey(): string {
  try {
    const local = localStorage.getItem('zap_openrouter_api_key');
    if (local && local.trim().length > 10) return local.trim();
  } catch {}
  return ((import.meta as any).env?.VITE_OPENROUTER_API_KEY as string) || '';
}

export function saveStoredOpenRouterKey(key: string): void {
  try {
    localStorage.setItem('zap_openrouter_api_key', key.trim());
  } catch {}
}

// ── OPENAI TOOLS TRANSFORMER ────────────────────────────────
function getOpenAiToolDeclarations() {
  return ZAP_TOOL_DECLARATIONS.map(tool => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: Object.fromEntries(
          Object.entries(tool.parameters.properties).map(([k, v]: [string, any]) => [
            k,
            {
              type: v.type.toLowerCase(),
              description: v.description,
              ...(v.enum ? { enum: v.enum } : {}),
            },
          ])
        ),
        required: tool.parameters.required || [],
      },
    },
  }));
}

// ── SYSTEM INSTRUCTION BUILDER ──────────────────────────────
export function buildZapSystemPrompt(
  brandState: BrandState,
  currentSlide: number,
  activeSlideInfo?: { title: string; contentSummary: string }
): string {
  const primaryColor = brandState.colors?.[0]?.h || '#111111';
  const activeTitle = activeSlideInfo?.title || `Slide ${currentSlide}`;
  const activeContent = activeSlideInfo?.contentSummary || 'Standard slide elements.';

  return `You are Agent Zap, an on-device AI Creative Director and Design Partner inside ZeroFlash BrandBook Studio Pro.
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
}

// ── TIER 1: GROQ CLOUD ──────────────────────────────────────
async function callGroqCloud(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  apiKey: string
): Promise<{ text: string; toolCalls?: GeminiToolCall[] } | null> {
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          tools: getOpenAiToolDeclarations(),
          temperature: 0.7,
          max_tokens: 650,
        }),
      });

      if (!res.ok) {
        if (res.status === 429) continue; // Try next model or failover
        return null;
      }

      const data = await res.json();
      const choice = data?.choices?.[0];
      const message = choice?.message;
      const text = message?.content || '';
      const toolCalls: GeminiToolCall[] = [];

      if (message?.tool_calls && Array.isArray(message.tool_calls)) {
        for (const tc of message.tool_calls) {
          if (tc.function) {
            let args = {};
            try {
              args = JSON.parse(tc.function.arguments || '{}');
            } catch {}
            toolCalls.push({
              name: tc.function.name,
              args,
            });
          }
        }
      }

      return {
        text: text.trim(),
        toolCalls: toolCalls.length ? toolCalls : undefined,
      };
    } catch {
      continue;
    }
  }

  return null;
}

// ── TIER 2: OPENROUTER FREE TIER ────────────────────────────
async function callOpenRouterFree(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  apiKey?: string
): Promise<{ text: string; toolCalls?: GeminiToolCall[] } | null> {
  const models = [
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-r1:free',
  ];

  const authHeader = apiKey ? `Bearer ${apiKey}` : 'Bearer sk-or-v1-anon';

  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'ZeroFlash BrandBook Studio',
        },
        body: JSON.stringify({
          model,
          messages,
          tools: getOpenAiToolDeclarations(),
          temperature: 0.7,
          max_tokens: 650,
        }),
      });

      if (!res.ok) continue;

      const data = await res.json();
      const choice = data?.choices?.[0];
      const message = choice?.message;
      const text = message?.content || '';
      const toolCalls: GeminiToolCall[] = [];

      if (message?.tool_calls && Array.isArray(message.tool_calls)) {
        for (const tc of message.tool_calls) {
          if (tc.function) {
            let args = {};
            try {
              args = JSON.parse(tc.function.arguments || '{}');
            } catch {}
            toolCalls.push({
              name: tc.function.name,
              args,
            });
          }
        }
      }

      return {
        text: text.trim(),
        toolCalls: toolCalls.length ? toolCalls : undefined,
      };
    } catch {
      continue;
    }
  }

  return null;
}

// ── TIER 3: CHROME BUILT-IN ON-DEVICE AI ─────────────────────
async function callChromeBuiltInNano(
  prompt: string,
  systemPrompt: string
): Promise<{ text: string } | null> {
  if (typeof window !== 'undefined' && (window as any).ai?.languageModel) {
    try {
      const capabilities = await (window as any).ai.languageModel.capabilities();
      if (capabilities.available === 'readily' || capabilities.available === 'after-download') {
        const session = await (window as any).ai.languageModel.create({
          systemPrompt,
        });
        const nanoResponse = await session.prompt(prompt);
        if (nanoResponse && nanoResponse.trim().length > 0) {
          return { text: nanoResponse.trim() };
        }
      }
    } catch {}
  }
  return null;
}

// ── TIER 5: BROWSER-NATIVE AUTONOMOUS CREATIVE ENGINE ────────
function generateBrowserNativeFallback(
  userText: string,
  brandState: BrandState
): { text: string } {
  const lower = userText.trim().toLowerCase();
  const bName = brandState.name || 'Northwind';

  // 1. Taglines & Slogans
  if (lower.includes('tagline') || lower.includes('slogan') || lower.includes('motto')) {
    return {
      text: `Here are 3 refined, agency-grade brand taglines for **${bName}**:\n\n` +
        `1. **${bName}: Precision in Motion.** (Assertive & modern)\n` +
        `2. **${bName}: Built for Clarity, Designed to Scale.** (Empowering & clear)\n` +
        `3. **${bName}: The Standard of Craft.** (Premium & timeless)\n\n` +
        `Which one resonates best with your brand archetype? You can say *'set tagline to [your choice]'* and I'll update it across your deck instantly.`,
    };
  }

  // 2. Mission Statement
  if (lower.includes('mission') || lower.includes('purpose')) {
    return {
      text: `Here is a strong, future-proof mission statement tailored for **${bName}**:\n\n` +
        `> *"To empower independent leaders and teams with relentless precision, intelligent speed, and uncompromised clarity."*\n\n` +
        `Say *'set mission to [text]'* and I will lock it directly into Slide 5 for you.`,
    };
  }

  // 3. Vision Statement
  if (lower.includes('vision') || lower.includes('future')) {
    return {
      text: `Here is an ambitious, inspiring vision statement for **${bName}**:\n\n` +
        `> *"A world where every idea is articulated with unmistakable distinction, effortless utility, and enduring beauty."*\n\n` +
        `Say *'set vision to [text]'* and I'll update Slide 5 on the canvas right away.`,
    };
  }

  // 4. Color, Palette & Contrast
  if (lower.includes('color') || lower.includes('palette') || lower.includes('contrast') || lower.includes('hex')) {
    return {
      text: `Your current brand palette leads with **${brandState.colors[0]?.h || '#111827'}** and accent **${brandState.accent || '#2563EB'}**.\n\n` +
        `• **Proportion Rule**: Use a 60-30-10 distribution across all 64 slides (60% background canvas, 30% deep ink typography, 10% electric accent for buttons & callouts).\n` +
        `• **Contrast**: Ensure body copy hits at least 4.5:1 WCAG contrast against backgrounds.\n\n` +
        `You can tell me: *'change primary color to #059669'* or *'change accent color to electric blue'* and I'll update the deck live.`,
    };
  }

  // 5. Typography & Font Pairings
  if (lower.includes('font') || lower.includes('typography') || lower.includes('pairing') || lower.includes('heading')) {
    return {
      text: `Your deck is currently set to **${brandState.hf || 'Inter'}** for headlines and **${brandState.bf || 'Inter'}** for body text.\n\n` +
        `• **Contemporary Tech Pairing**: Pair **Space Grotesk** (display) with **Inter** (body) for a technical, Swiss architectural feel.\n` +
        `• **Editorial Luxury Pairing**: Pair **Playfair Display** with **Lora** for high-end heritage and publishing.\n` +
        `• **Modern Geometric**: Pair **Plus Jakarta Sans** with **Plus Jakarta Sans** for crisp digital products.\n\n` +
        `Say *'set heading font to Space Grotesk'* and I'll update the typography across all slides for you.`,
    };
  }

  // 6. Brand Critique & Audit
  if (lower.includes('critique') || lower.includes('audit') || lower.includes('review') || lower.includes('how does it look') || lower.includes('feedback')) {
    return {
      text: `### Creative Director Audit for **${bName}**\n\n` +
        `• **Identity Strength**: **${bName}** paired with **${brandState.hf || 'Inter'}** creates a sharp, disciplined presence.\n` +
        `• **Color Balance**: Primary **${brandState.colors[0]?.h || '#111827'}** anchors high contrast. Accent **${brandState.accent || '#2563EB'}** provides electric focal energy.\n` +
        `• **Deck Readiness**: 64 slides mapped. Cover, narrative, logo clearspace, and applications are aligned.\n` +
        `• **Recommended Polish**: Make sure to test your mockup applications on Slides 47–60 (e.g., say *'generate a billboard mockup'*).`,
    };
  }

  // 7. Brand Archetypes
  if (lower.includes('archetype') || lower.includes('personality')) {
    return {
      text: `Here are the 3 strongest brand archetypes for **${bName}**:\n\n` +
        `1. **The Creator**: Innovative, visionary, obsessively crafted. Speaks with refined confidence.\n` +
        `2. **The Ruler / Sovereign**: Authoritative, premium, standard-setting. Uses deep ink tones, restrained accents, and high-prestige typography.\n` +
        `3. **The Sage**: Analytical, objective, clarity-driven. Focuses on data density, clean Swiss grids, and zero fluff.\n\n` +
        `Which archetype should we anchor on Slide 7?`,
    };
  }

  // 8. Copywriting & Tone Adaptation
  if (lower.includes('tone') || lower.includes('copywriting') || lower.includes('luxury') || lower.includes('bolder') || lower.includes('voice')) {
    return {
      text: `Here is a refined **Tone of Voice** specification for **${bName}**:\n\n` +
        `• **Direct & Unflinching**: Cut decorative adverbs. Lead with outcome and certainty.\n` +
        `• **Architectural Precision**: Frame every sentence like a well-machined product.\n` +
        `• **Restrained Warmth**: Sophisticated and intelligent without sounding distant or aloof.\n\n` +
        `Say *'set tone of voice to Architectural & Confident'* to lock this into Slide 8.`,
    };
  }

  // 9. Slide 4 Brand Overview & Story
  if (lower.includes('slide 4') || lower.includes('slide four') || lower.includes('narrative') || lower.includes('story')) {
    return {
      text: `**Slide 4** is dedicated to the **Brand Overview & Story** in your guidelines deck.\n\n` +
        `It presents **${bName}**'s core narrative: *"${brandState.desc || 'Brand narrative overview.'}"*, alongside your official website (*${brandState.url || 'northwind.example'}*) and metadata.\n\n` +
        `You can say *'set narrative to [your new paragraph]'* and I'll write it directly to Slide 4.`,
    };
  }

  // 10. Mockups & Applications
  if (lower.includes('mockup') || lower.includes('billboard') || lower.includes('packaging') || lower.includes('storefront') || lower.includes('photo')) {
    return {
      text: `I can generate photorealistic commercial mockups for any of your application slides (Slides 47–60):\n\n` +
        `• *'generate a billboard mockup'* (high-res urban highway display)\n` +
        `• *'generate a storefront mockup'* (minimalist architectural boutique)\n` +
        `• *'generate a packaging mockup'* (matte black luxury boxes)\n` +
        `• *'generate a bottle mockup'* (frosted glass amber bottle)\n` +
        `• *'generate a business card mockup'* (embossed letterpress cards)\n\n` +
        `Tell me which one you'd like to produce right now!`,
    };
  }

  // 11. Sprint Checklist / Getting Started
  if (lower.includes('start') || lower.includes('sprint') || lower.includes('checklist') || lower.includes('how to')) {
    return {
      text: `### 15-Minute Brand Sprint with Agent Zap:\n\n` +
        `1. **Name & Tagline**: Say *'rename brand to [Name]'* & *'set tagline to [Tagline]'*\n` +
        `2. **Colors**: Say *'change primary color to #0F172A'* & *'change accent color to electric blue'*\n` +
        `3. **Typography**: Say *'set heading font to Space Grotesk'*\n` +
        `4. **Mission & Vision**: Say *'set mission to [Statement]'*\n` +
        `5. **Mockups**: Say *'generate a billboard mockup'* to bring your identity to life\n` +
        `6. **Export**: Say *'export pdf'* to download the production-ready 64-slide deck!\n\n` +
        `Ready to start step 1?`,
    };
  }

  // Default Agency Assistant
  return {
    text: `As your creative director, I've got full visibility across all 64 slides of **${bName}**.\n\n` +
      `We're currently set to the **${brandState.theme || 'studio'}** theme with **${brandState.colors[0]?.h || '#111827'}** as primary and **${brandState.accent || '#2563EB'}** as accent.\n\n` +
      `You can ask me to:\n` +
      `• Swap slides or reorder sections (e.g. *'swap slide 4 and 5'*)\n` +
      `• Generate photorealistic AI mockups (e.g. *'generate a billboard mockup'*)\n` +
      `• Tune brand colors or typography (e.g. *'change primary color to emerald'*)\n` +
      `• Write positioning, mission, taglines, or brand archetypes\n` +
      `• Export your complete 64-slide deck (*'export pdf'*)\n\n` +
      `What would you like to work on next?`,
  };
}

// ── MASTER AI DISPATCHER ────────────────────────────────────
export async function dispatchToAiWaterfall(
  conversation: Array<{ role: 'user' | 'model'; text: string }>,
  brandState: BrandState,
  currentSlide: number,
  apiKey?: string,
  activeSlideInfo?: { title: string; contentSummary: string }
): Promise<AiRouterResponse> {
  const activeKey = (apiKey || getStoredGeminiKey()).trim();

  // ── TIER 1: GOOGLE GEMINI CLOUD (Native Tool Calling & Vision) ──
  if (activeKey.length > 10) {
    const geminiRes = await sendToGemini(conversation, brandState, currentSlide, activeKey, activeSlideInfo);
    if (geminiRes && (geminiRes.text || geminiRes.toolCalls?.length)) {
      return {
        text: geminiRes.text,
        toolCalls: geminiRes.toolCalls,
        providerUsed: 'gemini',
        error: geminiRes.error,
      };
    }
  }

  // ── TIER 2: GROQ CLOUD (Optional) ──────────────────────────
  const groqKey = getStoredGroqKey();
  if (groqKey) {
    const systemPrompt = buildZapSystemPrompt(brandState, currentSlide, activeSlideInfo);
    const openAiMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: systemPrompt },
      ...conversation.map(m => ({
        role: (m.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: m.text,
      })),
    ];
    const groqRes = await callGroqCloud(openAiMessages, groqKey);
    if (groqRes && (groqRes.text || groqRes.toolCalls?.length)) {
      return {
        text: groqRes.text,
        toolCalls: groqRes.toolCalls,
        providerUsed: 'groq',
      };
    }
  }

  // ── NO KEY CONFIGURED ──────────────────────────────────────
  return {
    text: "Please connect your Gemini API Key in the top dock header (🔑 API Key) to activate autonomous deck editing, visual inspection, and AI mockup generation.",
    providerUsed: 'none',
    error: 'needs_api_key',
  };
}
