import React, { useState } from 'react';
import { UserProfile, SavedBrandProject } from '../../types/brandbook';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import {
  ArrowLeft,
  User,
  Bell,
  Package,
  FileDown,
  ShieldCheck,
  Check,
  Building2,
  Mail,
  Trash2,
  Sparkles,
  ExternalLink,
  Layers,
  Clock,
  Download,
} from 'lucide-react';

interface SettingsWorkspacePanelProps {
  settingsTab: 'profile' | 'notifications' | 'projects' | 'export' | 'security';
  onSelectTab: (tab: 'profile' | 'notifications' | 'projects' | 'export' | 'security') => void;
  currentUser: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onBackToStudio: () => void;
  onSignOut: () => void;
  savedProjects: SavedBrandProject[];
  activeProjectId: string;
  onLoadProject: (project: SavedBrandProject) => void;
  onClearCache: () => void;
}

const TAB_TITLES: Record<string, { title: string; desc: string }> = {
  profile: {
    title: 'Account & Agency Profile',
    desc: 'Manage your name, studio organization, and Pro credentials.',
  },
  notifications: {
    title: 'Notification Preferences',
    desc: 'Configure email alerts, export pings, and audio feedback in simple layman language.',
  },
  projects: {
    title: 'My Brand Projects',
    desc: 'Switch between client brand books, load backups, or export project data.',
  },
  export: {
    title: 'Export Defaults & Brand Footers',
    desc: 'Control PDF page sizing, agency footer credits, and vector export quality.',
  },
  security: {
    title: 'Security & Local Storage',
    desc: 'Review on-device private data, clear cache, or reset workspace defaults.',
  },
};

