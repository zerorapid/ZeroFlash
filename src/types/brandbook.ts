export interface ColorItem {
  n: string; // Color name (e.g. "Pitch Black")
  h: string; // Hex code (e.g. "#111827")
  p?: string; // Pantone or PMS code (e.g. "PMS 433 C")
}

export interface RuleItem {
  id: string;
  t: string;
}

export interface BrandMetaItem {
  kind: 'svg' | 'raster';
  name: string;
  w?: number;
  h?: number;
  bytes?: number;
}

export interface BrandState {
  name: string;
  tagline: string;
  desc: string;
  version: string;
  url: string;
  email: string;
  phone: string;
  address: string;
  handle: string;
  mission: string;
  vision: string;
  values: string;
  pers: string;
  voice: string;
  avoid: string;
  say: string;
  dont: string;
  cap: string;
  punc: string;
  nums: string;
  glossary: string;
  logo: string; // Data URL or URL
  coverLogoPos?: 'top-left' | 'center' | 'top-right' | 'split';
  clear: string;
  minsize: string;
  concept: string;
  conceptPts: string;
  spacing: string;
  ratioNote: string;
  photoRule: string;
  colors: ColorItem[];
  hf: string; // Headline font
  bf: string; // Body font
  img: Record<string, string>;
  meta: Record<string, BrandMetaItem>;
  credits: string[];
  clones: number[];
  off: Record<number, number>;
  theme: string;
  accent: string;
  pc: string; // Panel / card color override
  lc: string; // Line color override
  rad: string; // Radius (px)
  grain: string; // Grain (%)
  opener: string;
  cardS: string;
  folio: string;
  frame: string;
  treat: string; // 'none' | 'mono' | 'duotone' | 'warm'
  marks: boolean;
  grid: boolean;
  phi: boolean;
  hc: string;
  icons: string;
  isw: string;
  icc: string;
  iconLib: string;
  iconNote: string;
  imgp: string;
  patNote: string;
  mcName: string;
  mcStory: string;
  mcTraits: string;
  mcDo: string;
  mcDont: string;
  uUrls: string;
  photoCredit: string;
  wm: string;
  wmo: string;
  copy: string;
  dlabel: string;
  paper: string;
  prodNote: string;
  versions: string;
  hw: string;
  upper: string;
  pn: string;
  credit: string;
  tone: [number, number, number, number];
  dos: RuleItem[];
  donts: RuleItem[];
}

export interface ElementPos {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  s?: number; // font size delta
  a?: 'left' | 'center' | 'right';
  hid?: boolean;
}

export interface SlideOverride {
  bg?: string;
  deleted?: boolean;
  logoVariant?: string;
  logoScale?: number;
  logoInvert?: 'yes' | 'no';
  customTexts?: Record<string, string>;
  pos?: Record<number, ElementPos>;
}

export interface SlideItem {
  k: 'r' | 't' | 'i' | 'p' | 'ic' | 'cg';
  x: number;
  y: number;
  w: number;
  h: number;
  // Specific properties
  t?: string;
  id?: string;
  fill?: string;
  op?: number;
  line?: string;
  dash?: number | boolean;
  ell?: number | boolean;
  rd?: number;
  f?: 'h' | 'b';
  s?: number;
  b?: number;
  c?: string;
  a?: 'left' | 'center' | 'right';
  rot?: number;
  inv?: boolean;
  key?: string;
  label?: string;
  m?: 'cover' | 'contain';
  bgc?: string;
  tc?: string;
  fb?: boolean | number;
  tr?: number | boolean;
  name?: string;
  hid?: boolean;
}

export interface SlideDefinition {
  title: string;
  bg: string;
  f: number;
  items: SlideItem[];
  oi: number;
  hidden?: boolean;
  cloned?: boolean;
}

export interface ThemeConfig {
  n: string;
  bg: string;
  card: string;
  line: string;
  ink: string;
  mut: string;
  acc: string;
  rad: number;
  rule: number;
  opener: string;
  cardS: string;
  folio: string;
  frame: string;
  grain: number;
}

export interface ChatOption {
  label: string;
  value: string;
  dot?: string;
  icon?: 'gem' | 'zap' | 'palette' | 'image' | 'shield' | 'sliders' | 'type' | 'refresh' | 'check';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  html?: string;
  options?: ChatOption[];
  timestamp: number;
  isAction?: boolean;
  undoable?: boolean;
}

export interface SavedBrandProject {
  id: string;
  name: string;
  tagline: string;
  updatedAt: number;
  state: BrandState;
  overrides: Record<number, SlideOverride>;
  isTemplate?: boolean;
  category?: 'Custom' | 'DeepTech' | 'Swiss' | 'Luxury' | 'Brutalist';
}

export interface StudioSettings {
  agencyName: string;
  agencyUrl: string;
  creditEnabled: boolean;
  colorSpace: 'sRGB' | 'CMYK-FOGRA39' | 'Display-P3';
  units: 'px' | 'mm' | 'in';
  autoSaveEnabled: boolean;
}

export interface UserNotificationSettings {
  emailOnExport: boolean;
  emailOnWeeklyReport: boolean;
  soundEffects: boolean;
  slideChangeAlerts: boolean;
}

export interface UserExportSettings {
  includeAgencyFooter: boolean;
  agencyName: string;
  agencyWebsite: string;
  paperSize: 'a4' | 'letter';
  quality: 'web' | 'print';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  tier: 'Studio Pro' | 'Enterprise' | 'Free Creator';
  organization: string;
  role: string;
  createdAt: string;
  notifications?: UserNotificationSettings;
  exportSettings?: UserExportSettings;
  apiTokens?: {
    mcpKey: string;
    webhookUrl?: string;
  };
}

