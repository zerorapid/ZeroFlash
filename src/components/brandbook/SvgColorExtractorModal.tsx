import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { norm } from '../../utils/colorUtils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

interface SvgColorExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  detectedColors: { hex: string; percentage: number }[];
  onApplyPalette: (colors: string[]) => void;
}

export const SvgColorExtractorModal: React.FC<SvgColorExtractorModalProps> = ({
  isOpen,
  onClose,
  detectedColors,
  onApplyPalette,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-zinc-100 text-zinc-950">
              <Sparkles className="w-4 h-4" />
            </span>
            <DialogTitle>Detected Logo Colors</DialogTitle>
          </div>
          <DialogDescription>
            We extracted dominant color values directly from your uploaded SVG vector artwork.
            Sync your entire brand book to this palette with one click.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {detectedColors.slice(0, 5).map((c, i) => (
            <Card key={i} className="bg-zinc-50/70 border-zinc-200">
              <CardContent className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-7 h-7 rounded-md border border-black/10 shadow-xs"
                    style={{ background: c.hex }}
                  />
                  <div>
                    <span className="text-xs font-mono font-bold text-zinc-900 block leading-none">
                      {norm(c.hex)}
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      {i === 0 ? 'Dominant Primary' : i === 1 ? 'Secondary Accent' : `Accent ${i}`}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {c.percentage}%
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Keep Existing
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onApplyPalette(detectedColors.map(c => c.hex))}
            className="gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Detected Colors</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