export const SettingsWorkspacePanel: React.FC<SettingsWorkspacePanelProps> = ({
  settingsTab,
  onSelectTab,
  currentUser,
  onUpdateProfile,
  onBackToStudio,
  onSignOut,
  savedProjects,
  activeProjectId,
  onLoadProject,
  onClearCache,
}) => {
  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [organization, setOrganization] = useState(currentUser.organization);
  const [role, setRole] = useState(currentUser.role);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Notification Preferences State (Simple layman language)
  const [emailOnExport, setEmailOnExport] = useState(currentUser.notifications?.emailOnExport ?? true);
  const [emailOnWeeklyReport, setEmailOnWeeklyReport] = useState(currentUser.notifications?.emailOnWeeklyReport ?? false);
  const [soundEffects, setSoundEffects] = useState(currentUser.notifications?.soundEffects ?? true);
  const [slideChangeAlerts, setSlideChangeAlerts] = useState(currentUser.notifications?.slideChangeAlerts ?? true);
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Export Preferences State (Simple layman language)
  const [includeFooter, setIncludeFooter] = useState(currentUser.exportSettings?.includeAgencyFooter ?? true);
  const [agencyName, setAgencyName] = useState(currentUser.exportSettings?.agencyName ?? currentUser.organization);
  const [agencyWebsite, setAgencyWebsite] = useState(currentUser.exportSettings?.agencyWebsite ?? 'zerorapid.in');
  const [paperSize, setPaperSize] = useState<'a4' | 'letter'>(currentUser.exportSettings?.paperSize ?? 'a4');
  const [quality, setQuality] = useState<'web' | 'print'>(currentUser.exportSettings?.quality ?? 'web');
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email, organization, role });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 2000);
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      notifications: {
        emailOnExport,
        emailOnWeeklyReport,
        soundEffects,
        slideChangeAlerts,
      },
    });
    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 2000);
  };

  const handleSaveExport = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      exportSettings: {
        includeAgencyFooter: includeFooter,
        agencyName,
        agencyWebsite,
        paperSize,
        quality,
      },
    });
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const currentTabMeta = TAB_TITLES[settingsTab] || TAB_TITLES.profile;

  return (
    <div className="flex-1 h-full rounded-2xl bg-white border border-zinc-200/90 shadow-xs flex flex-col overflow-hidden animate-in fade-in duration-150">
      {/* Top Header Bar */}
      <div className="h-14 px-6 border-b border-zinc-100 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-400">Settings</span>
            <span className="text-zinc-300">/</span>
            <span className="font-bold text-zinc-950">{currentTabMeta.title}</span>
          </div>
        </div>

        {/* Back to 64-Slide Guideline Deck Button */}
        <Button
          variant="default"
          size="sm"
          onClick={onBackToStudio}
          className="gap-2 font-bold text-xs bg-zinc-900 text-white hover:bg-zinc-800 rounded-lg h-8 shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Brand Deck (64 Slides)</span>
        </Button>
      </div>

      {/* Main Scrollable Content */}
      <ScrollArea className="flex-1 p-6 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
          {/* TAB 1: PROFILE */}
          {settingsTab === 'profile' && (
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">Personal Profile & Credentials</CardTitle>
                    <CardDescription className="text-xs text-zinc-500">
                      Your identity as presented across brand books, team exports, and invoices.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold text-[11px]">
                    {currentUser.tier} Member
                  </Badge>
                </div>
              </CardHeader>

              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-4">
                  {/* Photo & Identity Row */}
                  <div className="flex items-center gap-4 p-3 bg-zinc-50/70 rounded-xl border border-zinc-200/60">
                    <div className="w-14 h-14 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-zinc-900">{name}</div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>{email}</span>
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-zinc-400" />
                        <span>{organization || 'Independent Studio'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Full Name</label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Jayapal Reddy"
                        className="h-9 text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Email Address</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="h-9 text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Design Agency / Company</label>
                      <Input
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="e.g. Zerorapid Studios"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Your Role</label>
                      <Input
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g. Creative Director & Founder"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  {/* Plan Perks Banner */}
                  <div className="p-4 rounded-xl bg-zinc-950 text-white flex items-center justify-between mt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold">ZeroFlash Pro License</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">
                        Unlimited 64-slide decks, OKLCH palette extractor, on-device Agent Zap & vector PDF prints.
                      </p>
                    </div>
                    <Badge className="bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300">
                      Active
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div className="text-xs text-zinc-400">
                    Changes take effect across all active brand guideline slides.
                  </div>
                  <Button type="submit" size="sm" className="gap-1.5 text-xs font-semibold">
                    {profileSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Saved Successfully</span>
                      </>
                    ) : (
                      <span>Save Profile Changes</span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {settingsTab === 'notifications' && (
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Notification & Sound Preferences</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Choose when and how BrandBook Studio alerts you during your design workflow.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSaveNotifications}>
                <CardContent className="space-y-3">
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={emailOnExport}
                      onChange={e => setEmailOnExport(e.target.checked)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900">Email me when PDF export is ready</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        When generating ultra-high 300 DPI vector PDFs, receive an email download link as soon as compilation finishes.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={slideChangeAlerts}
                      onChange={e => setSlideChangeAlerts(e.target.checked)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900">Slide change notifications</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Show a brief toast alert whenever you apply a new color palette, font pairing, or slide layout override.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={soundEffects}
                      onChange={e => setSoundEffects(e.target.checked)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900">Subtle UI click & action sounds</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Gentle tactile audio feedback when switching tabs, copying HEX codes, and running Undo/Redo.
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={emailOnWeeklyReport}
                      onChange={e => setEmailOnWeeklyReport(e.target.checked)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900">Weekly design inspiration & new slide templates</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        A curated digest of trending brand systems, Swiss typography layouts, and new vector mockups.
                      </div>
                    </div>
                  </label>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div className="text-xs text-zinc-400">
                    Preferences are stored securely on this computer.
                  </div>
                  <Button type="submit" size="sm" className="gap-1.5 text-xs font-semibold">
                    {notifSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Saved Preferences</span>
                      </>
                    ) : (
                      <span>Save Preferences</span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 3: PROJECTS */}
          {settingsTab === 'projects' && (
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold">My Saved Brand Projects</CardTitle>
                    <CardDescription className="text-xs text-zinc-500">
                      Switch between your client guidelines or backup project files to your computer.
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {savedProjects.length} Projects
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {savedProjects.length === 0 ? (
                  <div className="p-8 text-center border border-dashed rounded-xl border-zinc-200">
                    <Package className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-zinc-700">No custom brand projects saved yet</p>
                    <p className="text-[11px] text-zinc-400 mt-1">
                      Your current deck is auto-saved locally. Click "Projects" in the top bar to save brand snapshots.
                    </p>
                  </div>
                ) : (
                  savedProjects.map(proj => {
                    const isActive = proj.id === activeProjectId;
                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                          isActive
                            ? 'bg-zinc-50/80 border-zinc-950 shadow-xs'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs flex-shrink-0"
                            style={{ backgroundColor: proj.state.accent || '#181A20' }}
                          >
                            {proj.state.name?.charAt(0) || 'B'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-zinc-950 truncate">{proj.name}</span>
                              {isActive && (
                                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px] py-0">
                                  Active Deck
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-zinc-400 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 font-mono">
                                <Layers className="w-3 h-3" />
                                64 Slides
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(proj.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                onLoadProject(proj);
                                onBackToStudio();
                              }}
                              className="text-xs h-8"
                            >
                              Load Deck
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>

              <CardFooter className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Projects are stored in your private browser storage.
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBackToStudio}
                  className="text-xs font-semibold"
                >
                  Return to Studio
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* TAB 4: EXPORT PREFERENCES */}
          {settingsTab === 'export' && (
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Export Defaults & Agency Branding</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  Configure how your brand books look when exported to PDF, PowerPoint, or shared with clients.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSaveExport}>
                <CardContent className="space-y-4">
                  {/* Agency Footer Credit */}
                  <label className="flex items-start gap-3 p-3.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={includeFooter}
                      onChange={e => setIncludeFooter(e.target.checked)}
                      className="mt-0.5 rounded text-zinc-900 focus:ring-zinc-900 h-4 w-4"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-900">Include agency branding in slide footers</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Displays "Designed by [Your Agency Name]" discreetly in the micro-folio of each exported slide.
                      </div>
                    </div>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Agency Display Name</label>
                      <Input
                        value={agencyName}
                        onChange={e => setAgencyName(e.target.value)}
                        placeholder="e.g. Zerorapid Studios"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Agency Website URL</label>
                      <Input
                        value={agencyWebsite}
                        onChange={e => setAgencyWebsite(e.target.value)}
                        placeholder="e.g. zerorapid.in"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Default PDF Page Format</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaperSize('a4')}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            paperSize === 'a4'
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <span>A4 Landscape</span>
                          <span className="text-[10px] font-normal opacity-70">Global standard</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaperSize('letter')}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            paperSize === 'letter'
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <span>US Letter</span>
                          <span className="text-[10px] font-normal opacity-70">North America</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Export Rendering Quality</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setQuality('web')}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            quality === 'web'
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <span>Web (Fast)</span>
                          <span className="text-[10px] font-normal opacity-70">Smaller file size</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuality('print')}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                            quality === 'print'
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                          }`}
                        >
                          <span>Print (300 DPI)</span>
                          <span className="text-[10px] font-normal opacity-70">Ultra crisp</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <div className="text-xs text-zinc-400">
                    Applies to all subsequent PDF & PPTX downloads.
                  </div>
                  <Button type="submit" size="sm" className="gap-1.5 text-xs font-semibold">
                    {exportSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Saved Defaults</span>
                      </>
                    ) : (
                      <span>Save Export Defaults</span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 5: SECURITY & DATA */}
          {settingsTab === 'security' && (
            <Card className="border-zinc-200/90 shadow-xs">
              <CardHeader>
                <CardTitle className="text-base font-bold">Privacy, Storage & Reset Controls</CardTitle>
                <CardDescription className="text-xs text-zinc-500">
                  ZeroFlash runs 100% locally on your machine with zero server tracking or telemetry.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-zinc-900">Local Browser Storage</div>
                      <div className="text-[11px] text-zinc-500">All brand palettes, typography, and uploaded images stay in your browser.</div>
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px] bg-white">
                      Encrypted / Local
                    </Badge>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-zinc-200 bg-white">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Clear Temporary Cache</div>
                    <div className="text-[11px] text-zinc-500">
                      Clears temporary render buffers while preserving your saved brand projects.
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onClearCache();
                      alert('Temporary workspace cache cleared successfully.');
                    }}
                    className="text-xs h-8 text-zinc-700 hover:text-zinc-950 flex-shrink-0"
                  >
                    Clear Cache
                  </Button>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-red-200 bg-red-50/40">
                  <div>
                    <div className="text-xs font-bold text-red-900">Reset Workspace to Factory Standards</div>
                    <div className="text-[11px] text-red-600/80">
                      Wipes all local drafts and restores the original Zerorapid brand template.
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all workspace data? This cannot be undone.')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="text-xs h-8 flex-shrink-0 gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Everything</span>
                  </Button>
                </div>
              </CardContent>

              <CardFooter className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Session: {currentUser.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold"
                >
                  Sign Out of Account
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
