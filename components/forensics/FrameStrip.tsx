import { HeatmapFinding } from '@/lib/types';

interface FrameStripProps {
  findings: HeatmapFinding[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function FrameStrip({ findings, currentTime, onSeek }: FrameStripProps) {
  // Convert timestamps to seconds for demo
  const getSeconds = (ts?: string) => {
    if (!ts) return 0;
    const parts = ts.split(':');
    return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Key Frames</span>
        <span className="text-xs font-mono text-accent-blue">{currentTime.toFixed(1)}s</span>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {findings.map((finding, idx) => {
          const time = getSeconds(finding.timestamp);
          const isActive = Math.abs(currentTime - time) < 1.0;
          
          return (
            <button
              key={finding.id || idx}
              onClick={() => onSeek(time)}
              className={`relative shrink-0 w-24 aspect-video rounded-md overflow-hidden border-2 transition-all ${
                isActive ? 'border-accent-blue opacity-100' : 'border-card-border opacity-60 hover:opacity-100'
              }`}
            >
              <div className="absolute inset-0 bg-zinc-800" />
              <div className="absolute inset-0 bg-zinc-900/50" />
              <div className="absolute bottom-1 right-1 text-[9px] font-mono bg-black/60 px-1 rounded text-white">
                {finding.timestamp}
              </div>
              {isActive && (
                <div className="absolute inset-0 ring-inset ring-2 ring-accent-blue/50" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
