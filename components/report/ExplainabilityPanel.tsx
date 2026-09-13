'use client';

import type { ExplainabilityData, ExplainabilityFinding } from '@/lib/types';
import {
  Eye,
  Volume2,
  MessageSquare,
  AlertCircle,
  Cpu,
  Clock,
  Map,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import HeatmapViewer from '@/components/forensics/HeatmapViewer';
import ForensicHeatmapSlider from '@/components/forensics/ForensicHeatmapSlider';

// ── Metric badge ────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score > 70 ? 'text-accent-red border-accent-red/30 bg-accent-red/10' :
    score > 30 ? 'text-accent-amber border-accent-amber/30 bg-accent-amber/10' :
    'text-accent-green border-accent-green/30 bg-accent-green/10';

  return (
    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg border ${color} shrink-0`}>
      <span className="text-xl font-black leading-none">{score}</span>
      <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80 mt-0.5">Score</span>
    </div>
  );
}

// ── Detail Rows ─────────────────────────────────────────────

function DetailRow({ icon: Icon, label, value }: { icon: typeof Eye, label: string, value: string }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="h-4 w-4 text-muted shrink-0 mt-0.5" />
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-muted block mb-0.5">{label}</span>
        <span className="text-foreground/90 font-medium">{value}</span>
      </div>
    </div>
  );
}

// ── Shared Result Card ──────────────────────────────────────

interface ResultCardProps {
  finding: ExplainabilityFinding;
  region?: string;
  icon: typeof Eye;
  title: string;
  children?: React.ReactNode;
}

function ResultCard({ finding, region, icon: Icon, title, children }: ResultCardProps) {
  return (
    <div className="rounded-xl border border-card-border bg-card overflow-hidden flex flex-col md:flex-row">
      
      {/* Visualizer Area (Left) */}
      <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-card-border bg-background/50 relative overflow-hidden flex flex-col">
        {/* Title header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-3 bg-gradient-to-b from-background/90 to-transparent flex items-center gap-2">
          <Icon className="h-4 w-4 text-accent-blue" />
          <h4 className="font-bold text-sm text-foreground">{title}</h4>
        </div>
        
        {/* Placeholder / Content */}
        <div className="flex-1 flex items-center justify-center min-h-[220px] p-4 pt-12 relative">
          {children}
        </div>
      </div>

      {/* Details Area (Right) */}
      <div className="w-full md:w-3/5 p-5 flex flex-col justify-between">
        <div className="space-y-4">
          
          <div className="flex gap-4">
            <ScoreBadge score={finding.score} />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                {finding.explanation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-card-border/50">
            <DetailRow icon={Cpu} label="Model Version" value={finding.modelVersion} />
            <DetailRow icon={Clock} label="Interval" value={finding.interval} />
            {region && (
              <DetailRow icon={Map} label="Region" value={region} />
            )}
          </div>
        </div>

        {/* Limitation box */}
        <div className="mt-5 rounded-lg bg-background/50 border border-card-border p-3 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-muted shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted block mb-0.5">Known Limitation</span>
            <span className="text-xs text-foreground/70 leading-relaxed">{finding.limitation}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── Main Component ──────────────────────────────────────────

interface ExplainabilityPanelProps {
  data?: ExplainabilityData;
}

export default function ExplainabilityPanel({ data }: ExplainabilityPanelProps) {
  const [audioOpacities, setAudioOpacities] = useState<number[]>([]);
  const [visualOpacities, setVisualOpacities] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setAudioOpacities(Array.from({ length: 20 }).map(() => Math.random() * 0.5 + 0.3));
      setVisualOpacities(Array.from({ length: 20 }).map(() => Math.random() * 0.5 + 0.3));
    }, 0);
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Info className="h-8 w-8 text-muted mb-3" />
        <p className="text-foreground font-medium">No explainability data available</p>
        <p className="text-sm text-muted max-w-xs mt-1">
          Detailed analysis will populate once the investigation engine processes the case.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Warning */}
      <div className="rounded-xl border border-accent-amber/20 bg-accent-amber-dim p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-accent-amber shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-accent-amber mb-1">Model Indicators Only</h4>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Do not present heatmaps or component scores as absolute proof of manipulation. 
            They are indicators of statistical anomalies that require contextual interpretation.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 1. Visual Forensics Split-Screen & Heatmap Slider (Interactive) */}
        <div>
          <ForensicHeatmapSlider score={data.visual?.score || 85} />
        </div>

        {/* 2. Audio Analysis */}
        <ResultCard
          title="Synthetic Voice Analysis"
          icon={Volume2}
          finding={data.audio}
        >
          <div className="w-full flex items-center justify-center gap-1 h-20 opacity-80">
            {Array.from({ length: 40 }).map((_, i) => {
              // Generate a pseudo-random waveform
              const height = Math.sin(i * 0.4) * 50 + Math.cos(i * 0.9) * 30 + 10;
              const h = Math.abs(height) + 10;
              // Mark suspicious interval (simulated)
              const isSuspicious = data.audio.score > 50 && i > 15 && i < 25;
              const bg = isSuspicious ? 'bg-accent-red' : 'bg-accent-blue/60';
              return (
                <div
                  key={i}
                  className={`w-1.5 rounded-full ${bg} transition-all duration-300`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
        </ResultCard>

        {/* 3. Lip-Sync Analysis */}
        <ResultCard
          title="Audio-Visual Synchronization"
          icon={MessageSquare}
          finding={data.lipSync}
        >
          <div className="w-full relative h-16 border-y border-card-border/50 flex flex-col justify-center">
            {/* Center line */}
            <div className="absolute left-0 right-0 top-1/2 h-px bg-card-border/50 -translate-y-1/2" />
            
            {/* Audio track line */}
            <div className="flex items-center gap-1 h-3 mb-2 px-4 relative z-10">
              <span className="text-[9px] font-mono text-muted absolute -left-1">A</span>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={`a-${i}`} className="h-full flex-1 bg-accent-blue/40 rounded-sm" style={{ opacity: audioOpacities[i] ?? 0.5 }} />
              ))}
            </div>
            
            {/* Visual track line */}
            <div className="flex items-center gap-1 h-3 px-4 relative z-10">
              <span className="text-[9px] font-mono text-muted absolute -left-1">V</span>
              {Array.from({ length: 20 }).map((_, i) => {
                const shift = data.lipSync.score > 70 && (i === 10 || i === 11);
                return (
                  <div 
                    key={`v-${i}`} 
                    className={`h-full flex-1 rounded-sm ${shift ? 'bg-accent-red/60 transform translate-x-1' : 'bg-accent-green/40'}`} 
                    style={{ opacity: visualOpacities[i] ?? 0.5 }} 
                  />
                );
              })}
            </div>

            {data.lipSync.score > 70 && (
              <div className="absolute top-0 bottom-0 left-[50%] w-[10%] bg-accent-red/10 border-x border-accent-red/30" />
            )}
          </div>
        </ResultCard>

      </div>
    </div>
  );
}
