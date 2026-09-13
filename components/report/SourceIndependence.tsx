'use client';

import type { SourceIndependenceData } from '@/lib/types';
import {
  Network,
  Copy,
  Building2,
  ShieldCheck,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  MinusCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

// ── Helpers ────────────────────────────────────────────────

function getAlignmentIcon(alignment: string) {
  switch (alignment) {
    case 'Supports': return <CheckCircle2 className="h-4 w-4 text-accent-green" />;
    case 'Contradicts': return <XCircle className="h-4 w-4 text-accent-red" />;
    case 'Neutral': default: return <MinusCircle className="h-4 w-4 text-muted" />;
  }
}

function getReliabilityColor(reliability: string) {
  switch (reliability) {
    case 'High': return 'text-accent-green bg-accent-green/10 border-accent-green/20';
    case 'Medium': return 'text-accent-amber bg-accent-amber/10 border-accent-amber/20';
    case 'Low': return 'text-accent-red bg-accent-red/10 border-accent-red/20';
    default: return 'text-muted bg-card border-card-border';
  }
}

// ── Component ──────────────────────────────────────────────

interface SourceIndependenceProps {
  data: SourceIndependenceData;
}

export default function SourceIndependence({ data }: SourceIndependenceProps) {
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Info className="h-8 w-8 text-muted mb-3" />
        <p className="text-foreground font-medium">No source data available</p>
        <p className="text-sm text-muted max-w-xs mt-1">
          Source independence analysis will populate once the investigation engine processes the case.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-center gap-2">
        <Network className="h-5 w-5 text-accent-blue" />
        <h3 className="text-lg font-bold text-foreground">Source Independence</h3>
      </div>

      {/* ── Explanation ────────────────────────────── */}
      <div className="rounded-xl border border-accent-amber/20 bg-accent-amber-dim p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-accent-amber shrink-0 mt-0.5" />
        <p className="text-sm text-foreground/90 leading-relaxed">
          Source count is not the same as source independence. Multiple pages may repeat one original claim.
        </p>
      </div>

      {/* ── Summary Stats Grid ──────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        
        {/* Total URLs */}
        <div className="rounded-xl border border-card-border bg-card p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-muted">
            <Search className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Total URLs Found</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{data.totalFound}</p>
        </div>

        {/* Independent Clusters */}
        <div className="rounded-xl border border-accent-blue/30 bg-accent-blue/5 p-4 flex flex-col justify-between shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-accent-blue">
            <Network className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Independent Source Clusters</span>
          </div>
          <p className="text-3xl font-bold text-accent-blue">{data.independentClusters}</p>
        </div>

        {/* Copied Sources */}
        <div className="rounded-xl border border-card-border bg-card p-4 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2 text-muted">
            <Copy className="h-4 w-4" />
            <span className="text-xs uppercase tracking-wider font-semibold">Duplicate / Copied</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{data.copiedSources}</p>
          <p className="text-[10px] text-muted mt-1 leading-tight">
            articles repeat the same social-media post
          </p>
        </div>

        {/* Official Sources */}
        <div className="rounded-xl border border-card-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-muted">
              <Building2 className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Official Sources</span>
            </div>
            <p className="text-xl font-bold text-foreground">{data.officialSources}</p>
          </div>
        </div>

        {/* Fact Checks */}
        <div className="rounded-xl border border-card-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-muted">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Fact-Check Sources</span>
            </div>
            <p className="text-xl font-bold text-foreground">{data.factCheckSources}</p>
          </div>
        </div>

        {/* Anonymous Social */}
        <div className="rounded-xl border border-card-border bg-card p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1 text-muted">
              <Users className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Anonymous Social Posts</span>
            </div>
            <p className="text-xl font-bold text-foreground">{data.anonymousSocial}</p>
          </div>
        </div>

      </div>

      {/* ── Source Cards List ──────────────────────── */}
      <div className="mt-8">
        <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Representative Sources</h4>
        <div className="space-y-3">
          {data.sourceCards.map(src => (
            <div key={src.id} className="rounded-xl border border-card-border bg-card p-4 sm:p-5 hover:border-accent-blue/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                
                {/* Header (Publisher + Type/Date) */}
                <div>
                  <h5 className="font-bold text-foreground text-base mb-1">{src.publisher}</h5>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    <span className="font-medium bg-background px-2 py-0.5 rounded border border-card-border">
                      {src.sourceType}
                    </span>
                    <span>•</span>
                    <span>{src.date}</span>
                    <span>•</span>
                    <span className="text-foreground/70">{src.cluster}</span>
                  </div>
                </div>

                {/* Badges (Alignment + Reliability) */}
                <div className="flex items-center gap-2 self-start">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-background border border-card-border text-xs font-medium text-foreground">
                    {getAlignmentIcon(src.alignment)}
                    {src.alignment}
                  </div>
                  <div className={`px-2.5 py-1 rounded border text-xs font-bold ${getReliabilityColor(src.reliability)}`}>
                    {src.reliability} Reliability
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="mt-4 rounded-lg bg-background p-3 border-l-2 border-l-card-border">
                <p className="text-sm text-foreground/80 italic">
                  {src.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
