import { HeatmapMode } from '@/lib/types';
import { Layers, Image as ImageIcon, SplitSquareHorizontal } from 'lucide-react';

interface HeatmapControlsProps {
  mode: HeatmapMode;
  onModeChange: (mode: HeatmapMode) => void;
}

export default function HeatmapControls({ mode, onModeChange }: HeatmapControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-background/50 border border-card-border rounded-lg p-1">
      <button
        onClick={() => onModeChange('original')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          mode === 'original' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'
        }`}
      >
        <ImageIcon className="w-3.5 h-3.5" />
        Original
      </button>
      <button
        onClick={() => onModeChange('overlay')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          mode === 'overlay' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        Overlay
      </button>
      <button
        onClick={() => onModeChange('side-by-side')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          mode === 'side-by-side' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'
        }`}
      >
        <SplitSquareHorizontal className="w-3.5 h-3.5" />
        Split
      </button>
    </div>
  );
}
