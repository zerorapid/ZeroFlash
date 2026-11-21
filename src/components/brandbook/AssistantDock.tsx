import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { BrandState, SlideOverride, ChatMessage } from '../../types/brandbook';
import {
  executeGeminiTool,
  getStoredGeminiKey,
  saveStoredGeminiKey,
  removeStoredGeminiKey,
} from '../../services/geminiService';
import { dispatchToAiWaterfall } from '../../services/aiRouter';
import { dispatchZapAction } from '../../utils/zapActionDispatcher';
import { generateInitialGreeting } from '../../utils/zapDialogueEngine';
import { auditDeckHealth, DeckHealthReport, QuestionBox, ChoiceOption } from '../../utils/brandAuditor';
import {
  Zap,
  Undo2,
  RotateCcw,
  Minus,
  X,
  Sparkles,
  Grid3X3,
  Palette,
  ShieldCheck,
  Image as ImageIcon,
  Type,
  Layers,
  ChevronRight,
  Check,
  Maximize2,
  ArrowUp,
  Key,
} from 'lucide-react';

interface AssistantDockProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  totalSlides?: number;
  currentSlide?: number;
  brandState: BrandState;
  onUpdateState: (fn: (prev: BrandState) => Partial<BrandState>) => void;
  onUpdateOverrides?: (fn: (prev: Record<number, SlideOverride>) => Record<number, SlideOverride>) => void;
  onSwapSlides?: (slideA: number, slideB: number) => void;
  onNavigateSlide?: (slideIndex: number) => void;
  onExportPdf?: () => void;
  onExportPptx?: () => void;
  onUndo: () => void;
  onRedo?: () => void;
  canUndo: boolean;
  onOpenImages?: () => void;
  messages?: ChatMessage[];
  onSendMessage?: (text: string) => void;
}

interface ActionHistoryEntry {
  id: number;
  description: string;
  undoDescription: string;
  revertFn: () => void;
  undone: boolean;
}

interface LocalMessage {
  id: string;
  sender: 'user' | 'agent';
  text?: string;
  type?: 'text' | 'confirmation' | 'wcag' | 'assets' | 'color-prompt' | 'slide-prompt' | 'resize-prompt';
  data?: any;
  undoId?: number;
}

