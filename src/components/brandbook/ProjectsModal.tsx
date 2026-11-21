import React, { useState } from 'react';
import { BrandState, SlideOverride, SavedBrandProject } from '../../types/brandbook';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  FolderGit2,
  Plus,
  Download,
  Upload,
  Copy,
  Trash2,
  Check,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Palette,
} from 'lucide-react';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: BrandState;
  currentOverrides: Record<number, SlideOverride>;
  savedProjects: SavedBrandProject[];
  activeProjectId: string;
  onSelectProject: (project: SavedBrandProject) => void;
  onSaveCurrentAsProject: (projectName: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  currentState,
  currentOverrides,
  savedProjects,
  activeProjectId,
  onSelectProject,
  onSaveCurrentAsProject,
  onDeleteProject,
  onDuplicateProject,
  onExportJson,
  onImportJson,
}) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [activeTab, setActiveTab] = useState<'saved' | 'templates'>('saved');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newProjectName.trim();
    if (!trimmed) return;
    onSaveCurrentAsProject(trimmed);
    setNewProjectName('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImportJson(e.target.files[0]);
      onClose();
    }
  };

  const customProjects = savedProjects.filter(p => !p.isTemplate);
  const templateProjects = savedProjects.filter(p => p.isTemplate);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-2xl border border-zinc-200 shadow-2xl">
        <DialogHeader className="p-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-950 text-white flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-zinc-950">
                  Projects & Brand Templates
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Local-first storage • Zero cloud latency • Instant deck switching
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium gap-1.5 border-zinc-200"
                onClick={onExportJson}
                title="Export complete deck configuration as a portable JSON file"
              >
                <Download className="w-3.5 h-3.5 text-zinc-600" />
                <span>Export JSON</span>
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 text-xs font-medium gap-1.5 border-zinc-200"
                >
                  <span>
                    <Upload className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Import</span>
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex gap-2 pt-3 border-t border-zinc-200/60 mt-3">
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'saved'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-transparent text-zinc-600 hover:bg-zinc-200/60'
              }`}
            >
              Saved Workspaces ({customProjects.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'templates'
                  ? 'bg-zinc-950 text-white shadow-xs'
                  : 'bg-transparent text-zinc-600 hover:bg-zinc-200/60'
              }`}
            >
              Curated Industry Templates ({templateProjects.length})
            </button>
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4">
          {activeTab === 'saved' && (
            <>
              {/* Save Current Workspace Input */}
              <form onSubmit={handleSave} className="flex gap-2">
                <Input
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  placeholder={`Save current identity as (e.g. "${currentState.name} v2")...`}
                  className="h-9 text-xs"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newProjectName.trim()}
                  className="h-9 text-xs font-medium gap-1.5 bg-zinc-950 hover:bg-zinc-800 text-white flex-shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save Project</span>
                </Button>
              </form>

              {/* Projects List */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {customProjects.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                    <Layers className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-zinc-800">No custom projects saved yet</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Type a name above to snapshot your current brand system locally.
                    </p>
                  </div>
                ) : (
                  customProjects.map(proj => {
                    const isActive = proj.id === activeProjectId;
                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                          isActive
                            ? 'border-zinc-950 bg-zinc-50/80 shadow-xs'
                            : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                            style={{
                              backgroundColor: proj.state.colors[0]?.h || '#111827',
                            }}
                          >
                            {proj.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-zinc-950">{proj.name}</h4>
                              {isActive && (
                                <Badge className="text-[9px] px-1.5 py-0 bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-500 truncate max-w-[280px]">
                              {proj.tagline || 'No tagline defined'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-500 hover:text-zinc-900"
                            onClick={() => onDuplicateProject(proj.id)}
                            title="Duplicate project"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-zinc-400 hover:text-rose-600"
                            onClick={() => onDeleteProject(proj.id)}
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant={isActive ? 'secondary' : 'default'}
                            className="h-7 text-xs font-medium px-3 ml-1"
                            onClick={() => {
                              onSelectProject(proj);
                              onClose();
                            }}
                          >
                            {isActive ? 'Current' : 'Load Deck'}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}

          {activeTab === 'templates' && (
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {templateProjects.map(tmpl => {
                const isActive = tmpl.id === activeProjectId;
                return (
                  <div
                    key={tmpl.id}
                    className="p-3.5 rounded-xl border border-zinc-200 hover:border-zinc-950 bg-white hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono border-zinc-200 text-zinc-600 bg-zinc-50"
                        >
                          {tmpl.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {tmpl.state.colors.slice(0, 3).map((c, i) => (
                            <span
                              key={i}
                              className="w-2.5 h-2.5 rounded-full border border-black/10"
                              style={{ backgroundColor: c.h }}
                            />
                          ))}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-zinc-950">{tmpl.name}</h4>
                      <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                        {tmpl.state.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {tmpl.state.hf} / {tmpl.state.bf}
                      </span>
                      <Button
                        size="sm"
                        variant={isActive ? 'secondary' : 'default'}
                        className="h-7 text-xs font-medium px-2.5 gap-1"
                        onClick={() => {
                          onSelectProject(tmpl);
                          onClose();
                        }}
                      >
                        <span>{isActive ? 'Applied' : 'Apply'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted local browser storage (IndexedDB / LocalStorage).</span>
          </div>
          <span>64 slides compile instantaneously</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
