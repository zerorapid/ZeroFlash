import React, { useState, useEffect } from 'react';
import { StudioSettings, UserProfile, SavedBrandProject } from '../../types/brandbook';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  SlidersHorizontal,
  Building2,
  Globe,
  Palette,
  Ruler,
  HardDrive,
  Trash2,
  Check,
  ShieldCheck,
  User,
  Package,
  Key,
  Copy,
  LogOut,
  Sparkles,
  ExternalLink,
  Laptop,
} from 'lucide-react';

interface StudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'notifications' | 'projects' | 'export' | 'security' | 'products' | 'standards';
  settings: StudioSettings;
  onUpdateSettings: (next: Partial<StudioSettings>) => void;
  onClearLocalStorage: () => void;
  currentUser: UserProfile | null;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onSignOut: () => void;
  onOpenAuth: () => void;
  savedProjects: SavedBrandProject[];
  activeProjectId: string;
  onLoadProject: (project: SavedBrandProject) => void;
}

export const StudioSettingsModal: React.FC<StudioSettingsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'profile',
  settings,
  onUpdateSettings,
  onClearLocalStorage,
  currentUser,
  onUpdateProfile,
  onSignOut,
  onOpenAuth,
  savedProjects,
  activeProjectId,
  onLoadProject,
}) => {
  const mapTab = (tab?: string): 'profile' | 'products' | 'standards' | 'security' => {
    if (tab === 'security') return 'security';
    if (tab === 'products') return 'products';
    if (tab === 'standards') return 'standards';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'products' | 'standards' | 'security'>(mapTab(defaultTab));

  // Sync tab when opened with specific defaultTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(mapTab(defaultTab));
    }
  }, [isOpen, defaultTab]);

  // Profile Form State
  const [name, setName] = useState(currentUser?.name || 'Jayapal Reddy');
  const [email, setEmail] = useState(currentUser?.email || 'hello@jayapalreddy.in');
  const [organization, setOrganization] = useState(currentUser?.organization || 'Zerorapid Studios');
  const [role, setRole] = useState(currentUser?.role || 'Founder & Design Lead');
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync profile when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setOrganization(currentUser.organization);
      setRole(currentUser.role);
    }
  }, [currentUser]);

  // Output Standards Form State
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [agencyUrl, setAgencyUrl] = useState(settings.agencyUrl);
  const [creditEnabled, setCreditEnabled] = useState(settings.creditEnabled);
  const [colorSpace, setColorSpace] = useState(settings.colorSpace);
  const [units, setUnits] = useState(settings.units);
  const [standardsSaved, setStandardsSaved] = useState(false);

  // Security / MCP Copy State
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, email, organization, role });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 1500);
  };

  const handleSaveStandards = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      agencyName,
      agencyUrl,
      creditEnabled,
      colorSpace,
      units,
    });
    setStandardsSaved(true);
    setTimeout(() => setStandardsSaved(false), 1500);
  };

  const handleCopyKey = () => {
    const key = currentUser?.apiTokens?.mcpKey || 'zf_live_89b2a74c10e34f81';
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('http://localhost:3000/mcp');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl">
        <DialogHeader className="p-5 border-b border-zinc-100 bg-zinc-50/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-zinc-950">
                  Studio Settings & Product Hub
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Manage profile credentials, brand products, output standards & AI connectors.
                </DialogDescription>
              </div>
            </div>

            {currentUser ? (
              <Badge variant="outline" className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border-emerald-200 gap-1.5 py-0.5 px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{currentUser.tier}</span>
              </Badge>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="h-7 text-xs font-semibold gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)} className="w-full">
          <div className="px-5 pt-3 border-b border-zinc-100 bg-zinc-50/30">
            <TabsList className="w-full grid grid-cols-4 h-9 bg-zinc-100 p-0.5 rounded-lg">
              <TabsTrigger value="profile" className="text-xs font-semibold gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="text-xs font-semibold gap-1.5">
                <Package className="w-3.5 h-3.5" />
                <span>Products ({savedProjects.length})</span>
              </TabsTrigger>
              <TabsTrigger value="standards" className="text-xs font-semibold gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Standards</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs font-semibold gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>MCP & Keys</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-5 max-h-[65vh] overflow-y-auto">
            {/* TAB 1: PROFILE & ACCOUNT */}
            <TabsContent value="profile" className="space-y-4 focus-visible:outline-none m-0">
              {currentUser ? (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="flex items-center gap-4 p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50">
                    <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-base shadow-xs">
                      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'JR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-950 truncate">{name}</h4>
                        <Badge className="text-[10px] bg-zinc-950 text-white px-1.5 py-0 h-4 font-mono">
                          {currentUser.tier}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">{email}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{organization} • {role}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onSignOut}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs gap-1.5 h-8"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Display Name
                      </label>
                      <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Primary Email
                      </label>
                      <Input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Agency / Organization
                      </label>
                      <Input
                        value={organization}
                        onChange={e => setOrganization(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
                        Design Role
                      </label>
                      <Input
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400 font-mono">
                      Member since: {currentUser.createdAt}
                    </span>
                    <Button
                      type="submit"
                      size="sm"
                      className="h-8 bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-semibold gap-1.5"
                    >
                      {profileSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Check className="w-3.5 h-3.5" />}
                      <span>{profileSaved ? 'Profile Saved' : 'Save Changes'}</span>
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center mx-auto">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">Guest Session Active</h4>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
                      You are currently working in an anonymous local-first workspace. Sign in to personalize your profile and agency tokens.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="h-8 bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-bold gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In / Create Account</span>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: BRAND PRODUCTS & PORTFOLIO */}
            <TabsContent value="products" className="space-y-3.5 focus-visible:outline-none m-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Managed Brand Products & Decks
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Switch between active client identities or load curated production templates.
                  </p>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono text-zinc-600">
                  {savedProjects.length} Total
                </Badge>
              </div>

              <div className="space-y-2">
                {savedProjects.map(proj => {
                  const isActive = proj.id === activeProjectId;
                  return (
                    <div
                      key={proj.id}
                      className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                        isActive
                          ? 'border-zinc-950 bg-zinc-50 shadow-2xs'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
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
                              <Badge className="text-[9px] bg-zinc-950 text-white py-0 h-4">
                                Active Product
                              </Badge>
                            )}
                            {proj.isTemplate && (
                              <Badge variant="outline" className="text-[9px] text-zinc-500 py-0 h-4 border-zinc-200">
                                {proj.category}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                            {proj.tagline || 'Brand Guidelines & Design System'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                          64 slides
                        </span>
                        {!isActive ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLoadProject(proj)}
                            className="h-7 text-xs font-semibold"
                          >
                            Switch to Product
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Loaded</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* TAB 3: OUTPUT STANDARDS & WHITE-LABELING */}
            <TabsContent value="standards" className="space-y-4 focus-visible:outline-none m-0">
              <form onSubmit={handleSaveStandards} className="space-y-4 text-xs">
                {/* Agency White-Labeling */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-zinc-700" />
                      <h4 className="font-bold text-zinc-900">Agency White-Labeling</h4>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] font-medium text-zinc-600">
                      <input
                        type="checkbox"
                        checked={creditEnabled}
                        onChange={e => setCreditEnabled(e.target.checked)}
                        className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
                      />
                      <span>Include Agency Footers in Export</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                        Agency Name
                      </label>
                      <Input
                        value={agencyName}
                        onChange={e => setAgencyName(e.target.value)}
                        placeholder="e.g. ZeroRapid Design Studio"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-500 mb-1">
                        Agency Portfolio URL
                      </label>
                      <Input
                        value={agencyUrl}
                        onChange={e => setAgencyUrl(e.target.value)}
                        placeholder="e.g. zerorapid.in"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-100" />

                {/* Color Space Profile */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-zinc-700" />
                    <h4 className="font-bold text-zinc-900">Export Color Space Profile</h4>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'sRGB', label: 'sRGB (Standard Web)', desc: 'Optimized for digital screens' },
                      { id: 'CMYK-FOGRA39', label: 'CMYK Simulation', desc: 'Pre-press print fidelity' },
                      { id: 'Display-P3', label: 'Display P3', desc: 'Apple Retina wide-gamut' },
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setColorSpace(opt.id as any)}
                        className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          colorSpace === opt.id
                            ? 'border-zinc-950 bg-zinc-50/80 shadow-2xs font-semibold'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="text-xs text-zinc-950 flex items-center justify-between">
                          <span>{opt.label}</span>
                          {colorSpace === opt.id && <Check className="w-3 h-3 text-zinc-950" />}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-zinc-100" />

                {/* Measurement Units */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-zinc-700" />
                    <h4 className="font-bold text-zinc-900">Measurement Coordinates</h4>
                  </div>

                  <div className="flex gap-2">
                    {[
                      { id: 'px', label: 'Pixels (px)', desc: 'Digital-first scale' },
                      { id: 'mm', label: 'Millimeters (mm)', desc: 'Industrial & packaging' },
                      { id: 'in', label: 'Inches (in)', desc: 'US architectural' },
                    ].map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setUnits(u.id as any)}
                        className={`flex-1 p-2 rounded-lg border text-center transition-all cursor-pointer ${
                          units === u.id
                            ? 'border-zinc-950 bg-zinc-50/80 font-semibold'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="text-xs text-zinc-950">{u.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    size="sm"
                    className="h-8 bg-zinc-950 text-white hover:bg-zinc-900 text-xs font-semibold gap-1.5"
                  >
                    {standardsSaved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{standardsSaved ? 'Standards Saved' : 'Save Standards'}</span>
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB 4: SECURITY & MCP CONNECTORS */}
            <TabsContent value="security" className="space-y-4 focus-visible:outline-none m-0 text-xs">
              <div className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-zinc-800" />
                  <h4 className="font-bold text-zinc-950">ZeroFlash MCP Server Endpoint</h4>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Connect Google Antigravity, Cursor, Claude Desktop, or Codex directly to this running studio.
                </p>

                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value="http://localhost:3000/mcp"
                    className="h-8 font-mono text-[11px] bg-white border-zinc-200"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="h-8 text-xs gap-1.5 flex-shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </Button>
                </div>
              </div>

              {/* Connected Tool Compatibility Indicators */}
              <div className="space-y-2">
                <h4 className="font-bold text-zinc-900 uppercase tracking-wider text-[11px]">
                  Tool Compatibility Status
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Google Antigravity', status: 'Native Supported', badge: 'Streamable HTTP' },
                    { name: 'Cursor IDE', status: 'Native Supported', badge: 'Composer MCP' },
                    { name: 'Claude Desktop', status: 'Custom Connector', badge: 'JSON-RPC' },
                    { name: 'Codex / CLI', status: 'Ready to Pipe', badge: 'REST / MCP' },
                  ].map((tool, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-zinc-200 bg-white flex items-center justify-between">
                      <div>
                        <p className="font-bold text-zinc-950">{tool.name}</p>
                        <p className="text-[10px] text-emerald-600 font-medium">{tool.status}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono text-zinc-500">
                        {tool.badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-zinc-100" />

              {/* Cache Purge */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50/30">
                <div>
                  <h4 className="font-bold text-red-950">Reset Sovereign Storage</h4>
                  <p className="text-[11px] text-red-700/80">
                    Purge all local offline projects and reset to curated agency templates.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClearLocalStorage}
                  className="h-8 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 text-xs font-semibold gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Purge Cache</span>
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
