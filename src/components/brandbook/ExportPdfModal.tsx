import React, { useState, useMemo } from 'react';
import { SlideDefinition } from '../../types/brandbook';
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
  FileDown,
  Layers,
  CheckCircle2,
  ListFilter,
  Check,
  X,
  Printer,
  Sparkles,
} from 'lucide-react';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: SlideDefinition[];
  currentSlideIndex: number;
  onExport: (selectedIndices: number[]) => void;
}

type ExportScope = 'all' | 'current' | 'range' | 'custom';

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  slides,
  currentSlideIndex,
  onExport,
}) => {
  const [scope, setScope] = useState<ExportScope>('all');
  const [rangeInput, setRangeInput] = useState<string>('1-12, 14, 20-25');
  const [selectedSet, setSelectedSet] = useState<Set<number>>(() => {
    return new Set(slides.map((_, i) => i));
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Parse custom range input (e.g. "1-5, 8, 11-14")
  const parsedRangeIndices = useMemo(() => {
    const indices: number[] = [];
    const parts = rangeInput.split(',').map(p => p.trim()).filter(Boolean);
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map(s => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(slides.length, Math.max(start, end));
          for (let i = min; i <= max; i++) {
            if (!indices.includes(i - 1)) {
              indices.push(i - 1);
            }
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= slides.length) {
          if (!indices.includes(num - 1)) {
            indices.push(num - 1);
          }
        }
      }
    }
    return indices.sort((a, b) => a - b);
  }, [rangeInput, slides.length]);

  // Determine active list of indices to export based on scope
  const activeExportIndices = useMemo(() => {
    switch (scope) {
      case 'all':
        return slides.map((_, i) => i);
      case 'current':
        return [currentSlideIndex];
      case 'range':
        return parsedRangeIndices;
      case 'custom':
        return Array.from(selectedSet).sort((a, b) => a - b);
      default:
        return slides.map((_, i) => i);
    }
  }, [scope, slides, currentSlideIndex, parsedRangeIndices, selectedSet]);

  const handleToggleSlide = (index: number) => {
    setSelectedSet(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedSet(new Set(slides.map((_, i) => i)));
  };

  const handleClearAll = () => {
    setSelectedSet(new Set());
  };

  const handleConfirm = () => {
    if (activeExportIndices.length === 0) return;
    setIsExporting(true);
    onExport(activeExportIndices);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 400);
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white text-zinc-950 p-0 overflow-hidden shadow-2xl border border-zinc-200 rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shadow-sm">
                <FileDown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-zinc-900">
                  Export Brand Book (PDF)
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500 mt-0.5">
                  Select slides and generate a vector-sharp architectural presentation.
                </DialogDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs px-2.5 py-1 bg-white border-zinc-200">
              Total: {slides.length} Slides
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Scope Selection Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Slide Export Scope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All Slides', desc: `${slides.length} Slides` },
                { id: 'current', label: 'Current Slide', desc: `Slide #${currentSlideIndex + 1}` },
                { id: 'range', label: 'Slide Range', desc: 'e.g. 1-12, 20' },
                { id: 'custom', label: 'Pick Slides', desc: `${selectedSet.size} Selected` },
              ].map(opt => {
                const isSelected = scope === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScope(opt.id as ExportScope)}
                    className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="text-xs font-bold">{opt.label}</span>
                    <span
                      className={`text-[11px] mt-0.5 ${
                        isSelected ? 'text-zinc-300' : 'text-zinc-500'
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Control depending on Scope */}
          {scope === 'range' && (
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-800">
                  Enter Page Numbers or Ranges:
                </span>
                <span className="text-xs font-bold text-zinc-900">
                  {parsedRangeIndices.length} Slides matched
                </span>
              </div>
              <Input
                value={rangeInput}
                onChange={e => setRangeInput(e.target.value)}
                placeholder="e.g. 1-10, 14, 23-40"
                className="font-mono text-xs bg-white border-zinc-200"
              />
              <p className="text-[11px] text-zinc-500">
                Use hyphens for ranges (e.g. 1-8) and commas to separate multiple sections.
              </p>
            </div>
          )}

          {scope === 'custom' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-800">
                    Select Slides to Include:
                  </span>
                  <Badge variant="secondary" className="text-[10px] font-mono">
                    {selectedSet.size} / {slides.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAll}
                    className="text-[11px] h-7 px-2 text-zinc-600 hover:text-zinc-900"
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-[11px] h-7 px-2 text-zinc-600 hover:text-zinc-900"
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-52 rounded-xl border border-zinc-200 bg-zinc-50/50 p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {slides.map((s, idx) => {
                    const isChecked = selectedSet.has(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleSlide(idx)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-xs border transition-colors ${
                          isChecked
                            ? 'bg-white border-zinc-900 shadow-2xs text-zinc-950 font-semibold'
                            : 'bg-white/60 border-zinc-200/80 text-zinc-500 hover:border-zinc-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${
                            isChecked
                              ? 'bg-zinc-900 border-zinc-900 text-white'
                              : 'border-zinc-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400 w-5">
                          #{idx + 1}
                        </span>
                        <span className="truncate flex-1 min-w-0">{s.title || `Slide ${idx + 1}`}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}

          {scope === 'current' && (
            <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-zinc-900 text-white flex flex-col items-center justify-center font-bold">
                <span className="text-[10px] text-zinc-400 uppercase">Slide</span>
                <span className="text-base">{currentSlideIndex + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-zinc-900 truncate">
                  {slides[currentSlideIndex]?.title || `Slide ${currentSlideIndex + 1}`}
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Single slide vector export with 100% font rendering fidelity.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 px-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Selected: <strong className="text-zinc-900">{activeExportIndices.length}</strong> of{' '}
            {slides.length} slides
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirm}
              disabled={activeExportIndices.length === 0 || isExporting}
              className="gap-2 text-xs font-semibold bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              Download PDF ({activeExportIndices.length} {activeExportIndices.length === 1 ? 'Slide' : 'Slides'})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
