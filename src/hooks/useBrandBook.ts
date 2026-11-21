import { useState, useCallback, useRef, useEffect } from 'react';
import {
  BrandState,
  SlideOverride,
  ChatMessage,
  ColorItem,
  SavedBrandProject,
  StudioSettings,
  UserProfile,
} from '../types/brandbook';
import { DEFAULT_BRAND_STATE, THEMES } from '../data/brandbookData';
import { executeCommand } from '../utils/commandRegistry';
import { cleanSVG, extractSvgColors, svgURL } from '../utils/svgProcessor';
import { norm } from '../utils/colorUtils';

const CURATED_TEMPLATES: SavedBrandProject[] = [
  {
    id: 'tmpl_deeptech',
    name: 'Zerorapid Sovereign',
    tagline: "World's First Vibe Coding Agency for Deep Tech",
    updatedAt: Date.now(),
    isTemplate: true,
    category: 'DeepTech',
    state: {
      ...DEFAULT_BRAND_STATE,
      name: 'Zerorapid',
      tagline: 'Next Gen Design Power House',
      desc: "World's First Vibe Coding Agency for Modern Deep Tech Systems",
      url: 'zerorapid.in',
      email: 'hello@jayapalreddy.in',
      theme: 'studio',
      hf: 'Inter',
      bf: 'Inter',
      colors: [
        { n: 'Primary', h: '#000000', p: '' },
        { n: 'Secondary', h: '#FFFFFF', p: '' },
        { n: 'Accent', h: '#276EF1', p: '' },
        { n: 'Light Surface', h: '#F8F9FA', p: '' },
        { n: 'Dark Neutral', h: '#14161A', p: '' },
      ],
      accent: '#276EF1',
      mission: 'Turn ideas into live, high-craft digital products at the speed of thought.',
      vision: 'A future where anyone can build and ship production-ready software through pure creative direction.',
      values: 'High-Craft Aesthetics\nRapid AI Execution\nHuman-Centric Intuition',
      pers: 'Pioneering, Technical, Sovereign, Exacting',
      clear: '2x the winglet height on all four coordinates',
      minsize: '32px digital / 15mm physical hull engraving',
    },
    overrides: {},
  },
  {
    id: 'tmpl_swiss',
    name: 'Zurich Rationalist',
    tagline: 'Objective information architecture and typographic clarity',
    updatedAt: Date.now(),
    isTemplate: true,
    category: 'Swiss',
    state: {
      ...DEFAULT_BRAND_STATE,
      name: 'Helvetica Haus',
      tagline: 'Rational order for complex computational systems',
      desc: 'A pure international typographic design system rooted in mathematical grid proportions and strict asymmetric clarity.',
      url: 'helveticahaus.ch',
      email: 'post@helveticahaus.ch',
      theme: 'swiss',
      hf: 'Space Grotesk',
      bf: 'Inter',
      colors: [
        { n: 'Signal Ink', h: '#111318', p: '' },
        { n: 'Pure Canvas', h: '#FFFFFF', p: '' },
        { n: 'Scarlet Accent', h: '#E11D48', p: '' },
        { n: 'Warm Concrete', h: '#F5F5F4', p: '' },
        { n: 'Muted Slate', h: '#6B7280', p: '' },
      ],
      accent: '#E11D48',
      mission: 'Distill irreducible truth through objective typographic structure.',
      vision: 'Information clarity that transcends decorative ornamentation.',
      values: 'Mathematical Rigor\nHigh-Contrast Hierarchy\nPure Neutrality',
      pers: 'Rational, Exacting, Timeless, Structured',
    },
    overrides: {},
  },
  {
    id: 'tmpl_luxury',
    name: 'Maison Auric',
    tagline: 'Quiet luxury, archival craft and enduring heritage',
    updatedAt: Date.now(),
    isTemplate: true,
    category: 'Luxury',
    state: {
      ...DEFAULT_BRAND_STATE,
      name: 'Maison Auric',
      tagline: 'Archival permanence in the digital era',
      desc: 'An haute luxury house dedicated to tactile craft, bespoke architectural systems and quiet refinement.',
      url: 'maisonauric.com',
      email: 'concierge@maisonauric.com',
      theme: 'luxury',
      hf: 'Playfair Display',
      bf: 'Lora',
      colors: [
        { n: 'Onyx Noir', h: '#15120E', p: '' },
        { n: 'Raw Silk', h: '#FBFAF6', p: '' },
        { n: 'Imperial Bronze', h: '#B08D3E', p: '' },
        { n: 'Champagne Linen', h: '#F3F0E8', p: '' },
        { n: 'Warm Taupe', h: '#8D8370', p: '' },
      ],
      accent: '#B08D3E',
      mission: 'Elevate daily computational artifacts into enduring works of art.',
      vision: 'A world where beauty and bespoke craftsmanship outlast disposable trends.',
      values: 'Slow Precision\nMaterial Honesty\nSovereign Beauty',
      pers: 'Dignified, Poetic, Discerning, Singular',
    },
    overrides: {},
  },
  {
    id: 'tmpl_brutalist',
    name: 'KINETIC // 01',
    tagline: 'Raw uncompromised industrial execution',
    updatedAt: Date.now(),
    isTemplate: true,
    category: 'Brutalist',
    state: {
      ...DEFAULT_BRAND_STATE,
      name: 'KINETIC // 01',
      tagline: 'High-density terminal aesthetics for deep systems',
      desc: 'Zero-decoration, high-impact industrial interface guidelines designed for extreme developer clarity and execution speed.',
      url: 'kinetic01.tech',
      email: 'ops@kinetic01.tech',
      theme: 'brutalist',
      hf: 'Syne',
      bf: 'Space Grotesk',
      colors: [
        { n: 'Pure Void', h: '#0A0A0A', p: '' },
        { n: 'Stark Surface', h: '#FFFFFF', p: '' },
        { n: 'High-Vis Acid', h: '#10B981', p: '' },
        { n: 'Raw Concrete', h: '#F2F2F0', p: '' },
        { n: 'Terminal Grey', h: '#52525B', p: '' },
      ],
      accent: '#10B981',
      mission: 'Strip away superficial corporate marketing in favor of raw computational power.',
      vision: 'A transparent web built on unvarnished mechanics and stark utility.',
      values: 'Radical Honesty\nIndustrial Utility\nZero Ornamentation',
      pers: 'Provocative, Industrial, Relentless, Raw',
    },
    overrides: {},
  },
];

