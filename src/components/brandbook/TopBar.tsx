import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Undo2,
  Redo2,
  Grid3X3,
  Play,
  Image as ImageIcon,
  FileDown,
  Presentation,
  SlidersHorizontal,
  User,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  Package,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { ShimmerButton } from '../ui/ShimmerButton';
import { UserProfile } from '../../types/brandbook';

interface TopBarProps {
  viewMode: 'all' | 'one';
  setViewMode: (mode: 'all' | 'one') => void;
  activeSlide: number;
  totalSlides: number;
  onPrevSlide: () => void;
  onNextSlide: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  guides: boolean;
  onToggleGuides: () => void;
  onPresent: () => void;
  onOpenImages: () => void;
  onOpenAssistant: () => void;
  onOpenProjects: () => void;
  onOpenSettings: () => void;
  onOpenSettingsTab?: (tab: 'profile' | 'products' | 'standards' | 'security') => void;
  onExportPdf: () => void;
  onExportPptx: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: (tab?: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  setViewMode,
  activeSlide,
  totalSlides,
  onPrevSlide,
  onNextSlide,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  guides,
  onToggleGuides,
  onPresent,
  onOpenImages,
  onOpenAssistant,
  onOpenProjects,
  onOpenSettings,
  onOpenSettingsTab,
  onExportPdf,
  onExportPptx,
  currentUser,
  onOpenAuth,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'JR';

  return (
    <TooltipProvider delayDuration={200}>
      <header className="w-full h-13 rounded-2xl border border-zinc-200/90 bg-white/95 px-3.5 shadow-xs backdrop-blur-xl flex items-center justify-between flex-shrink-0 select-none z-30">
        {/* Left: ZeroFlash v2.0 Title & Responsive Non-Wrapping Slide Badge */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="flex items-baseline gap-1.5 flex-shrink-0">
            <span className="text-sm font-extrabold tracking-tight text-zinc-950 font-sans whitespace-nowrap">
              ZeroFlash
            </span>
            <span className="text-xs font-bold text-zinc-400 font-mono tracking-wider whitespace-nowrap">
              v2.0
            </span>
          </div>

          <Separator orientation="vertical" className="h-4 bg-zinc-200 mx-0.5 hidden sm:block flex-shrink-0" />

          {/* Auto-synced slides badge: whitespace-nowrap prevents any vertical breaking */}
          <Badge
            variant="outline"
            className="hidden sm:inline-flex text-[11px] font-mono text-zinc-600 border-zinc-200/80 bg-zinc-50/70 whitespace-nowrap flex-shrink-0 px-2 py-0.5"
          >
            <span className="hidden xl:inline">{totalSlides} slides auto-synced</span>
            <span className="inline xl:hidden">{totalSlides} slides</span>
          </Badge>
        </div>

        {/* Right: Actions, Explicit Settings, Exports, Agent Zap & User Account */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-600 rounded-lg hover:bg-zinc-100"
                  onClick={onUndo}
                  disabled={!canUndo}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-600 rounded-lg hover:bg-zinc-100"
                  onClick={onRedo}
                  disabled={!canRedo}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-4 mx-0.5 bg-zinc-200/80 hidden sm:block flex-shrink-0" />

          {/* Guides & Present */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={guides ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8 rounded-lg flex-shrink-0"
                onClick={onToggleGuides}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Margin Guides (G)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-zinc-600 hover:text-zinc-950 flex-shrink-0"
                onClick={onPresent}
              >
                <Play className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Present Fullscreen</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="h-4 mx-0.5 bg-zinc-200/80 hidden md:block flex-shrink-0" />

          {/* Image Search Modal */}
          <Button
            variant="outline"
            size="sm"
            data-zap-action="logo-upload"
            onClick={onOpenImages}
            className="rounded-lg border-zinc-200/80 bg-white/90 hover:bg-zinc-50 shadow-2xs gap-1.5 text-xs font-semibold h-8 flex-shrink-0"
            title="Image Asset Library & Unsplash / Picsum"
          >
            <ImageIcon className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden lg:inline">Images</span>
          </Button>

          {/* Vector PDF Export */}
          <Button
            variant="outline"
            size="sm"
            data-zap-action="export-pdf"
            onClick={onExportPdf}
            className="rounded-lg border-zinc-200/80 bg-white/90 hover:bg-zinc-50 shadow-2xs gap-1.5 text-xs font-semibold h-8 flex-shrink-0"
            title="Export Vector 64-Slide PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-zinc-500" />
            <span className="hidden sm:inline">PDF</span>
          </Button>

          {/* Aceternity Shimmer Button: Canva PPTX */}
          <ShimmerButton
            data-zap-action="export-pdf"
            onClick={onExportPptx}
            className="rounded-lg h-8 gap-1.5 px-2.5 flex-shrink-0"
            title="Export Editable Canva Presentation"
          >
            <Presentation className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">Canva PPTX</span>
          </ShimmerButton>

          <Separator orientation="vertical" className="h-4 mx-0.5 bg-zinc-200/80 flex-shrink-0" />

          {/* AUTH / USER PROFILE MENU */}
          {currentUser ? (
            <div className="relative flex-shrink-0" ref={userMenuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(prev => !prev);
                }}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer border border-zinc-200/80 bg-white"
                title="Account Menu & Profile Settings"
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white flex items-center justify-center text-[11px] font-bold shadow-2xs">
                  {initials}
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <div className="text-[11px] font-bold text-zinc-900 leading-tight truncate max-w-[85px]">
                    {currentUser.name.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-zinc-400 mr-0.5" />
              </button>

              {/* Floating Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-2 shadow-2xl z-50 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* User Header */}
                    <div className="p-2 border-b border-zinc-100 mb-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-950 truncate">{currentUser.name}</span>
                        <Badge className="text-[9px] bg-zinc-950 text-white px-1.5 py-0 h-4 font-mono">
                          {currentUser.tier}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{currentUser.email}</p>
                      <p className="text-[10px] text-zinc-500 font-medium mt-1 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-zinc-400" />
                        <span>{currentUser.organization}</span>
                      </p>
                    </div>

                    {/* Menu Actions */}
                    <div className="space-y-0.5 py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenSettingsTab) onOpenSettingsTab('profile');
                          else onOpenSettings();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-left cursor-pointer transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Profile & Account</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenSettingsTab) onOpenSettingsTab('products');
                          else onOpenProjects();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-left cursor-pointer transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Brand Products & Decks</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenSettingsTab) onOpenSettingsTab('standards');
                          else onOpenSettings();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-left cursor-pointer transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Output Standards & Specs</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (onOpenSettingsTab) onOpenSettingsTab('security');
                          else onOpenSettings();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 text-left cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
                        <span>MCP Server & Keys</span>
                      </button>
                    </div>

                    <Separator className="my-1 bg-zinc-100" />

                    {/* Sign Out */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 text-left cursor-pointer transition-colors font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth('signin')}
                className="h-8 text-xs font-semibold px-2 text-zinc-700 hover:text-zinc-950 gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenAuth('signup')}
                className="h-8 text-xs font-semibold px-2.5 bg-zinc-950 text-white hover:bg-zinc-900 border-zinc-950 gap-1.5 shadow-2xs"
              >
                <UserPlus className="w-3.5 h-3.5 text-zinc-300" />
                <span>Create Account</span>
              </Button>
            </div>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
};
