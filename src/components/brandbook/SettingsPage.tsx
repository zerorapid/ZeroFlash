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
import {
  ArrowLeft,
  User,
  Bell,
  Package,
  FileDown,
  ShieldCheck,
  Check,
  LogOut,
  Building2,
  Mail,
  Trash2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface SettingsPageProps {
  currentUser: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onBackToStudio: () => void;
  onSignOut: () => void;
  savedProjects: SavedBrandProject[];
  activeProjectId: string;
  onLoadProject: (project: SavedBrandProject) => void;
  onClearCache: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentUser,
  onUpdateProfile,
  onBackToStudio,
  onSignOut,
  savedProjects,
  activeProjectId,
  onLoadProject,
  onClearCache,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'projects' | 'export' | 'security'>('profile');

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

  const navItems = [
    { id: 'profile', label: 'Account Profile', icon: User, desc: 'Your name, photo & company' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Email alerts & sound preferences' },
    { id: 'projects', label: 'My Brand Projects', icon: Package, desc: 'Manage your saved brand books' },
    { id: 'export', label: 'Export Preferences', icon: FileDown, desc: 'PDF footers & paper settings' },
    { id: 'security', label: 'Security & Data', icon: ShieldCheck, desc: 'Account access & browser cache' },
  ];

  return (
    <div className="min-h-screen w-screen bg-[#F4F4F6] text-zinc-950 flex flex-col font-sans antialiased">
      {/* Top Navigation Header */}
      <header className="w-full bg-white border-b border-zinc-200/90 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToStudio}
            className="gap-2 font-bold text-xs text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 rounded-lg h-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </Button>

          <Separator orientation="vertical" className="h-4 bg-zinc-200" />

          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span>ZeroFlash Studio</span>
            <span>/</span>
            <span className="font-semibold text-zinc-950">Settings & Preferences</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JR'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-zinc-900 block leading-tight">{currentUser.name}</span>
              <span className="text-[10px] text-zinc-400 font-mono leading-tight">{currentUser.tier}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold gap-1.5 h-8"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Settings Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 flex flex-col md:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-1">
          <div className="pb-3 px-3">
            <h2 className="text-sm font-bold text-zinc-900">Settings</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Manage your preferences & brand files</p>
          </div>

          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white shadow-xs border border-zinc-200/90 text-zinc-950 font-bold'
                    : 'hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <item.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? 'text-zinc-950' : 'text-zinc-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] text-zinc-400 font-normal truncate mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Content Area: Pure shadcn Cards */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Profile</CardTitle>
                    <CardDescription>
                      Update your photo, display name, and company information.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold text-[11px]">
                    {currentUser.tier} Member
                  </Badge>
                </div>
              </CardHeader>

              <form onSubmit={handleSaveProfile}>
                <CardContent className="space-y-4">
                  {/* Photo row */}
                  <div className="flex items-center gap-4 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/70">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JR'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900">{name}</h4>
                      <p className="text-[11px] text-zinc-500">{email}</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Profile picture generated from initials</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Your Full Name
                      </label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Agency or Company Name
                      </label>
                      <Input
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        placeholder="e.g. Zerorapid Studios"
                        className="h-9 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Your Role / Job Title
                      </label>
                      <Input
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        placeholder="e.g. Founder & Design Lead"
                        className="h-9 text-xs"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-zinc-100 pt-4">
                  <span className="text-[11px] text-zinc-400">
                    Member since {currentUser.createdAt}
                  </span>
                  <Button type="submit" size="sm" className="bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-semibold gap-1.5 h-8">
                    {profileSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{profileSuccess ? 'Changes Saved' : 'Save Profile'}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how and when ZeroFlash alerts you about your brand book and downloads.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSaveNotifications}>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: 'notif-export',
                      title: 'Email me when PDF export is ready',
                      desc: 'Sends a direct download link to your email when a large 64-slide export finishes.',
                      checked: emailOnExport,
                      onChange: setEmailOnExport,
                    },
                    {
                      id: 'notif-change',
                      title: 'Slide change and sync notifications',
                      desc: 'Shows subtle banner confirmations when colors, logos, or typography auto-sync across all 64 slides.',
                      checked: slideChangeAlerts,
                      onChange: setSlideChangeAlerts,
                    },
                    {
                      id: 'notif-sound',
                      title: 'Play sound effects',
                      desc: 'Plays subtle audio clicks when switching slides, undoing, or reordering items.',
                      checked: soundEffects,
                      onChange: setSoundEffects,
                    },
                    {
                      id: 'notif-weekly',
                      title: 'Weekly design tips and brand advice',
                      desc: 'Occasional design system inspiration and typography pairings curated by senior designers.',
                      checked: emailOnWeeklyReport,
                      onChange: setEmailOnWeeklyReport,
                    },
                  ].map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl border border-zinc-200/80 bg-white hover:bg-zinc-50/50 flex items-center justify-between transition-colors"
                    >
                      <div className="space-y-0.5 pr-4">
                        <h4 className="text-xs font-bold text-zinc-900">{item.title}</h4>
                        <p className="text-[11px] text-zinc-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={e => item.onChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-950"></div>
                      </label>
                    </div>
                  ))}
                </CardContent>

                <CardFooter className="flex justify-end border-t border-zinc-100 pt-4">
                  <Button type="submit" size="sm" className="bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-semibold gap-1.5 h-8">
                    {notifSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{notifSuccess ? 'Preferences Saved' : 'Save Preferences'}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 3: MY BRAND PROJECTS */}
          {activeTab === 'projects' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Brand Projects</CardTitle>
                    <CardDescription>
                      View, duplicate, or switch between your saved brand guideline decks.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-zinc-600">
                    {savedProjects.length} Brands Available
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {savedProjects.map(proj => {
                  const isActive = proj.id === activeProjectId;
                  return (
                    <div
                      key={proj.id}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                        isActive
                          ? 'border-zinc-950 bg-zinc-50/80 shadow-2xs'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-2xs"
                          style={{
                            backgroundColor: proj.state?.colors?.[0]?.h || '#111827',
                            color: proj.state?.colors?.[1]?.h || '#ffffff',
                          }}
                        >
                          {proj.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-zinc-950 truncate">
                              {proj.name}
                            </span>
                            {isActive && (
                              <Badge className="text-[10px] bg-zinc-950 text-white py-0 h-4">
                                Currently Active
                              </Badge>
                            )}
                            {proj.isTemplate && (
                              <Badge variant="outline" className="text-[10px] text-zinc-500 py-0 h-4 border-zinc-200">
                                {proj.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                            {proj.tagline || 'Brand Guidelines and Design System'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                        <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">
                          64 slides
                        </span>
                        {!isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onLoadProject(proj);
                              onBackToStudio();
                            }}
                            className="h-8 text-xs font-semibold"
                          >
                            Open Brand Book
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={onBackToStudio}
                            className="h-8 text-xs font-semibold bg-zinc-950 text-white gap-1.5"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Edit in Studio</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* TAB 4: EXPORT PREFERENCES */}
          {activeTab === 'export' && (
            <Card>
              <CardHeader>
                <CardTitle>Export Preferences</CardTitle>
                <CardDescription>
                  Configure how your brand manuals look when downloaded as PDF or Canva presentations.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSaveExport}>
                <CardContent className="space-y-5 text-xs">
                  {/* Agency Footer */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-900">Company Name on Slide Footers</h4>
                        <p className="text-[11px] text-zinc-500">
                          Adds "Designed by [Your Company]" neatly in the corner of exported slides.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={includeFooter}
                          onChange={e => setIncludeFooter(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-zinc-950"></div>
                      </label>
                    </div>

                    {includeFooter && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Company or Studio Name
                          </label>
                          <Input
                            value={agencyName}
                            onChange={e => setAgencyName(e.target.value)}
                            placeholder="e.g. Zerorapid Studios"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                            Website or Portfolio Link
                          </label>
                          <Input
                            value={agencyWebsite}
                            onChange={e => setAgencyWebsite(e.target.value)}
                            placeholder="e.g. zerorapid.in"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-zinc-100" />

                  {/* Paper Size */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-zinc-900">Default Paper Size</h4>
                    <p className="text-[11px] text-zinc-500">Choose the document dimensions for vector PDF generation.</p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {[
                        { id: 'a4', label: 'A4 Landscape (International Standard)', desc: '297 × 210 mm standard ratio' },
                        { id: 'letter', label: 'US Letter Landscape', desc: '11 × 8.5 inches standard for USA' },
                      ].map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaperSize(p.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            paperSize === p.id
                              ? 'border-zinc-950 bg-zinc-50/80 font-bold shadow-2xs'
                              : 'border-zinc-200 hover:border-zinc-300 bg-white'
                          }`}
                        >
                          <div className="text-xs text-zinc-950 flex items-center justify-between">
                            <span>{p.label}</span>
                            {paperSize === p.id && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                          </div>
                          <p className="text-[10px] text-zinc-500 font-normal mt-0.5">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-zinc-100" />

                  {/* Quality Target */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-zinc-900">Export Color Quality</h4>
                    <p className="text-[11px] text-zinc-500">Optimized for digital client presentations or commercial print.</p>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      {[
                        { id: 'web', label: 'Digital Screen (sRGB)', desc: 'Fast download, perfect for laptops and phones' },
                        { id: 'print', label: 'Print-Ready (High Resolution)', desc: 'Ultra-crisp vector shapes with print margins' },
                      ].map(q => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setQuality(q.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            quality === q.id
                              ? 'border-zinc-950 bg-zinc-50/80 font-bold shadow-2xs'
                              : 'border-zinc-200 hover:border-zinc-300 bg-white'
                          }`}
                        >
                          <div className="text-xs text-zinc-950 flex items-center justify-between">
                            <span>{q.label}</span>
                            {quality === q.id && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                          </div>
                          <p className="text-[10px] text-zinc-500 font-normal mt-0.5">{q.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end border-t border-zinc-100 pt-4">
                  <Button type="submit" size="sm" className="bg-zinc-950 hover:bg-zinc-900 text-white text-xs font-semibold gap-1.5 h-8">
                    {exportSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{exportSuccess ? 'Export Settings Saved' : 'Save Export Settings'}</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {/* TAB 5: SECURITY & DATA */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security & Local Data</CardTitle>
                <CardDescription>
                  Manage your browser storage and session credentials.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* Local Cache Section */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/60 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900">Clear Saved Browser Data</h4>
                    <p className="text-[11px] text-zinc-500">
                      Resets your offline drafts and restores the original templates.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClearCache}
                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold gap-1.5 h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Data</span>
                  </Button>
                </div>

                {/* Sign Out Section */}
                <div className="p-4 rounded-xl border border-zinc-200 bg-white flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-zinc-900">Sign Out of ZeroFlash</h4>
                    <p className="text-[11px] text-zinc-500">
                      Ends your active session on this device.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onSignOut}
                    className="border-zinc-300 text-zinc-800 hover:bg-zinc-100 text-xs font-semibold gap-1.5 h-8"
                  >
                    <LogOut className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Sign Out</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};
