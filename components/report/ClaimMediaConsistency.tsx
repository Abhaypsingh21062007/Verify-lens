'use client';

import type { ClaimMediaConsistencyData, MismatchLevel, ComparisonCard } from '@/lib/types';
import {
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  MapPin,
  FileText,
  Tag,
  Lightbulb,
  Quote,
  HelpCircle,
} from 'lucide-react';

interface ClaimMediaConsistencyProps {
  data: ClaimMediaConsistencyData;
}

// ── Mismatch level styling ─────────────────────────────────
function getMismatchStyles(level: MismatchLevel) {
  switch (level) {
    case 'High':
      return {
        bg: 'bg-accent-red-dim',
        text: 'text-accent-red',
        border: 'border-accent-red/20',
        barWidth: 'w-full',
        barColor: 'bg-accent-red',
      };
    case 'Medium':
      return {
        bg: 'bg-accent-amber-dim',
        text: 'text-accent-amber',
        border: 'border-accent-amber/20',
        barWidth: 'w-2/3',
        barColor: 'bg-accent-amber',
      };
    case 'Low':
      return {
        bg: 'bg-accent-green-dim',
        text: 'text-accent-green',
        border: 'border-accent-green/20',
        barWidth: 'w-1/3',
        barColor: 'bg-accent-green',
      };
    case 'None':
      return {
        bg: 'bg-accent-green-dim',
        text: 'text-accent-green',
        border: 'border-accent-green/20',
        barWidth: 'w-0',
        barColor: 'bg-accent-green',
      };
    case 'Unclear':
    default:
      return {
        bg: 'bg-accent-blue-dim',
        text: 'text-accent-blue',
        border: 'border-accent-blue/20',
        barWidth: 'w-1/2',
        barColor: 'bg-accent-blue',
      };
  }
}

function getMismatchIcon(dimension: string) {
  switch (dimension.toLowerCase()) {
    case 'date': return Calendar;
    case 'location': return MapPin;
    case 'event': return FileText;
    case 'caption': return Tag;
    default: return HelpCircle;
  }
}

// ── Visual comparison card ──────────────────────────────────
function SourceCard({ card, variant }: { card: ComparisonCard; variant: 'current' | 'earlier' }) {
  const isCurrent = variant === 'current';
  const borderColor = isCurrent ? 'border-accent-amber/30' : 'border-accent-blue/30';
  const headerBg = isCurrent ? 'bg-accent-amber/10' : 'bg-accent-blue/10';
  const headerText = isCurrent ? 'text-accent-amber' : 'text-accent-blue';
  const labelBg = isCurrent ? 'bg-accent-amber-dim' : 'bg-accent-blue-dim';

  return (
    <div className={`rounded-xl border ${borderColor} bg-card overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 ${headerBg} flex items-center justify-between`}>
        <span className={`text-xs font-bold uppercase tracking-wider ${headerText}`}>
          {card.label}
        </span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${labelBg} ${headerText}`}>
          {card.sourceLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Caption */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted mb-1 font-medium">Caption</p>
          <p className="text-sm text-foreground leading-relaxed italic border-l-2 border-card-border pl-3">
            &quot;{card.caption}&quot;
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3.5 w-3.5 text-muted shrink-0" />
          <span className="text-foreground">{card.date}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />
          <span className="text-foreground">{card.location}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────
export default function ClaimMediaConsistency({ data }: ClaimMediaConsistencyProps) {
  return (
    <div className="space-y-6">

      {/* ── Claim vs. Evidence Summary ────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <ArrowRightLeft className="h-4.5 w-4.5 text-accent-blue" />
          <h3 className="text-lg font-bold text-foreground">Claim vs. Media Consistency</h3>
        </div>

        {/* Claim quote */}
        <div className="rounded-xl border border-accent-amber/20 bg-accent-amber-dim p-4">
          <div className="flex items-start gap-3">
            <Quote className="h-4 w-4 text-accent-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-accent-amber font-bold mb-1">Claim says</p>
              <p className="text-sm text-foreground italic leading-relaxed">
                &quot;{data.claimText}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Evidence summary */}
        <div className="rounded-xl border border-accent-blue/20 bg-accent-blue-dim p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-accent-blue font-bold mb-1">Evidence suggests</p>
              <p className="text-sm text-foreground leading-relaxed">
                {data.evidenceSummary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual Comparison Cards ───────────────────── */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Source Comparison
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SourceCard card={data.currentPost} variant="current" />
          <SourceCard card={data.earlierSource} variant="earlier" />
        </div>
      </div>

      {/* ── Mismatch Cards ────────────────────────────── */}
      <div>
        <h4 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">
          Mismatch Assessment
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.mismatches.map((m) => {
            const styles = getMismatchStyles(m.level);
            const Icon = getMismatchIcon(m.dimension);
            return (
              <div
                key={m.dimension}
                className={`rounded-xl border ${styles.border} ${styles.bg} p-4 space-y-2.5`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${styles.text}`} />
                    <span className="text-sm font-semibold text-foreground">{m.dimension} mismatch</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${styles.bg} ${styles.text} border ${styles.border}`}>
                    {m.level}
                  </span>
                </div>

                {/* Mini severity bar */}
                <div className="h-1 rounded-full bg-background/50 overflow-hidden">
                  <div className={`h-full rounded-full ${styles.barColor} ${styles.barWidth} transition-all duration-500`} />
                </div>

                {m.detail && (
                  <p className="text-xs text-muted leading-relaxed">{m.detail}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Interpretation Box ────────────────────────── */}
      <div className="rounded-xl border border-accent-green/20 bg-accent-green-dim p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider text-accent-green font-bold mb-1.5">Interpretation</p>
            <p className="text-sm text-foreground leading-relaxed">
              {data.interpretation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