const DEFAULT_SETTINGS: StudioSettings = {
  agencyName: 'ZeroRapid Design Studio',
  agencyUrl: 'zerorapid.in',
  creditEnabled: true,
  colorSpace: 'sRGB',
  units: 'px',
  autoSaveEnabled: true,
};

const DEFAULT_USER: UserProfile = {
  id: 'usr_zerorapid',
  name: 'Jayapal Reddy',
  email: 'hello@jayapalreddy.in',
  avatar: '',
  tier: 'Studio Pro',
  organization: 'Zerorapid Studios',
  role: 'Founder & Design Lead',
  createdAt: '2026-01-15',
  notifications: {
    emailOnExport: true,
    emailOnWeeklyReport: false,
    soundEffects: true,
    slideChangeAlerts: true,
  },
  exportSettings: {
    includeAgencyFooter: true,
    agencyName: 'Zerorapid Studios',
    agencyWebsite: 'zerorapid.in',
    paperSize: 'a4',
    quality: 'print',
  },
  apiTokens: {
    mcpKey: 'zf_live_89b2a74c10e34f81',
  },
};

export function useBrandBook() {
  const [state, setState] = useState<BrandState>(DEFAULT_BRAND_STATE);
  const [overrides, setOverrides] = useState<Record<number, SlideOverride>>({});

  // History Stack
  const historyRef = useRef<{ S: BrandState; OV: Record<number, SlideOverride> }[]>([
    { S: DEFAULT_BRAND_STATE, OV: {} },
  ]);
  const historyIdxRef = useRef<number>(0);
  const [, setHistoryTick] = useState(0);

  // View state
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [activeElement, setActiveElement] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'one'>('all');
  const [guides, setGuides] = useState<boolean>(false);

  // Modal & Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isSvgExtractorOpen, setIsSvgExtractorOpen] = useState<boolean>(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [appView, setAppView] = useState<'studio' | 'settings'>('studio');
  const [settingsTab, setSettingsTab] = useState<'profile' | 'notifications' | 'projects' | 'export' | 'security'>('profile');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'signin' | 'signup'>('signin');
  const [detectedSvgColors, setDetectedSvgColors] = useState<{ hex: string; percentage: number }[]>([]);

  // Auth User State (Local-First / Sovereign)
  // When null, AuthGate is displayed so user must sign in or create account first
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('zeroflash_auth_user_v2');
      if (stored) return JSON.parse(stored);
    } catch {}
    return null;
  });

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('zeroflash_auth_user_v2', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('zeroflash_auth_user_v2');
      }
    } catch {}
  }, [currentUser]);

  const signIn = useCallback((email: string, name?: string, org?: string) => {
    const user: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: name || (email.split('@')[0].replace(/[._]/g, ' ') || 'Creator'),
      email: email,
      avatar: '',
      tier: 'Studio Pro',
      organization: org || 'Studio Agency',
      role: 'Creative Director',
      createdAt: new Date().toISOString().split('T')[0],
      notifications: {
        emailOnExport: true,
        emailOnWeeklyReport: false,
        soundEffects: true,
        slideChangeAlerts: true,
      },
      exportSettings: {
        includeAgencyFooter: true,
        agencyName: org || 'Studio Agency',
        agencyWebsite: 'zerorapid.in',
        paperSize: 'a4',
        quality: 'print',
      },
      apiTokens: {
        mcpKey: 'zf_live_' + Math.random().toString(36).substring(2, 14),
      },
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  }, []);

  const signInWithGoogle = useCallback(() => {
    setCurrentUser(DEFAULT_USER);
  }, []);

  const signUp = useCallback((name: string, email: string, org: string) => {
    signIn(email, name, org);
  }, [signIn]);

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setAppView('studio');
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const openAuthModal = useCallback((tab: 'signin' | 'signup' = 'signin') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const openSettingsModal = useCallback((tab: 'profile' | 'notifications' | 'projects' | 'export' | 'security' = 'profile') => {
    setSettingsTab(tab);
    setAppView('settings');
  }, []);

  // Local-First Projects & Templates state
  const [savedProjects, setSavedProjects] = useState<SavedBrandProject[]>(() => {
    try {
      const stored = localStorage.getItem('zeroflash_projects_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return CURATED_TEMPLATES;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>('tmpl_deeptech');

  // Studio Output Standards settings
  const [studioSettings, setStudioSettings] = useState<StudioSettings>(() => {
    try {
      const stored = localStorage.getItem('zeroflash_settings_v2');
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Save projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zeroflash_projects_v2', JSON.stringify(savedProjects));
    } catch {}
  }, [savedProjects]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('zeroflash_settings_v2', JSON.stringify(studioSettings));
    } catch {}
  }, [studioSettings]);

  // Agent Zap Chat stream
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Agent Zap online. Autonomous on-device design engine ready. I calibrate, balance, and re-architect your 64-slide guideline system locally with zero external latency.',
      options: [
        { label: 'Harmonize Premium Mood', value: 'make it feel premium', icon: 'gem' },
        { label: 'Switch to Brutalist', value: 'switch to brutalist', icon: 'zap' },
        { label: 'Set Electric Blue Accent', value: 'set accent to #276EF1', icon: 'palette' },
        { label: 'Audit WCAG Contrast', value: 'check contrast', icon: 'shield' },
        { label: 'Find Slide Assets', value: 'find images', icon: 'image' },
      ],
      timestamp: Date.now(),
    },
  ]);

  const pushHistory = useCallback((nextS: BrandState, nextOV: Record<number, SlideOverride>) => {
    let hist = historyRef.current.slice(0, historyIdxRef.current + 1);
    hist.push({ S: JSON.parse(JSON.stringify(nextS)), OV: JSON.parse(JSON.stringify(nextOV)) });
    if (hist.length > 50) hist.shift();
    historyRef.current = hist;
    historyIdxRef.current = hist.length - 1;
    setHistoryTick(t => t + 1);
  }, []);

  const updateState = useCallback((updater: (prev: BrandState) => Partial<BrandState>) => {
    setState(prev => {
      const delta = updater(prev);
      const next = { ...prev, ...delta };
      pushHistory(next, overrides);
      return next;
    });
  }, [overrides, pushHistory]);

  const updateOverrides = useCallback((updater: (prev: Record<number, SlideOverride>) => Record<number, SlideOverride>) => {
    setOverrides(prev => {
      const next = updater(prev);
      pushHistory(state, next);
      return next;
    });
  }, [state, pushHistory]);

  const undo = useCallback(() => {
    if (historyIdxRef.current > 0) {
      historyIdxRef.current--;
      const target = historyRef.current[historyIdxRef.current];
      setState(target.S);
      setOverrides(target.OV);
      setHistoryTick(t => t + 1);
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIdxRef.current < historyRef.current.length - 1) {
      historyIdxRef.current++;
      const target = historyRef.current[historyIdxRef.current];
      setState(target.S);
      setOverrides(target.OV);
      setHistoryTick(t => t + 1);
    }
  }, []);

  const canUndo = historyIdxRef.current > 0;
  const canRedo = historyIdxRef.current < historyRef.current.length - 1;

  // Assistant Send Message
  const sendAssistantMessage = useCallback((text: string) => {
    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, userMsg]);

    const ctx = {
      activeSlide,
      selectedElement: activeElement,
      state,
      overrides,
    };

    const res = executeCommand(
      text,
      ctx,
      updateState,
      updateOverrides,
      undo,
      redo,
      () => setIsImageModalOpen(true)
    );

    const botMsg: ChatMessage = {
      id: 'bot_' + Date.now(),
      sender: 'assistant',
      text: res.text,
      html: res.html,
      options: res.options,
      undoable: res.undoable,
      timestamp: Date.now(),
    };

    setChatMessages(prev => [...prev, botMsg]);
  }, [activeSlide, activeElement, state, overrides, updateState, updateOverrides, undo, redo]);

  // Handle Logo Upload and SVG Color Extraction
  const handleLogoUpload = useCallback((file: File) => {
    const isSvg = file.type.includes('svg') || file.name.endsWith('.svg');
    const reader = new FileReader();

    if (isSvg) {
      reader.onload = () => {
        const text = String(reader.result || '');
        const cleaned = cleanSVG(text);
        if (cleaned) {
          const url = svgURL(cleaned.txt);
          updateState(prev => ({
            logo: url,
            meta: {
              ...prev.meta,
              lg_primary: { kind: 'svg', name: file.name, w: cleaned.w, h: cleaned.h, bytes: file.size },
            },
          }));

          // Automatically extract colors from SVG
          const colors = extractSvgColors(cleaned.txt);
          if (colors.length > 0) {
            setDetectedSvgColors(colors);
            setIsSvgExtractorOpen(true);
          }
        }
      };
      reader.readAsText(file);
    } else {
      reader.onload = () => {
        const url = String(reader.result || '');
        updateState(prev => ({
          logo: url,
          meta: {
            ...prev.meta,
            lg_primary: { kind: 'raster', name: file.name, bytes: file.size },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  }, [updateState]);

  // Apply Detected SVG Palette directly to BrandState
  const applyDetectedPalette = useCallback((colorHexes: string[]) => {
    if (!colorHexes.length) return;
    const newColors: ColorItem[] = colorHexes.slice(0, 5).map((h, i) => ({
      n: i === 0 ? 'Brand Primary' : i === 1 ? 'Brand Secondary' : `Brand Accent ${i}`,
      h: norm(h),
      p: '',
    }));

    updateState(() => ({
      colors: newColors,
      accent: newColors[1] ? newColors[1].h : newColors[0].h,
    }));
    setIsSvgExtractorOpen(false);
  }, [updateState]);

  // Project & Template actions
  const saveCurrentAsProject = useCallback((name: string) => {
    const newProj: SavedBrandProject = {
      id: 'proj_' + Date.now(),
      name,
      tagline: state.tagline,
      updatedAt: Date.now(),
      state: JSON.parse(JSON.stringify(state)),
      overrides: JSON.parse(JSON.stringify(overrides)),
      isTemplate: false,
      category: 'Custom',
    };
    setSavedProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
  }, [state, overrides]);

  const loadProject = useCallback((project: SavedBrandProject) => {
    setState(JSON.parse(JSON.stringify(project.state)));
    setOverrides(JSON.parse(JSON.stringify(project.overrides || {})));
    setActiveProjectId(project.id);
    setActiveSlide(0);
    pushHistory(project.state, project.overrides || {});
  }, [pushHistory]);

  const deleteProject = useCallback((projectId: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
  }, []);

  const duplicateProject = useCallback((projectId: string) => {
    setSavedProjects(prev => {
      const target = prev.find(p => p.id === projectId);
      if (!target) return prev;
      const copy: SavedBrandProject = {
        ...JSON.parse(JSON.stringify(target)),
        id: 'proj_' + Date.now(),
        name: `${target.name} (Copy)`,
        updatedAt: Date.now(),
        isTemplate: false,
        category: 'Custom',
      };
      return [copy, ...prev];
    });
  }, []);

  const exportJson = useCallback(() => {
    const payload = {
      brand: state,
      overrides,
      exportedAt: new Date().toISOString(),
      generator: 'ZeroFlash v2.0',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brand-manifest.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state, overrides]);

  const importJson = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || '{}'));
        if (parsed.brand) {
          setState(prev => ({ ...prev, ...parsed.brand }));
          if (parsed.overrides) setOverrides(parsed.overrides);
          pushHistory(parsed.brand, parsed.overrides || {});
        } else if (parsed.name) {
          setState(prev => ({ ...prev, ...parsed }));
          pushHistory(parsed, overrides);
        }
      } catch (err) {
        console.error('Invalid JSON brand file:', err);
      }
    };
    reader.readAsText(file);
  }, [overrides, pushHistory]);

  const updateStudioSettings = useCallback((partial: Partial<StudioSettings>) => {
    setStudioSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const clearLocalStorage = useCallback(() => {
    try {
      localStorage.removeItem('zeroflash_projects_v2');
      localStorage.removeItem('zeroflash_settings_v2');
      setSavedProjects(CURATED_TEMPLATES);
      setStudioSettings(DEFAULT_SETTINGS);
      alert('Local sovereign cache cleared and reset to factory defaults.');
    } catch {}
  }, []);

  return {
    state,
    overrides,
    updateState,
    updateOverrides,
    activeSlide,
    setActiveSlide,
    activeElement,
    setActiveElement,
    viewMode,
    setViewMode,
    guides,
    setGuides,
    isAssistantOpen,
    setIsAssistantOpen,
    isImageModalOpen,
    setIsImageModalOpen,
    isSvgExtractorOpen,
    setIsSvgExtractorOpen,
    isProjectsOpen,
    setIsProjectsOpen,
    appView,
    setAppView,
    isSettingsOpen,
    setIsSettingsOpen,
    settingsTab,
    setSettingsTab,
    openSettingsModal,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalTab,
    openAuthModal,
    currentUser,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateProfile,
    savedProjects,
    activeProjectId,
    saveCurrentAsProject,
    loadProject,
    deleteProject,
    duplicateProject,
    exportJson,
    importJson,
    studioSettings,
    updateStudioSettings,
    clearLocalStorage,
    detectedSvgColors,
    chatMessages,
    sendAssistantMessage,
    handleLogoUpload,
    applyDetectedPalette,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
