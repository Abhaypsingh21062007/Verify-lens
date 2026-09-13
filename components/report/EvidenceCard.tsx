import type { LegacyEvidenceSentiment as EvidenceSentiment } from '@/lib/types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';

interface EvidenceCardProps {
  title: string;
  description: string;
  sentiment: EvidenceSentiment;
  confidence: number;
  source: string;
  details?: string;
}

const sentimentConfig: Record<
  EvidenceSentiment,
  { icon: typeof CheckCircle2; color: string; bg: string; border: string; label: string }
> = {
  supporting: {
    icon: CheckCircle2,
    color: 'text-accent-green',
    bg: 'bg-accent-green-dim',
    border: 'border-accent-green/20',
    label: 'Supporting',
  },
  contradicting: {
    icon: XCircle,
    color: 'text-accent-red',
    bg: 'bg-accent-red-dim',
    border: 'border-accent-red/20',
    label: 'Contradicting',
  },
  uncertain: {
    icon: AlertTriangle,
    color: 'text-accent-amber',
    bg: 'bg-accent-amber-dim',
    border: 'border-accent-amber/20',
    label: 'Uncertain',
  },
  neutral: {
    icon: Info,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue-dim',
    border: 'border-accent-blue/20',
    label: 'Neutral',
  },
};

export default function EvidenceCard({
  title,
  description,
  sentiment,
  confidence,
  source,
}: EvidenceCardProps) {
  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-200 hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${config.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <span
              className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color} ${config.bg} border ${config.border}`}
            >
              {config.label}
            </span>
          </div>
          <p className="text-sm text-muted leading-relaxed mb-2">{description}</p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>Confidence: <strong className="text-foreground">{confidence}%</strong></span>
            <span>Source: <strong className="text-foreground">{source}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
