import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BrandState,
  SlideDefinition,
  UserProfile,
  SavedBrandProject,
} from '../../types/brandbook';
import {
  INDUSTRY,
  ARCH,
  THEMES,
  FONTS,
  TONES,
} from '../../data/brandbookData';
import {
  Compass,
  Target,
  Hexagon,
  Palette,
  Type,
  SlidersHorizontal,
  Layers,
  Upload,
  Check,
  Settings,
  ArrowLeft,
  User,
  Bell,
  Package,
  FileDown,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { norm } from '../../utils/colorUtils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Slider } from '../ui/slider';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

interface SidebarProps {
  brandState: BrandState;
  updateState: (updater: (prev: BrandState) => Partial<BrandState>) => void;
  slides: SlideDefinition[];
  activeSlide: number;
  setActiveSlide: (index: number) => void;
  onLogoUpload: (file: File) => void;
  appView?: 'studio' | 'settings';
  setAppView?: (view: 'studio' | 'settings') => void;
  settingsTab?: 'profile' | 'notifications' | 'projects' | 'export' | 'security';
  setSettingsTab?: (tab: 'profile' | 'notifications' | 'projects' | 'export' | 'security') => void;
  currentUser?: UserProfile | null;
  savedProjects?: SavedBrandProject[];
  onSignOut?: () => void;
}

const SETTINGS_NAV_ITEMS = [
  {
    id: 'profile' as const,
    label: 'Account Profile',
    icon: User,
    desc: 'Name, email & agency role',
  },
  {
    id: 'notifications' as const,
    label: 'Notifications',
    icon: Bell,
    desc: 'Export alerts & sound effects',
  },
  {
    id: 'projects' as const,
    label: 'My Brand Projects',
    icon: Package,
    desc: 'Saved client decks & backups',
  },
  {
    id: 'export' as const,
    label: 'Export Preferences',
    icon: FileDown,
    desc: 'PDF sizing & agency footers',
  },
  {
    id: 'security' as const,
    label: 'Security & Data',
    icon: ShieldCheck,
    desc: 'Local cache & workspace reset',
  },
];

const NAVIGATION_ITEMS = [
  {
    id: 'Basics',
    label: 'Basics',
    icon: Compass,
    title: 'Brand Foundation',
    desc: 'Core identity, metadata & industry presets',
  },
  {
    id: 'Brand',
    label: 'Brand',
    icon: Target,
    title: 'Voice & Strategy',
    desc: 'Mission, vision, principles & tone calibration',
  },
  {
    id: 'Logo',
    label: 'Logo',
    icon: Hexagon,
    title: 'Vector Mark System',
    desc: 'SVG upload, clearspace & size constraints',
  },
  {
    id: 'Colors',
    label: 'Colors',
    icon: Palette,
    title: 'Color Harmonies',
    desc: '5-slot palette, OKLCH & WCAG contrast audit',
  },
  {
    id: 'Type',
    label: 'Type',
    icon: Type,
    title: 'Typography Hierarchy',
    desc: 'Display headline & body interface typefaces',
  },
  {
    id: 'Style',
    label: 'Style',
    icon: SlidersHorizontal,
    title: 'Visual Aesthetics',
    desc: 'Themes, border radius & paper texture grain',
  },
  {
    id: 'Slides',
    label: 'Slides',
    icon: Layers,
    title: 'Slide Directory',
    desc: 'Overview of all 64 compiled guideline slides',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  brandState,
  updateState,
  slides,
  activeSlide,
  setActiveSlide,
  onLogoUpload,
  appView = 'studio',
  setAppView,
  settingsTab = 'profile',
  setSettingsTab,
  currentUser,
  savedProjects = [],
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState('Basics');
  const S = brandState;
  const currentNav = NAVIGATION_ITEMS.find(n => n.id === activeTab) || NAVIGATION_ITEMS[0];

  return (
    <aside className="flex gap-2.5 h-full flex-shrink-0 select-none z-20">
      <Tabs
        value={activeTab}
        onValueChange={val => {
          setActiveTab(val);
          if (setAppView) setAppView('studio');
        }}
        orientation="vertical"
        className="flex gap-2.5 w-full h-full min-h-0"
      >
        {/* CONTAINER 1: Dark Activity Rail (64px) */}
        <div className="w-16 h-full rounded-2xl bg-[#1C1D21] border border-zinc-800 text-white shadow-xs flex flex-col items-center pt-3 pb-3 z-10 flex-shrink-0">
          {/* Vertical Icon Navigation Rail with Spring Physics */}
          <div className="flex flex-col gap-1 w-full px-1.5">
            {NAVIGATION_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = appView === 'studio' && activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-zap-action={
                    item.id === 'Color' || item.id === 'Brand'
                      ? 'color-picker'
                      : item.id === 'Typography'
                      ? 'font-change'
                      : item.id === 'Logo'
                      ? 'logo-upload'
                      : undefined
                  }
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setAppView) setAppView('studio');
                  }}
                  className={`relative w-full h-12 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer select-none ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                  title={item.title}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRailPill"
                      className="absolute inset-0 rounded-xl bg-zinc-800 border border-zinc-700/80 shadow-xs z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                    <Icon className="w-4 h-4 stroke-[1.8]" />
                    <span className="text-[10px] font-semibold tracking-tight leading-none">
                      {item.label}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Settings Button (Replaced v2.0 as requested) */}
          <div className="mt-auto w-full px-1.5 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={() => {
                if (setAppView) {
                  setAppView(appView === 'settings' ? 'studio' : 'settings');
                }
              }}
              className={`relative w-full h-12 flex flex-col items-center justify-center rounded-xl transition-colors cursor-pointer select-none ${
                appView === 'settings' ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
              title="Studio & Account Settings"
            >
              {appView === 'settings' && (
                <motion.div
                  layoutId="activeRailPill"
                  className="absolute inset-0 rounded-xl bg-zinc-800 border border-zinc-700/80 shadow-xs z-0"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex flex-col items-center justify-center gap-1">
                <Settings className="w-4 h-4 stroke-[1.8]" />
                <span className="text-[10px] font-semibold tracking-tight leading-none">
                  Settings
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* CONTAINER 2: Properties Inspector Panel (340px) */}
        <div className="w-[340px] h-full rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-2 duration-150">
            {appView === 'settings' ? (
              /* SETTINGS MENU WITH OPTIONS (Replaces Brand Foundation inspector in Settings Mode) */
              <div className="flex flex-col h-full bg-white">
                {/* Header */}
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between flex-shrink-0 bg-white">
                  <div>
                    <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider leading-none">
                      Studio Settings
                    </h2>
                    <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                      Account, notifications & preferences
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAppView && setAppView('studio')}
                    className="h-7 text-xs text-zinc-600 hover:text-zinc-900 gap-1 px-2 rounded-lg"
                    title="Return to Brand Guidelines"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Studio</span>
                  </Button>
                </div>

                {/* Settings Navigation Items */}
                <ScrollArea className="flex-1 px-3 py-3">
                  <div className="space-y-1">
                    {SETTINGS_NAV_ITEMS.map(item => {
                      const Icon = item.icon;
                      const isActive = settingsTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSettingsTab && setSettingsTab(item.id)}
                          className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-zinc-900 text-white shadow-xs font-semibold'
                              : 'hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                          <div className="min-w-0">
                            <div className="text-xs font-medium leading-tight">{item.label}</div>
                            <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-zinc-400' : 'text-zinc-400'}`}>
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Return to Brand Guidelines Card */}
                  <div className="mt-4 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <div className="text-xs font-bold text-zinc-900">Brand Guideline Slides</div>
                    <p className="text-[10px] text-zinc-500 mt-0.5">
                      Ready to resume editing your deck? Switch back to the 64-slide system anytime.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAppView && setAppView('studio')}
                      className="w-full mt-2.5 h-8 text-xs font-semibold gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Brand Guidelines</span>
                    </Button>
                  </div>
                </ScrollArea>

                {/* User Status Bar at bottom of menu */}
                {currentUser && (
                  <div className="p-3 border-t border-zinc-100 bg-zinc-50/70 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JR'}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 truncate leading-tight">{currentUser.name}</div>
                        <div className="text-[10px] text-zinc-500 font-mono leading-tight">{currentUser.tier}</div>
                      </div>
                    </div>
                    {onSignOut && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onSignOut}
                        className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2"
                        title="Sign Out"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Section Header */}
                <div className="p-4 border-b border-zinc-100 flex items-center justify-between flex-shrink-0 bg-white">
              <div>
                <h2 className="text-xs font-bold text-zinc-950 uppercase tracking-wider leading-none">
                  {currentNav.title}
                </h2>
                <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">
                  {currentNav.desc}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                {activeTab === 'Colors' && (
                  <Badge variant="success" className="font-mono text-[10px]">WCAG AAA</Badge>
                )}
                {activeTab === 'Slides' && (
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {slides.length} slides
                  </Badge>
                )}
              </div>
            </div>

          {/* Tab Content Panels with ScrollArea */}
          <ScrollArea className="flex-1 px-4 py-4">
            {/* TAB 1: BASICS */}
            <TabsContent value="Basics" className="space-y-4 m-0">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Industry Preset
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.keys(INDUSTRY).map(indKey => (
                    <Button
                      key={indKey}
                      variant="outline"
                      size="sm"
                      className="capitalize text-xs h-7 hover:border-zinc-900 transition-all"
                      onClick={() => {
                        const p = INDUSTRY[indKey];
                        updateState(() => ({
                          tagline: p.tagline,
                          desc: p.desc,
                          mission: p.mission,
                          vision: p.vision,
                          values: p.values,
                          pers: p.pers,
                          hf: p.hf,
                          bf: p.bf,
                          theme: p.theme,
                          colors: p.colors.map((c: any) => ({ n: c[0], h: c[1], p: c[2] })),
                        }));
                      }}
                    >
                      {indKey}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Brand Archetype
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.keys(ARCH).map(archKey => (
                    <Button
                      key={archKey}
                      variant="outline"
                      size="sm"
                      className="capitalize text-xs h-7 hover:border-zinc-900 transition-all"
                      onClick={() => {
                        const a = ARCH[archKey];
                        updateState(() => ({
                          voice: a.voice,
                          say: a.say,
                          dont: a.dont,
                          tone: [...a.tone] as [number, number, number, number],
                        }));
                      }}
                    >
                      {archKey}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">
                    Brand Name
                  </label>
                  <Input
                    value={S.name}
                    onChange={e => updateState(() => ({ name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">
                    Tagline
                  </label>
                  <Input
                    value={S.tagline}
                    onChange={e => updateState(() => ({ tagline: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-zinc-700 block mb-1">
                    Overview Narrative
                  </label>
                  <Textarea
                    rows={3}
                    value={S.desc}
                    onChange={e => updateState(() => ({ desc: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">
                      Website
                    </label>
                    <Input
                      value={S.url}
                      onChange={e => updateState(() => ({ url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-700 block mb-1">
                      Email
                    </label>
                    <Input
                      value={S.email}
                      onChange={e => updateState(() => ({ email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: BRAND */}
            <TabsContent value="Brand" className="space-y-4 m-0">
              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Mission Statement
                </label>
                <Textarea
                  rows={2}
                  value={S.mission}
                  onChange={e => updateState(() => ({ mission: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Vision Statement
                </label>
                <Textarea
                  rows={2}
                  value={S.vision}
                  onChange={e => updateState(() => ({ vision: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Brand Values (4 principles)
                </label>
                <Textarea
                  rows={4}
                  value={S.values}
                  className="font-mono text-[11px]"
                  onChange={e => updateState(() => ({ values: e.target.value }))}
                />
              </div>

              <Separator className="my-2" />

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Tone of Voice Calibration
                </label>
                {TONES.map((pair, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-zinc-700">
                      <span>{pair[0]}</span>
                      <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">
                        {S.tone[i]}%
                      </Badge>
                      <span>{pair[1]}</span>
                    </div>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[S.tone[i]]}
                      onValueChange={val => {
                        const next = [...S.tone] as [number, number, number, number];
                        next[i] = val[0];
                        updateState(() => ({ tone: next }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: LOGO */}
            <TabsContent value="Logo" className="space-y-4 m-0">
              <div>
                <label className="text-xs font-semibold text-zinc-900 block mb-1">
                  Primary Brand Mark
                </label>
                <p className="text-[11px] text-zinc-500 mb-2">
                  Upload an SVG logo to enable automatic color extraction &amp; vector rendering.
                </p>

                <Card className="bg-zinc-50/70 border-zinc-200">
                  <CardContent className="p-4 flex flex-col items-center justify-center gap-3">
                    <div className="w-24 h-24 rounded-xl border border-zinc-200 bg-white p-2.5 flex items-center justify-center shadow-xs">
                      <img src={S.logo} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                    </div>

                    <label className="cursor-pointer">
                      <Button variant="default" size="sm" asChild>
                        <span>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload SVG / PNG</span>
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept=".svg,.png,.jpg,.jpeg,.webp"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            onLogoUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </CardContent>
                </Card>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                  Cover Slide Logo Placement
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'top-left', label: 'Top Left' },
                    { id: 'center', label: 'Centered Hero' },
                    { id: 'top-right', label: 'Top Right' },
                    { id: 'split', label: 'Split Frame' },
                  ].map(opt => {
                    const isSel = (S.coverLogoPos || 'top-left') === opt.id;
                    return (
                      <Button
                        key={opt.id}
                        type="button"
                        variant={isSel ? 'default' : 'outline'}
                        size="sm"
                        className="h-8 text-xs font-medium"
                        onClick={() => updateState(() => ({ coverLogoPos: opt.id as any }))}
                      >
                        {opt.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Clearspace Protected Rule
                </label>
                <Textarea
                  rows={2}
                  value={S.clear}
                  onChange={e => updateState(() => ({ clear: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Minimum Digital / Print Size
                </label>
                <Input
                  value={S.minsize}
                  onChange={e => updateState(() => ({ minsize: e.target.value }))}
                />
              </div>
            </TabsContent>

            {/* TAB 4: COLORS */}
            <TabsContent value="Colors" className="space-y-4 m-0">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-900">
                  Core Brand Palette (5 Harmonies)
                </label>
                <Badge variant="success">WCAG AAA</Badge>
              </div>

              <div className="space-y-2">
                {S.colors.map((c, i) => (
                  <Card key={i} className="hover:border-zinc-300 transition-colors shadow-2xs">
                    <CardContent className="p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={norm(c.h)}
                          onChange={e => {
                            const newCols = [...S.colors];
                            newCols[i] = { ...newCols[i], h: norm(e.target.value) };
                            updateState(() => ({ colors: newCols }));
                          }}
                          className="w-7 h-7 rounded-lg border border-zinc-200 cursor-pointer p-0 overflow-hidden shadow-2xs"
                        />
                        <div>
                          <Input
                            value={c.n}
                            className="h-6 px-1.5 py-0 text-xs font-bold border-none shadow-none focus-visible:ring-0"
                            onChange={e => {
                              const newCols = [...S.colors];
                              newCols[i] = { ...newCols[i], n: e.target.value };
                              updateState(() => ({ colors: newCols }));
                            }}
                          />
                          <span className="text-[10px] text-zinc-400 font-mono block px-1.5">
                            {norm(c.h)} {c.p ? `· ${c.p}` : ''}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono">
                        {i === 0 ? 'Primary' : i === 1 ? 'Secondary' : `Accent ${i}`}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="my-2" />

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Highlight Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={norm(S.accent || THEMES[S.theme]?.acc || '#2E5BFF')}
                    onChange={e => updateState(() => ({ accent: norm(e.target.value) }))}
                    className="w-8 h-8 rounded-lg border border-zinc-200 cursor-pointer"
                  />
                  <Input
                    value={norm(S.accent || THEMES[S.theme]?.acc || '#2E5BFF')}
                    onChange={e => updateState(() => ({ accent: norm(e.target.value) }))}
                    className="font-mono text-xs w-32"
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 5: TYPE */}
            <TabsContent value="Type" className="space-y-4 m-0">
              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Display Headline Font
                </label>
                <select
                  value={S.hf}
                  onChange={e => updateState(() => ({ hf: e.target.value }))}
                  className="w-full text-xs font-medium px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-950"
                >
                  {FONTS.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Body Interface Font
                </label>
                <select
                  value={S.bf}
                  onChange={e => updateState(() => ({ bf: e.target.value }))}
                  className="w-full text-xs font-medium px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-950"
                >
                  {FONTS.map(f => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 block mb-1">
                  Headline Font Weight
                </label>
                <select
                  value={S.hw}
                  onChange={e => updateState(() => ({ hw: e.target.value }))}
                  className="w-full text-xs font-medium px-2.5 py-1.5 border border-zinc-200 rounded-md bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-zinc-950"
                >
                  <option value="400">Regular (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                </select>
              </div>
            </TabsContent>

            {/* TAB 6: STYLE */}
            <TabsContent value="Style" className="space-y-4 m-0">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  Aesthetic Theme Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(THEMES).map(([k, cfg]) => (
                    <Button
                      key={k}
                      variant={S.theme === k ? 'default' : 'outline'}
                      className="h-auto p-2.5 flex flex-col items-start justify-start text-left transition-all hover:scale-[1.01]"
                      onClick={() => updateState(() => ({ theme: k }))}
                    >
                      <div className="text-xs font-bold">{cfg.n}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10"
                          style={{ background: cfg.acc }}
                        />
                        <span className="text-[10px] opacity-70 font-mono">{cfg.rad}px rad</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-2" />

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-zinc-700">
                    <span>Corner Radius</span>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {S.rad !== '' ? S.rad : THEMES[S.theme]?.rad || 8}px
                    </Badge>
                  </div>
                  <Slider
                    min={0}
                    max={24}
                    step={1}
                    value={[Number(S.rad !== '' ? S.rad : THEMES[S.theme]?.rad || 8)]}
                    onValueChange={val => updateState(() => ({ rad: String(val[0]) }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium text-zinc-700">
                    <span>Paper Texture Grain</span>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {S.grain !== '' ? S.grain : THEMES[S.theme]?.grain || 0}%
                    </Badge>
                  </div>
                  <Slider
                    min={0}
                    max={25}
                    step={1}
                    value={[Number(S.grain !== '' ? S.grain : THEMES[S.theme]?.grain || 0)]}
                    onValueChange={val => updateState(() => ({ grain: String(val[0]) }))}
                  />
                </div>
              </div>
            </TabsContent>

            {/* TAB 7: SLIDES */}
            <TabsContent value="Slides" className="space-y-2 m-0">
              <div className="flex items-center justify-between text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                <span>All Generated Slides</span>
                <Badge variant="secondary">{slides.length}</Badge>
              </div>
              {slides.map((s, idx) => (
                <Button
                  key={idx}
                  variant={activeSlide === idx ? 'default' : 'outline'}
                  className="w-full justify-between h-8 text-xs font-normal"
                  onClick={() => setActiveSlide(idx)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] opacity-60 font-mono w-5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="truncate max-w-[200px]">{s.title}</span>
                  </div>
                  {s.f === 0 && (
                    <Badge variant="secondary" className="text-[9px] px-1 py-0 uppercase">
                      Cover
                    </Badge>
                  )}
                </Button>
              ))}
            </TabsContent>
          </ScrollArea>
        </>
      )}
    </div>
      </Tabs>
    </aside>
  );
};
