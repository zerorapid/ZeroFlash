import React, { useState, useRef } from 'react';
import {
  Search,
  Wand2,
  Link2,
  Upload,
  Loader2,
  Image as ImageIcon,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (targetFrameId: string, url: string, credit?: string) => void;
  targetFrameId?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  targetFrameId = 'm_ph1',
}) => {
  const [sourceTab, setSourceTab] = useState<'upload' | 'unsplash' | 'picsum' | 'url'>('upload');
  const [searchQuery, setSearchQuery] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [results, setResults] = useState<{ thumb: string; full: string; title: string; credit: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onSelectImage(targetFrameId, String(reader.result || ''), file.name);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&page_size=18&license_type=commercial&aspect_ratio=wide`
      );
      if (res.ok) {
        const data = await res.json();
        const items = (data.results || []).map((x: any) => ({
          thumb: x.thumbnail || x.url,
          full: x.url || x.thumbnail,
          title: x.title || 'Curated Image',
          credit: `Photo by ${x.creator || 'contributor'} via Openverse`,
        }));
        setResults(items);
      }
    } catch (e) {
      console.warn('Openverse search fallback', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePicsumGenerate = (topicSeed?: string) => {
    const seed = topicSeed || searchQuery.trim() || 'studio';
    const items = ['workspace', 'architecture', 'coffee', 'minimal', 'texture', 'nature', 'design', 'urban'].map(
      (topic, i) => ({
        thumb: `https://picsum.photos/seed/${seed}-${topic}-${i}/320/240`,
        full: `https://picsum.photos/seed/${seed}-${topic}-${i}/1600/900`,
        title: `${topic} visual`,
        credit: `Placeholder via Picsum (${seed})`,
      })
    );
    setResults(items);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col p-6 overflow-hidden">
        {/* Header */}
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-zinc-950">Image Asset Library</DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                Upload custom vector artwork or curate commercial-licensed photography.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Navigation Tabs */}
        <Tabs
          value={sourceTab}
          onValueChange={v => setSourceTab(v as any)}
          className="flex-1 flex flex-col min-h-0 mt-3"
        >
          <TabsList className="w-full grid grid-cols-4 h-10 bg-zinc-100/90 p-1 rounded-xl">
            <TabsTrigger value="upload" className="text-xs font-semibold gap-1.5 h-8">
              <Upload className="w-3.5 h-3.5" />
              <span>Local Upload</span>
            </TabsTrigger>
            <TabsTrigger value="unsplash" className="text-xs font-semibold gap-1.5 h-8">
              <Search className="w-3.5 h-3.5" />
              <span>Openverse</span>
            </TabsTrigger>
            <TabsTrigger value="picsum" className="text-xs font-semibold gap-1.5 h-8">
              <Wand2 className="w-3.5 h-3.5" />
              <span>Instant Fill</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs font-semibold gap-1.5 h-8">
              <Link2 className="w-3.5 h-3.5" />
              <span>Direct Link</span>
            </TabsTrigger>
          </TabsList>

          {/* Active Tab Controls */}
          <div className="mt-4 flex-1 flex flex-col min-h-0">
            {/* 1. LOCAL UPLOAD DROPZONE (Refactored & Pixel-Perfect) */}
            {sourceTab === 'upload' && (
              <div className="flex-1 flex flex-col justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                />

                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full rounded-2xl border-2 border-dashed p-8 md:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none ${
                    isDragging
                      ? 'border-zinc-950 bg-zinc-100/80 scale-[1.01]'
                      : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/60 hover:bg-zinc-50'
                  }`}
                >
                  {/* Upload Icon Circle */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-800 mb-3.5 transition-transform group-hover:scale-105">
                    <Upload className="w-6 h-6 stroke-[1.8] text-zinc-900" />
                  </div>

                  {/* Primary & Subtext */}
                  <div className="space-y-1 max-w-sm">
                    <div className="text-sm font-bold text-zinc-900">
                      Drag and drop your image, or <span className="text-blue-600 hover:underline">browse</span>
                    </div>
                    <p className="text-xs text-zinc-500">
                      Vector <span className="font-semibold text-zinc-700">SVG</span> files remain mathematically sharp at 300 DPI. Also supports PNG, JPG, and WEBP.
                    </p>
                  </div>

                  {/* Styled Action Button */}
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="mt-5 gap-2 text-xs font-semibold h-9 px-4 rounded-xl shadow-xs"
                    onClick={e => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Choose File from Computer</span>
                  </Button>

                  <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <span>Up to 25MB</span>
                    <span>•</span>
                    <span>Instant Local Processing</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. OPENVERSE SEARCH */}
            {sourceTab === 'unsplash' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Search commercial-licensed photography (e.g. minimalist architecture)..."
                    className="h-10 text-xs rounded-xl"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSearch()}
                    disabled={isLoading}
                    className="h-10 px-4 rounded-xl gap-1.5 flex-shrink-0 text-xs font-semibold"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                    <span>Search</span>
                  </Button>
                </div>

                {/* Popular Query Chips */}
                {results.length === 0 && !isLoading && (
                  <div className="py-6 text-center space-y-3">
                    <p className="text-xs text-zinc-500">Popular design searches:</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                      {['Minimal Architecture', 'Swiss Graphic', 'Workspace Tech', 'Studio Texture', 'Brutalist Concrete'].map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setSearchQuery(chip);
                            handleSearch(chip);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors font-medium cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. PICSUM INSTANT FILL */}
            {sourceTab === 'picsum' && (
              <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Enter seed term (e.g. brutalism, luxury, nordic)..."
                    className="h-10 text-xs rounded-xl"
                  />
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePicsumGenerate()}
                    className="h-10 px-4 rounded-xl gap-1.5 flex-shrink-0 text-xs font-semibold"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Generate Grid</span>
                  </Button>
                </div>

                {results.length === 0 && (
                  <div className="py-6 text-center space-y-3">
                    <p className="text-xs text-zinc-500">Instant placeholder presets:</p>
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                      {['minimal', 'luxury', 'technology', 'editorial', 'nature'].map(chip => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => {
                            setSearchQuery(chip);
                            handlePicsumGenerate(chip);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors font-medium cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. DIRECT URL */}
            {sourceTab === 'url' && (
              <div className="flex-1 flex flex-col justify-center space-y-3 py-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700">Paste Direct Image URL</label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={directUrl}
                      onChange={e => setDirectUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="h-10 text-xs rounded-xl"
                    />
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        if (directUrl.trim()) {
                          onSelectImage(targetFrameId, directUrl.trim(), 'Direct image link');
                          onClose();
                        }
                      }}
                      className="h-10 px-4 rounded-xl gap-1.5 flex-shrink-0 text-xs font-semibold"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Place Artwork</span>
                    </Button>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Accepts HTTPS links to PNG, SVG, JPG, or WebP hosted assets.
                  </p>
                </div>
              </div>
            )}

            {/* Image Results Grid (for Openverse / Picsum) */}
            {results.length > 0 && (sourceTab === 'unsplash' || sourceTab === 'picsum') && (
              <ScrollArea className="flex-1 mt-3 pr-2">
                <div className="grid grid-cols-3 gap-2.5 pb-2">
                  {results.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        onSelectImage(targetFrameId, r.full, r.credit);
                        onClose();
                      }}
                      className="group relative rounded-xl overflow-hidden border border-zinc-200 aspect-video hover:border-zinc-950 hover:shadow-md transition-all text-left cursor-pointer"
                    >
                      <img
                        src={r.thumb}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <span className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-xs truncate block">
                        {r.title}
                      </span>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
