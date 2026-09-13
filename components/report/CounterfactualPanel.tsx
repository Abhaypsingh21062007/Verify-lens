'use client';

import { useState } from 'react';
import type { CounterfactualResult } from '@/lib/types';
import {
  FlaskConical,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Info,
  Tag,
} from 'lucide-react';

// ── Verdict color helper ────────────────────────────────────

function getVerdictStyle(verdict: string) {
  const lower = verdict.toLowerCase();
  if (lower.includes('misleading') || lower.includes('manipulated'))
    return { text: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' };
  if (lower.includes('authentic') || lower.includes('consistent') || lower.includes('no major'))
    return { text: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' };
  return { text: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/30' };
}

// ── Metric bar ──────────────────────────────────────────────

function MetricBar({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  // For "context risk", higher is worse, so invert the color logic
  const color = invert
    ? value > 60 ? 'bg-accent-red' : value > 30 ? 'bg-accent-amber' : 'bg-accent-green'
    : value > 70 ? 'bg-accent-green' : value > 40 ? 'bg-accent-amber' : 'bg-accent-red';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted">{label}</span>
        <span className="text-xs font-bold text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-background/60 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────

interface CounterfactualPanelProps {
  counterfactuals: CounterfactualResult[];
}

export default function CounterfactualPanel({ counterfactuals }: CounterfactualPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(counterfactuals[0]?.id ?? null);

  if (counterfactuals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Info className="h-8 w-8 text-muted mb-3" />
        <p className="text-foreground font-medium">No counterfactual data available</p>
        <p className="text-sm text-muted max-w-xs mt-1">
          Counterfactual analysis will populate once the investigation engine processes the case.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-accent-blue" />
        <h3 className="text-lg font-bold text-foreground">Counterfactual Analysis</h3>
      </div>

      <p className="text-sm text-muted leading-relaxed">
        What would the verdict be if we changed one aspect of this investigation?
        Each variant below modifies a single factor while holding others constant.
      </p>

      {/* ── Variant Cards ────────────────────────────── */}
      <div className="space-y-3">
        {counterfactuals.map((cf, i) => {
          const isExpanded = expandedId === cf.id;
          const style = getVerdictStyle(cf.verdict);
          const isBaseline = i === 0;

          return (
            <div
              key={cf.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded ? `${style.border} shadow-md` : 'border-card-border'
              }`}
            >
              {/* Header – always visible */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : cf.id)}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-card-hover/30 transition-colors"
              >
                {/* Number circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  isBaseline ? `${style.bg} ${style.text}` : 'bg-background text-muted border border-card-border'
                }`}>
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <h4 className="text-sm font-semibold text-foreground truncate">{cf.scenario}</h4>
                    {isBaseline && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card border border-card-border text-muted uppercase tracking-wider w-fit">
                        Baseline
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold ${style.text}`}>{cf.verdict}</span>
                    <span className="text-[10px] text-muted">({cf.confidence}% confidence)</span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-5 pt-1 space-y-4 border-t border-card-border animate-fade-in">
                  {/* Explanation */}
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {cf.explanation}
                  </p>

                  {/* Changed factors */}
                  <div>
                    <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Changed Factors</p>
                    <div className="flex flex-wrap gap-2">
                      {cf.changedFactors.map((factor) => (
                        <span
                          key={factor}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-background border border-card-border text-foreground"
                        >
                          <Tag className="h-3 w-3 text-muted" />
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="rounded-lg bg-background/50 border border-card-border p-4 space-y-3">
                    <p className="text-xs font-medium text-muted uppercase tracking-wider">Metrics for this variant</p>
                    <MetricBar label="File Authenticity" value={cf.metrics.fileAuthenticity} />
                    <MetricBar label="Claim Accuracy" value={cf.metrics.claimAccuracy} />
                    <MetricBar label="Context Risk" value={cf.metrics.contextRisk} invert />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Comparison Chart ─────────────────────────── */}
      <div className="rounded-xl border border-card-border bg-card p-5">
        <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Comparison Chart</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left py-2 pr-4 text-muted font-medium">Variant</th>
                <th className="text-right py-2 px-3 text-muted font-medium">File Auth.</th>
                <th className="text-right py-2 px-3 text-muted font-medium">Claim Acc.</th>
                <th className="text-right py-2 px-3 text-muted font-medium">Context Risk</th>
                <th className="text-left py-2 pl-4 text-muted font-medium">Verdict</th>
              </tr>
            </thead>
            <tbody>
              {counterfactuals.map((cf, i) => {
                const style = getVerdictStyle(cf.verdict);
                return (
                  <tr
                    key={cf.id}
                    className={`border-b border-card-border/50 last:border-0 ${i === 0 ? 'bg-card-hover/20' : ''}`}
                  >
                    <td className="py-2.5 pr-4 font-medium text-foreground whitespace-nowrap">
                      {cf.scenario}
                      {i === 0 && <span className="ml-1.5 text-[10px] text-muted">(baseline)</span>}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-foreground">{cf.metrics.fileAuthenticity}%</td>
                    <td className="py-2.5 px-3 text-right font-mono text-foreground">{cf.metrics.claimAccuracy}%</td>
                    <td className="py-2.5 px-3 text-right font-mono text-foreground">{cf.metrics.contextRisk}%</td>
                    <td className={`py-2.5 pl-4 font-semibold ${style.text} whitespace-nowrap`}>{cf.verdict}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Interpretation ────────────────────────────── */}
      <div className="rounded-xl border border-accent-green/20 bg-accent-green-dim p-5 flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-accent-green shrink-0 mt-0.5" />
        <div>
          <p className="text-xs uppercase tracking-wider text-accent-green font-bold mb-1">Key Interpretation</p>
          <p className="text-sm text-foreground leading-relaxed">
            The media appears authentic, but the current caption changes its meaning.
          </p>
        </div>
      </div>
    </div>
  );
}