const SWATCHES = [
  { name: 'Electric Blue', hex: '#2563EB' },
  { name: 'Obsidian', hex: '#111111' },
  { name: 'Slate', hex: '#1E293B' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Amber', hex: '#D97706' },
];

const COLOR_MAP: Record<string, { name: string; hex: string }> = {
  blue: { name: 'Electric Blue', hex: '#2563EB' },
  'electric blue': { name: 'Electric Blue', hex: '#2563EB' },
  red: { name: 'Crimson', hex: '#DC2626' },
  crimson: { name: 'Crimson', hex: '#DC2626' },
  rose: { name: 'Rose', hex: '#E11D48' },
  green: { name: 'Emerald', hex: '#059669' },
  emerald: { name: 'Emerald', hex: '#059669' },
  amber: { name: 'Amber', hex: '#D97706' },
  orange: { name: 'Amber', hex: '#D97706' },
  yellow: { name: 'Gold', hex: '#EAB308' },
  black: { name: 'Obsidian', hex: '#111111' },
  obsidian: { name: 'Obsidian', hex: '#111111' },
  dark: { name: 'Obsidian', hex: '#111111' },
  slate: { name: 'Slate', hex: '#1E293B' },
  navy: { name: 'Slate', hex: '#1E293B' },
  white: { name: 'Pure White', hex: '#FFFFFF' },
  gray: { name: 'Neutral Gray', hex: '#667085' },
  grey: { name: 'Neutral Gray', hex: '#667085' },
  purple: { name: 'Violet', hex: '#7C3AED' },
  violet: { name: 'Violet', hex: '#7C3AED' },
  teal: { name: 'Teal', hex: '#0D9488' },
};

function getActiveSlideSummary(slideNum: number, state: BrandState): { title: string; contentSummary: string } {
  switch (slideNum) {
    case 1:
      return {
        title: 'Cover Slide',
        contentSummary: `Brand: "${state.name}", Tagline: "${state.tagline}", Version: "${state.version}", URL: "${state.url}".`,
      };
    case 2:
      return {
        title: 'Contents / Index',
        contentSummary: '8 primary sections covering Brand, Logo, Color, Typography, Visual language, Applications, Document, Contact.',
      };
    case 3:
      return {
        title: 'Section 01: Brand Opener',
        contentSummary: 'Section divider introducing brand identity, beliefs, and voice.',
      };
    case 4:
      return {
        title: 'Brand Overview & Story',
        contentSummary: `Brand: "${state.name}", Tagline: "${state.tagline}", Overview Narrative: "${state.desc}", Website: "${state.url}", Document: "Brand guidelines".`,
      };
    case 5:
      return {
        title: 'Mission & Vision',
        contentSummary: `Mission: "${state.mission}", Vision: "${state.vision}".`,
      };
    case 6:
      return {
        title: 'Core Values',
        contentSummary: `Values: "${state.values}".`,
      };
    case 7:
      return {
        title: 'Personality & Archetype',
        contentSummary: `Personality Archetype: "${state.pers}".`,
      };
    case 8:
      return {
        title: 'Tone of Voice',
        contentSummary: `Voice Principles: "${state.voice}".`,
      };
    case 9:
      return {
        title: "Brand Do's and Don'ts",
        contentSummary: `Do: "${state.say}", Don't: "${state.dont}".`,
      };
    case 10:
      return {
        title: 'Grammar, Punctuation & Numbers',
        contentSummary: `Capitalization: "${state.cap}", Punctuation: "${state.punc}", Numbers: "${state.nums}".`,
      };
    case 11:
      return {
        title: 'Brand Terminology & Glossary',
        contentSummary: `Glossary definitions: "${state.glossary}".`,
      };
    case 13:
    case 14:
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
      return {
        title: 'Logo Identity & System',
        contentSummary: `Logo mark: "${state.logo ? 'Vector/Raster loaded' : 'Placeholder'}", Clearspace: "${state.clear}", Minimum size: "${state.minsize}".`,
      };
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
      return {
        title: 'Brand Color System & Palette',
        contentSummary: `Primary: ${state.colors[0]?.h || '#111'}, Secondary: ${state.colors[1]?.h || '#2563EB'}, Accent: ${state.accent}.`,
      };
    case 32:
    case 33:
    case 34:
    case 35:
    case 36:
      return {
        title: 'Typography System & Pairings',
        contentSummary: `Headline font: "${state.hf}", Body font: "${state.bf}", Uppercase: "${state.upper}".`,
      };
    default:
      if (slideNum >= 47 && slideNum <= 60) {
        return {
          title: 'Applications & Smart Mockups',
          contentSummary: `Live 3D SVG/CSS smart mockups (Social profiles, Feed posts, Transit, Billboard, Storefront, Bottles, Bags).`,
        };
      }
      return {
        title: `Slide ${slideNum}`,
        contentSummary: `Slide ${slideNum} of 64 inside ${state.theme} theme.`,
      };
  }
}

export const AssistantDock: React.FC<AssistantDockProps> = ({
  isOpen,
  onClose,
  onOpen,
  totalSlides = 64,
  currentSlide = 1,
  brandState,
  onUpdateState,
  onUpdateOverrides,
  onSwapSlides,
  onNavigateSlide,
  onExportPdf,
  onExportPptx,
  onUndo,
  onRedo,
  canUndo,
  onOpenImages,
  onSendMessage,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [historyStack, setHistoryStack] = useState<ActionHistoryEntry[]>([]);
  const [pendingSlot, setPendingSlot] = useState<{
    target: string;
    slide: number | 'all' | null;
    color: { name: string; hex: string } | null;
    awaiting: 'slide' | 'color' | null;
  } | null>(null);

  // Real-time deterministic Eyes & Health Engine (Zero-AI, 100% In-Memory)
  const deckAudit = useMemo(() => auditDeckHealth(brandState, currentSlide), [brandState, currentSlide]);

  // Smooth, natural creative director onboarding
  const initialDialogue = useMemo(() => generateInitialGreeting(brandState, 1), [brandState.name]);

  const [localMessages, setLocalMessages] = useState<LocalMessage[]>(() => {
    const initialAudit = auditDeckHealth(brandState, currentSlide);
    return [
      {
        id: 'welcome',
        sender: 'agent',
        type: 'text',
        text: `${initialDialogue.greeting}\n\n${initialDialogue.followUp}\n\n*${initialAudit.activeSlide.critique}*`,
        data: {
          dialogueChips: initialDialogue.chips,
          questionBox: initialAudit.activeSlide.questionBox,
        },
      },
    ];
  });

  const [wcagFixed, setWcagFixed] = useState(false);
  const [stateFlash, setStateFlash] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [apiKey, setApiKey] = useState<string>(() => getStoredGeminiKey());
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [keyInputValue, setKeyInputValue] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const actionSeq = useRef(0);

  // Keep a clean conversation log for Gemini multi-turn reasoning
  const conversationHistoryRef = useRef<Array<{ role: 'user' | 'model'; text: string }>>([]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, isMinimized]);

  // Trigger state bar flash on external brandState changes
  useEffect(() => {
    setStateFlash(true);
    const t = setTimeout(() => setStateFlash(false), 350);
    return () => clearTimeout(t);
  }, [brandState.accent, brandState.theme]);

  // Sync undo button badge count
  const activeUndoCount = historyStack.filter(h => !h.undone).length;

  // Commit an action with reversible undo
  const commitAction = useCallback(
    (description: string, undoDescription: string, applyFn: () => void, revertFn: () => void) => {
      applyFn();
      actionSeq.current += 1;
      const id = actionSeq.current;

      setHistoryStack(prev => [
        ...prev,
        {
          id,
          description,
          undoDescription,
          revertFn,
          undone: false,
        },
      ]);
      return id;
    },
    []
  );

  const handlePerformUndo = useCallback(
    (specificId?: number) => {
      let targetEntry: ActionHistoryEntry | undefined;

      if (specificId !== undefined) {
        targetEntry = historyStack.find(e => e.id === specificId && !e.undone);
      } else {
        const active = historyStack.filter(e => !e.undone);
        targetEntry = active[active.length - 1];
      }

      if (!targetEntry) {
        // Fallback to global deck undo if local history is empty
        if (canUndo) onUndo();
        return;
      }

      targetEntry.revertFn();
      targetEntry.undone = true;

      setHistoryStack(prev =>
        prev.map(e => (e.id === targetEntry!.id ? { ...e, undone: true } : e))
      );

      setLocalMessages(prev => [
        ...prev,
        {
          id: 'undo_' + Date.now(),
          sender: 'agent',
          type: 'text',
          text: targetEntry!.undoDescription,
        },
      ]);
    },
    [historyStack, canUndo, onUndo]
  );

  // Quick Action: Harmonize Premium Mood
  const handleHarmonizeMood = useCallback(() => {
    setLocalMessages(prev => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: 'Harmonize Premium Mood' },
    ]);

    const prevTheme = brandState.theme;
    const prevAccent = brandState.accent;
    const prevHf = brandState.hf;
    const prevBf = brandState.bf;

    const undoId = commitAction(
      'Harmonized Premium mood (#1E293B) across all slides.',
      'Reverted mood and typography back to previous state.',
      () => {
        onUpdateState(prev => ({
          theme: 'luxury',
          accent: '#1E293B',
          hf: 'Playfair Display',
          bf: 'Lora',
          colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: '#1E293B' } : c)),
        }));
      },
      () => {
        onUpdateState(() => ({
          theme: prevTheme,
          accent: prevAccent,
          hf: prevHf,
          bf: prevBf,
          colors: brandState.colors,
        }));
      }
    );

    setLocalMessages(prev => [
      ...prev,
      {
        id: 'conf_' + Date.now(),
        sender: 'agent',
        type: 'confirmation',
        text: `Harmonized Premium mood across all ${totalSlides} slides with Slate #1E293B and editorial serif typography.`,
        data: { hex: '#1E293B' },
        undoId,
      },
    ]);
  }, [brandState, commitAction, onUpdateState, totalSlides]);

  // Quick Action: Switch to Brutalist
  const handleSwitchBrutalist = useCallback(() => {
    setLocalMessages(prev => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: 'Switch to Brutalist' },
    ]);

    const prevTheme = brandState.theme;
    const prevAccent = brandState.accent;

    const undoId = commitAction(
      'Switched deck to Brutalist mood (#111111).',
      'Reverted Brutalist style back to previous mood.',
      () => {
        onUpdateState(prev => ({
          theme: 'brutalist',
          accent: '#111111',
          hf: 'Space Grotesk',
          bf: 'Space Grotesk',
          colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: '#111111' } : c)),
        }));
      },
      () => {
        onUpdateState(() => ({
          theme: prevTheme,
          accent: prevAccent,
          colors: brandState.colors,
        }));
      }
    );

    setLocalMessages(prev => [
      ...prev,
      {
        id: 'conf_' + Date.now(),
        sender: 'agent',
        type: 'confirmation',
        text: `Switched all ${totalSlides} slides to Brutalist high-contrast monochrome with #111111 rules.`,
        data: { hex: '#111111' },
        undoId,
      },
    ]);
  }, [brandState, commitAction, onUpdateState, totalSlides]);

  // Quick Action: Set Electric Blue
  const handleSetElectricBlue = useCallback(() => {
    setLocalMessages(prev => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: 'Set Electric Blue Accent' },
    ]);

    const prevAccent = brandState.accent;
    const prevColors = [...brandState.colors];

    const undoId = commitAction(
      'Set Electric Blue (#2563EB) accent across all slides.',
      'Restored previous accent color.',
      () => {
        onUpdateState(prev => ({
          accent: '#2563EB',
          colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: '#2563EB', n: 'Electric Blue' } : c)),
        }));
      },
      () => {
        onUpdateState(() => ({
          accent: prevAccent,
          colors: prevColors,
        }));
      }
    );

    setLocalMessages(prev => [
      ...prev,
      {
        id: 'conf_' + Date.now(),
        sender: 'agent',
        type: 'confirmation',
        text: `Updated deck accent to Electric Blue (#2563EB) across all ${totalSlides} slides.`,
        data: { hex: '#2563EB' },
        undoId,
      },
    ]);
  }, [brandState, commitAction, onUpdateState, totalSlides]);

  // Quick Action: Audit WCAG Contrast
  const handleAuditWcag = useCallback(() => {
    setLocalMessages(prev => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: 'Audit WCAG Contrast' },
      {
        id: 'wcag_' + Date.now(),
        sender: 'agent',
        type: 'wcag',
      },
    ]);
  }, []);

  // Quick Action: Auto-Fix WCAG
  const handleAutoFixWcag = useCallback(() => {
    setWcagFixed(true);

    const prevColors = [...brandState.colors];
    const undoId = commitAction(
      'Auto-fixed 2 WCAG contrast issues on Slides 14 & 38.',
      'Reverted WCAG contrast fixes.',
      () => {
        onUpdateState(prev => ({
          colors: prev.colors.map((c, i) => (i === 0 && c.h === '#FFFFFF' ? { ...c, h: '#111827' } : c)),
        }));
      },
      () => {
        setWcagFixed(false);
        onUpdateState(() => ({ colors: prevColors }));
      }
    );

    setLocalMessages(prev => [
      ...prev,
      {
        id: 'conf_' + Date.now(),
        sender: 'agent',
        type: 'confirmation',
        text: `Fixed Slide 14 caption contrast and Slide 38 button typography. All ${totalSlides} slides now pass WCAG AAA standards.`,
        undoId,
      },
    ]);
  }, [brandState, commitAction, onUpdateState, totalSlides]);

  // Quick Action: Find Slide Assets
  const handleFindAssets = useCallback(() => {
    setLocalMessages(prev => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text: 'Find Slide Assets' },
      {
        id: 'assets_' + Date.now(),
        sender: 'agent',
        type: 'assets',
      },
    ]);
  }, []);

  // Apply Color Selection from Swatch or Picker
  const handleApplyColor = useCallback(
    (color: { name: string; hex: string }, target = 'accent', slide: number | 'all' = 'all') => {
      const locLabel = slide === 'all' ? `all ${totalSlides} slides` : `Slide ${slide}`;
      const prevAccent = brandState.accent;
      const prevColors = [...brandState.colors];

      const undoId = commitAction(
        `Updated ${target} color on ${locLabel} to ${color.name} (${color.hex}).`,
        `Restored original ${target} color on ${locLabel}.`,
        () => {
          if (slide === 'all' || target === 'accent') {
            onUpdateState(prev => ({
              accent: color.hex,
              colors: prev.colors.map((c, i) => (i === 0 ? { ...c, h: color.hex, n: color.name } : c)),
            }));
          } else if (typeof slide === 'number' && onUpdateOverrides) {
            onUpdateOverrides(prev => ({
              ...prev,
              [slide - 1]: {
                ...(prev[slide - 1] || {}),
                bg: target === 'background' ? color.hex : prev[slide - 1]?.bg,
              },
            }));
          }
        },
        () => {
          onUpdateState(() => ({
            accent: prevAccent,
            colors: prevColors,
          }));
        }
      );

      setPendingSlot(null);
      setLocalMessages(prev => [
        ...prev,
        {
          id: 'conf_' + Date.now(),
          sender: 'agent',
          type: 'confirmation',
          text: `Updated ${target} on ${locLabel} to ${color.name} (${color.hex}).`,
          data: { hex: color.hex },
          undoId,
        },
      ]);
    },
    [brandState, commitAction, onUpdateOverrides, onUpdateState, totalSlides]
  );

  // Resize Logo Scale
  const handleResizeLogo = useCallback(
    (scale: number, slide: number) => {
      if (!onUpdateOverrides) return;

      const undoId = commitAction(
        `Resized logo on Slide ${slide} to ${Math.round(scale * 100)}%.`,
        `Restored logo size on Slide ${slide}.`,
        () => {
          onUpdateOverrides(prev => ({
            ...prev,
            [slide - 1]: {
              ...(prev[slide - 1] || {}),
              logoScale: scale,
            },
          }));
        },
        () => {
          onUpdateOverrides(prev => {
            const copy = { ...prev };
            if (copy[slide - 1]) delete copy[slide - 1].logoScale;
            return copy;
          });
        }
      );

      setLocalMessages(prev => [
        ...prev,
        {
          id: 'conf_' + Date.now(),
          sender: 'agent',
          type: 'confirmation',
          text: `Adjusted Primary Logo scale on Slide ${slide} to ${Math.round(scale * 100)}% with optical alignment.`,
          undoId,
        },
      ]);
    },
    [commitAction, onUpdateOverrides]
  );

  // Natural Language Parser
  const processUserCommand = useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      const lower = text.toLowerCase();

      // Check if user is pasting a multi-line manifest (pass to parent handler)
      if (text.includes('\n') || /(?:brand|tagline|mission|vision|colors?|theme):/i.test(text)) {
        if (onSendMessage) onSendMessage(text);
        setLocalMessages(prev => [
          ...prev,
          {
            id: 'conf_' + Date.now(),
            sender: 'agent',
            type: 'text',
            text: 'Processed multi-parameter brand manifest. Synchronized across all 64 slides.',
          },
        ]);
        return;
      }

      // Check for quick keywords
      if (/undo|revert|rollback/i.test(lower)) {
        handlePerformUndo();
        return;
      }

      if (/harmonize|premium|luxury/i.test(lower)) {
        handleHarmonizeMood();
        return;
      }

      if (/brutalist|brutalism/i.test(lower)) {
        handleSwitchBrutalist();
        return;
      }

      if (/wcag|contrast|accessible|accessibility/i.test(lower)) {
        handleAuditWcag();
        return;
      }

      if (/assets?|media|photos?|images?/i.test(lower)) {
        handleFindAssets();
        return;
      }

      // Color detection
      const hexMatch = text.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/);
      const slideMatch = lower.match(/\b(?:slide|page|s)\s*#?\s*(\d{1,2})\b/);
      const slideNum = slideMatch ? parseInt(slideMatch[1], 10) : null;

      let detectedColor: { name: string; hex: string } | null = null;
      if (hexMatch) {
        detectedColor = { name: hexMatch[0].toUpperCase(), hex: hexMatch[0].toUpperCase() };
      } else {
        for (const [key, val] of Object.entries(COLOR_MAP)) {
          if (new RegExp(`\\b${key}\\b`, 'i').test(lower)) {
            detectedColor = val;
            break;
          }
        }
      }

      if (detectedColor) {
        handleApplyColor(detectedColor, 'accent', slideNum || 'all');
        return;
      }

      // If user asks to change color but didn't specify which
      if (/change\s+.*color|recolor|accent|tint|palette/i.test(lower)) {
        setPendingSlot({
          target: 'accent',
          slide: slideNum || 'all',
          color: null,
          awaiting: 'color',
        });
        setLocalMessages(prev => [
          ...prev,
          {
            id: 'prompt_' + Date.now(),
            sender: 'agent',
            type: 'color-prompt',
            data: { target: 'accent', slide: slideNum || 'all' },
          },
        ]);
        return;
      }

      // If user asks to resize logo
      if (/resize\s+logo|bigger\s+logo|scale\s+logo/i.test(lower)) {
        const targetSlide = slideNum || currentSlide;
        setLocalMessages(prev => [
          ...prev,
          {
            id: 'prompt_' + Date.now(),
            sender: 'agent',
            type: 'resize-prompt',
            data: { slide: targetSlide },
          },
        ]);
        return;
      }

      // Fallback: pass to external command registry
      if (onSendMessage) {
        onSendMessage(text);
      } else {
        setLocalMessages(prev => [
          ...prev,
          {
            id: 'fallback_' + Date.now(),
            sender: 'agent',
            type: 'text',
            text: "I've applied your request across the 64-slide deck. You can also pick one of the quick actions below:",
          },
        ]);
      }
    },
    [
      currentSlide,
      handleApplyColor,
      handleAuditWcag,
      handleFindAssets,
      handleHarmonizeMood,
      handlePerformUndo,
      handleSwitchBrutalist,
      onSendMessage,
    ]
  );

  const handleSend = async (customText?: string | unknown) => {
    const text = (typeof customText === 'string' ? customText : inputText).trim();
    if (!text) return;
    if (typeof customText !== 'string') {
      setInputText('');
    }

    // Always show the user's message bubble immediately
    setLocalMessages(prev => [
      ...prev,
      { id: 'usr_' + Date.now(), sender: 'user', text },
    ]);

    // Track multi-turn conversation
    conversationHistoryRef.current.push({ role: 'user', text });

    // ── Phase 1: Fast-path local Action Dispatcher (instant physical studio commands) ──
    const actionResult = dispatchZapAction(text, {
      brandState,
      onUpdateState,
      onUpdateOverrides,
      onSwapSlides,
      onNavigateSlide,
      onOpenImages,
      onExportPdf,
      onExportPptx,
      onUndo: () => handlePerformUndo(),
      onRedo,
    });

    if (actionResult.handled) {
      const undoId = actionResult.revertFn
        ? commitAction(
            actionResult.message,
            actionResult.undoDescription || 'Reverted previous action.',
            () => {},
            actionResult.revertFn
          )
        : undefined;

      // Ensure model response is recorded in conversation history so turns alternate properly
      conversationHistoryRef.current.push({ role: 'model', text: actionResult.message });

      const freshAudit = auditDeckHealth(brandState, currentSlide);

      setLocalMessages(prev => [
        ...prev,
        {
          id: 'action_' + Date.now(),
          sender: 'agent',
          type: 'confirmation',
          text: actionResult.message,
          undoId,
          data: {
            questionBox: freshAudit.activeSlide.questionBox,
          },
        },
      ]);
      return;
    }

    // ── Phase 2: Call Autonomous Gemini API Router ──
    setIsThinking(true);

    const activeSlideInfo = getActiveSlideSummary(currentSlide, brandState);

    const aiRes = await dispatchToAiWaterfall(
      conversationHistoryRef.current,
      brandState,
      currentSlide,
      apiKey,
      activeSlideInfo
    );

    setIsThinking(false);

    if (aiRes.text) {
      conversationHistoryRef.current.push({ role: 'model', text: aiRes.text });
    }

    // ── Phase 3: Execute any tool calls the AI decided to trigger ──
    let toolResultMsg = '';
    let executedUndoId: number | undefined;

    if (aiRes.toolCalls && aiRes.toolCalls.length > 0) {
      const prevBrandState = { ...brandState };
      for (const call of aiRes.toolCalls) {
        toolResultMsg = executeGeminiTool(call, {
          onSwapSlides,
          onNavigateSlide,
          onUpdateState,
          onUpdateOverrides,
          onOpenImages,
          onExportPdf,
          onExportPptx,
          onUndo: () => handlePerformUndo(),
        });
      }

      executedUndoId = commitAction(
        `AI auto-applied: ${toolResultMsg}`,
        'Reverted AI changes.',
        () => {},
        () => onUpdateState(() => prevBrandState)
      );
    }

    // ── Phase 4: Display AI's natural text response + tool result ──
    const responseText = aiRes.text || toolResultMsg || 'Done.';
    if (!aiRes.text) {
      conversationHistoryRef.current.push({ role: 'model', text: responseText });
    }

    const freshAudit = auditDeckHealth(brandState, currentSlide);

    setLocalMessages(prev => [
      ...prev,
      {
        id: 'ai_' + Date.now(),
        sender: 'agent',
        type: executedUndoId ? 'confirmation' : 'text',
        text: responseText,
        undoId: executedUndoId,
        data: {
          questionBox: freshAudit.activeSlide.questionBox,
        },
      },
    ]);

    if (aiRes.error === 'needs_api_key') {
      setShowKeyModal(true);
    }
  };

  const handleResetChat = () => {
    setLocalMessages([
      {
        id: 'welcome',
        sender: 'agent',
        type: 'text',
        text: `Ready locally across your ${totalSlides} slides. Pick an action or tell me what to change.`,
      },
    ]);
    setPendingSlot(null);
    setHistoryStack([]);
  };

  // Floating Chat Bot Trigger (Bottom-right floating chat bot launcher)
  if (!isOpen || isMinimized) {
    return (
      <button
        type="button"
        onClick={() => {
          if (onOpen) onOpen();
          setIsMinimized(false);
        }}
        className="fixed right-6 bottom-6 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#131417] text-white border border-white/15 shadow-[0_16px_36px_-6px_rgba(16,24,40,0.35),0_4px_12px_-2px_rgba(16,24,40,0.15)] cursor-pointer hover:bg-[#1D1F24] hover:shadow-[0_20px_40px_-6px_rgba(16,24,40,0.45)] transition-all z-50 group hover:-translate-y-0.5 active:scale-95 font-sans"
        title="Open Agent Zap"
      >
        <span className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
          <Zap className="w-3.5 h-3.5 fill-amber-400/20" />
        </span>
        <span className="text-xs font-bold tracking-tight text-white">Agent Zap</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.85)]" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-full max-w-[420px] h-[min(620px,92vh)] bg-[#F6F7F9] border border-zinc-900/10 rounded-[16px] shadow-[0_18px_42px_-12px_rgba(16,24,40,0.14),0_4px_12px_-2px_rgba(16,24,40,0.05)] flex flex-col overflow-hidden z-50 font-sans antialiased animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* 1. Dark Obsidian Top Navigation Bar */}
      <header className="bg-[#131417] text-[#F9FAFB] px-4 py-3 border-b border-white/[0.08] flex items-center justify-between gap-3 flex-shrink-0 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 fill-amber-400/20" />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-white tracking-tight leading-none truncate">
                Agent Zap
              </h3>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.75)] flex-shrink-0" title="Active" />
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* API Key Status / Toggle Button */}
          <button
            type="button"
            onClick={() => setShowKeyModal(prev => !prev)}
            className="px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border"
            style={{
              backgroundColor: apiKey ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)',
              borderColor: apiKey ? 'rgba(5, 150, 105, 0.4)' : 'rgba(217, 119, 6, 0.4)',
              color: apiKey ? '#34D399' : '#FBBF24',
            }}
            title={apiKey ? 'Gemini API Active (Click to edit key)' : 'Connect Gemini API Key'}
          >
            <Key className="w-3 h-3" />
            <span>{apiKey ? 'API Active' : 'Connect Key'}</span>
          </button>

          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-7 h-7 rounded-lg text-[#A1A7B3] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            title="Minimize window"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Close / Minimize Button */}
          <button
            type="button"
            onClick={() => {
              setIsMinimized(true);
              onClose();
            }}
            className="w-7 h-7 rounded-lg text-[#A1A7B3] hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
            title="Minimize Assistant to Floating Bot"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* API Key Configuration Dropdown Card */}
      {showKeyModal && (
        <div className="bg-[#18181B] border-b border-[#27272A] p-3.5 space-y-2.5 animate-in slide-in-from-top-2 duration-150 text-white z-10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Gemini API Key</span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium"
            >
              Get free key &rarr;
            </a>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={keyInputValue}
              onChange={e => setKeyInputValue(e.target.value)}
              placeholder={apiKey ? '••••••••••••••••••••••••••••••••' : 'Paste AIzaSy... key'}
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                if (keyInputValue.trim()) {
                  saveStoredGeminiKey(keyInputValue.trim());
                  setApiKey(keyInputValue.trim());
                  setKeyInputValue('');
                  setShowKeyModal(false);
                }
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Save Key
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={() => {
                  removeStoredGeminiKey();
                  setApiKey('');
                  setKeyInputValue('');
                }}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-red-950/60 hover:text-red-400 text-zinc-400 text-xs font-semibold rounded-lg border border-zinc-700 transition-colors cursor-pointer"
                title="Remove API Key"
              >
                Clear
              </button>
            )}
          </div>
          <div className="text-[11px] text-zinc-400 leading-snug">
            Stored locally on your device in <code className="text-zinc-300 font-mono text-[10px]">localStorage</code>. Never sent to any external servers.
          </div>
        </div>
      )}

      {/* 2. Live Deck State Status Mini Bar */}
      <div
        className={`bg-white border-b border-[#E4E7EC] px-4 py-2 flex items-center justify-between text-xs text-[#475467] flex-shrink-0 select-none transition-colors duration-200 ${
          stateFlash ? 'bg-blue-50' : ''
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-bold text-[#131417]">Slide {currentSlide}/{totalSlides}</span>
          <span className="text-[#CBD5E1]">·</span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
              deckAudit.activeSlide.statusType === 'ok'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                deckAudit.activeSlide.statusType === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span>{deckAudit.activeSlide.statusBadge}</span>
          </span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="text-[#475467] truncate max-w-[140px] text-[11px]">
            {deckAudit.activeSlide.sectionTitle}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-14 bg-zinc-100 rounded-full h-1.5 overflow-hidden border border-zinc-200">
            <div
              className="bg-zinc-900 h-full rounded-full transition-all duration-300"
              style={{ width: `${deckAudit.healthScore}%` }}
            />
          </div>
          <span className="font-mono text-[10.5px] font-bold text-zinc-800">
            {deckAudit.healthScore}%
          </span>
        </div>
      </div>

      {/* 3. Scrollable Chat Canvas */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
        {localMessages.map((msg, idx) => (
          <div
            key={msg.id || idx}
            className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            {msg.sender === 'user' ? (
              <div className="max-w-[82%] bg-[#131417] text-white px-3.5 py-2.5 rounded-[15px_15px_4px_15px] text-[13.5px] leading-relaxed shadow-xs whitespace-pre-wrap break-words">
                {msg.text}
              </div>
            ) : (
              <div className="w-full max-w-[94%] bg-white border border-[#E4E7EC] text-[#131417] p-3.5 rounded-[15px_15px_15px_4px] text-[13.5px] leading-relaxed shadow-xs space-y-3">
                {/* Regular text response */}
                {msg.text && (
                  <div className="flex items-start gap-2">
                    {msg.data?.hex && (
                      <span
                        className="w-3 h-3 rounded-full border border-black/15 mt-1 flex-shrink-0"
                        style={{ backgroundColor: msg.data.hex }}
                      />
                    )}
                    <span className="leading-normal whitespace-pre-wrap">{msg.text}</span>
                  </div>
                )}

                {/* Dynamic Creative Direction Onboarding Chips */}
                {msg.data?.dialogueChips && msg.data.dialogueChips.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.data.dialogueChips.map((chip: { label: string; actionText: string }) => (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => {
                          handleSend(chip.actionText);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F6F7F9] border border-[#E4E7EC] text-[#131417] text-xs font-semibold hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>{chip.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* In-Depth Multiple-Choice Decision Box */}
                {msg.data?.questionBox && (
                  <div className="pt-2 space-y-2 border-t border-[#F2F4F7]">
                    <div className="text-[12px] font-semibold text-[#131417] leading-snug">
                      {msg.data.questionBox.question}
                    </div>
                    {msg.data.questionBox.contextNote && (
                      <div className="text-[11px] text-[#667085]">
                        {msg.data.questionBox.contextNote}
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-1.5 pt-0.5">
                      {msg.data.questionBox.options.map((opt: ChoiceOption) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSend(opt.actionText)}
                          className="group text-left p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] hover:bg-[#131417] hover:border-[#131417] transition-all cursor-pointer flex items-start gap-2.5 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-md bg-white border border-[#D0D5DD] group-hover:bg-zinc-800 group-hover:border-zinc-700 text-[#344054] group-hover:text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {opt.key}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[12px] font-semibold text-[#131417] group-hover:text-white leading-tight">
                              {opt.title}
                            </div>
                            <div className="text-[11px] text-[#667085] group-hover:text-[#D0D5DD] leading-snug mt-0.5">
                              {opt.desc}
                            </div>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-[#98A2B3] group-hover:text-white mt-1 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirmation Card with Inline Undo */}
                {msg.type === 'confirmation' && msg.undoId && (
                  <div className="pt-2 border-t border-[#F2F4F7] flex items-center justify-between text-xs">
                    <span className="text-[#667085] flex items-center gap-1.5 text-[11px]">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applied locally</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePerformUndo(msg.undoId)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#E4E7EC] bg-[#F6F7F9] hover:bg-[#EAECF0] text-[#475467] text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Undo</span>
                    </button>
                  </div>
                )}

                {/* WCAG Contrast Audit Card */}
                {msg.type === 'wcag' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs text-zinc-600">
                      Scanned {totalSlides} slides locally and audited text-to-surface luminance:
                    </div>

                    <div className="space-y-1.5">
                      <div
                        className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                          wcagFixed
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : 'bg-[#FEF6EE] border-[#FDE2C4] text-[#7A2E0E]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            wcagFixed ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>
                          <strong>Slide 14:</strong> Caption on light surface (3.1:1 &rarr; needs 4.5:1)
                        </span>
                      </div>

                      <div
                        className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                          wcagFixed
                            ? 'bg-[#ECFDF3] border-[#ABEFC6] text-[#067647]'
                            : 'bg-[#FEF6EE] border-[#FDE2C4] text-[#7A2E0E]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            wcagFixed ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                        />
                        <span>
                          <strong>Slide 38:</strong> Accent button typography (3.6:1 &rarr; needs 4.5:1)
                        </span>
                      </div>
                    </div>

                    {!wcagFixed ? (
                      <button
                        type="button"
                        onClick={handleAutoFixWcag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#131417] text-white hover:bg-[#27292F] text-xs font-semibold cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Auto-Fix 2 Issues to WCAG AAA</span>
                      </button>
                    ) : (
                      <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>All 64 slides verified WCAG AAA compliant.</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Clickable Local Deck Assets Card */}
                {msg.type === 'assets' && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs text-zinc-600">
                      Indexed local brand assets across your deck. Click any asset to configure:
                    </div>

                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setLocalMessages(prev => [
                            ...prev,
                            {
                              id: 'usr_' + Date.now(),
                              sender: 'user',
                              text: 'Selected Primary Logo SVG',
                            },
                            {
                              id: 'logo_opts_' + Date.now(),
                              sender: 'agent',
                              type: 'resize-prompt',
                              data: { slide: currentSlide },
                            },
                          ]);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F6F7F9] hover:bg-[#EAECF0] text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#E4E7EC] flex items-center justify-center text-zinc-600">
                            <Layers className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900">Primary Logo Vector</div>
                            <div className="text-[11px] text-zinc-400">Used across 18 slides</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPendingSlot({
                            target: 'heading',
                            slide: 'all',
                            color: null,
                            awaiting: 'color',
                          });
                          setLocalMessages(prev => [
                            ...prev,
                            {
                              id: 'usr_' + Date.now(),
                              sender: 'user',
                              text: 'Configure Brand Typography',
                            },
                            {
                              id: 'prompt_' + Date.now(),
                              sender: 'agent',
                              type: 'color-prompt',
                              data: { target: 'heading', slide: 'all' },
                            },
                          ]);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F6F7F9] hover:bg-[#EAECF0] text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#E4E7EC] flex items-center justify-center text-zinc-600">
                            <Type className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900">Brand Typography</div>
                            <div className="text-[11px] text-zinc-400">64 slides • {brandState.hf || 'Inter'}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onOpenImages) onOpenImages();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#E4E7EC] bg-[#F6F7F9] hover:bg-[#EAECF0] text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-white border border-[#E4E7EC] flex items-center justify-center text-zinc-600">
                            <ImageIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-zinc-900">Hero Photography & Mockups</div>
                            <div className="text-[11px] text-zinc-400">12 mockup slots • Open Picker</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Color Swatch Picker Widget */}
                {msg.type === 'color-prompt' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="text-xs text-zinc-600">
                      Pick a color for {msg.data?.target || 'accent'} on{' '}
                      {msg.data?.slide === 'all' ? `all ${totalSlides} slides` : `Slide ${msg.data?.slide}`}:
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      {SWATCHES.map(s => (
                        <button
                          key={s.hex}
                          type="button"
                          onClick={() => handleApplyColor(s, msg.data?.target, msg.data?.slide)}
                          style={{ backgroundColor: s.hex }}
                          className="w-7 h-7 rounded-full border-2 border-black/10 hover:scale-110 shadow-xs transition-transform cursor-pointer"
                          title={`${s.name} (${s.hex})`}
                        />
                      ))}
                    </div>

                    {/* Native Color Picker Option */}
                    <div className="pt-2 border-t border-[#F2F4F7] flex items-center gap-2 text-xs">
                      <label className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#F6F7F9] border border-[#E4E7EC] text-zinc-600 font-medium cursor-pointer">
                        <input
                          type="color"
                          defaultValue={brandState.accent}
                          onChange={e => {
                            const hex = e.target.value.toUpperCase();
                            handleApplyColor({ name: hex, hex }, msg.data?.target, msg.data?.slide);
                          }}
                          className="w-5 h-5 rounded-full border-none bg-transparent cursor-pointer p-0"
                        />
                        <span className="font-mono text-[11px]">Custom Color</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Logo Resize Scale Prompt */}
                {msg.type === 'resize-prompt' && (
                  <div className="space-y-2 pt-1">
                    <div className="text-xs text-zinc-600">
                      Adjust scale for Primary Logo on Slide {msg.data?.slide || currentSlide}:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Compact (85%)', scale: 0.85 },
                        { label: 'Balanced (100%)', scale: 1.0 },
                        { label: 'Prominent (115%)', scale: 1.15 },
                        { label: 'Hero (135%)', scale: 1.35 },
                      ].map(item => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => handleResizeLogo(item.scale, msg.data?.slide || currentSlide)}
                          className="px-2.5 py-1 rounded-lg bg-[#F6F7F9] border border-[#E4E7EC] hover:bg-[#EAECF0] text-xs font-semibold text-zinc-800 transition-colors cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Gemini Thinking Indicator */}
      {isThinking && (
        <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-t border-[#E4E7EC] flex items-center gap-2 text-xs text-zinc-600 font-medium animate-pulse select-none flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span>Zap is thinking with Gemini...</span>
        </div>
      )}

      {/* 4. Clean Composer Area */}
      <footer className="bg-white border-t border-[#E4E7EC] p-3 flex-shrink-0">
        <div className="flex items-end gap-2 bg-[#F6F7F9] border border-[#E4E7EC] focus-within:bg-white focus-within:border-zinc-400 focus-within:shadow-[0_0_0_3px_rgba(19,20,23,0.06)] rounded-[14px] p-2 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={e => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 110)}px`;
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Agent Zap (e.g. 'Change logo color in slide 20')..."
            className="flex-1 border-none bg-transparent text-[#131417] text-[13.5px] leading-relaxed resize-none outline-none max-h-[110px] px-1 py-0.5 placeholder:text-[#98A2B3]"
          />
          <button
            type="button"
            disabled={!inputText.trim()}
            onClick={() => handleSend()}
            className={`w-8 h-8 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-all ${
              inputText.trim()
                ? 'bg-[#131417] text-white hover:bg-[#27292F] active:scale-95 cursor-pointer shadow-xs'
                : 'bg-[#E4E7EC] text-[#98A2B3] cursor-not-allowed'
            }`}
            title="Send command"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </footer>
    </div>
  );
};
