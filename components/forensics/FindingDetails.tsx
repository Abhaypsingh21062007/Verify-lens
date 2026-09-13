import { HeatmapFinding } from '@/lib/types';
import { Cpu, AlertTriangle, ShieldAlert } from 'lucide-react';

interface FindingDetailsProps {
  finding: HeatmapFinding | null;
}

export default function FindingDetails({ finding }: FindingDetailsProps) {
  if (!finding) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center border-t border-card-border/50">
        <p className="text-sm text-muted">Select a finding or key frame to view details.</p>
      </div>
    );
  }

  const scoreColor = 
    finding.score > 75 ? 'text-accent-red border-accent-red/30 bg-accent-red/10' :
    finding.score > 50 ? 'text-accent-amber border-accent-amber/30 bg-accent-amber/10' :
    'text-accent-green border-accent-green/30 bg-accent-green/10';

  return (
    <div className="space-y-4 border-t border-card-border/50 pt-4 mt-4">
      <div className="flex gap-4 items-start">
        <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border ${scoreColor} shrink-0`}>
          <span className="text-xl font-black leading-none">{finding.score}</span>
          <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">Risk</span>
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
            Region: {finding.region}
            {finding.severity === 'high' && <ShieldAlert className="w-3.5 h-3.5 text-accent-red" />}
          </h4>
          <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
            {finding.reason}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-muted">
          <Cpu className="w-3.5 h-3.5 shrink-0" />
          <span>Model: {finding.modelName} (v{finding.modelVersion})</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <span className="font-semibold">Confidence:</span>
          <span>{finding.confidence}%</span>
        </div>
      </div>

      <div className="rounded-lg bg-background/50 border border-card-border p-3 flex items-start gap-2.5">
        <AlertTriangle className="h-3.5 w-3.5 text-muted shrink-0 mt-0.5" />
        <div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-muted block mb-0.5">Known Limitation</span>
          <span className="text-xs text-foreground/70 leading-relaxed">{finding.limitation}</span>
        </div>
      </div>
    </div>
  );
}
