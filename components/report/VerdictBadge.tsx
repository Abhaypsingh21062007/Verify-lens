import type { LegacyContextVerdict as ContextVerdict, LegacyClaimVerdict as ClaimVerdict, LegacyManipulationVerdict as ManipulationVerdict } from '@/lib/types';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  ShieldX,
  AlertTriangle,
} from 'lucide-react';

type Verdict = ContextVerdict | ClaimVerdict | ManipulationVerdict;

interface VerdictBadgeProps {
  verdict: Verdict;
  size?: 'sm' | 'md' | 'lg';
}

const verdictConfig: Record<string, {
  icon: typeof ShieldCheck;
  color: string;
  bg: string;
  border: string;
  label: string;
}> = {
  // Context verdicts
  verified: { icon: ShieldCheck, color: 'text-accent-green', bg: 'bg-accent-green-dim', border: 'border-accent-green/20', label: 'Verified' },
  partially_verified: { icon: ShieldAlert, color: 'text-accent-amber', bg: 'bg-accent-amber-dim', border: 'border-accent-amber/20', label: 'Partially Verified' },
  uncertain: { icon: ShieldQuestion, color: 'text-accent-amber', bg: 'bg-accent-amber-dim', border: 'border-accent-amber/20', label: 'Uncertain' },
  misleading: { icon: ShieldX, color: 'text-accent-red', bg: 'bg-accent-red-dim', border: 'border-accent-red/20', label: 'Misleading' },
  fabricated: { icon: ShieldX, color: 'text-accent-red', bg: 'bg-accent-red-dim', border: 'border-accent-red/20', label: 'Fabricated' },

  // Claim verdicts
  supported: { icon: ShieldCheck, color: 'text-accent-green', bg: 'bg-accent-green-dim', border: 'border-accent-green/20', label: 'Supported' },
  partially_supported: { icon: ShieldAlert, color: 'text-accent-amber', bg: 'bg-accent-amber-dim', border: 'border-accent-amber/20', label: 'Partially Supported' },
  unverifiable: { icon: ShieldQuestion, color: 'text-accent-amber', bg: 'bg-accent-amber-dim', border: 'border-accent-amber/20', label: 'Unverifiable' },
  false: { icon: ShieldX, color: 'text-accent-red', bg: 'bg-accent-red-dim', border: 'border-accent-red/20', label: 'False' },

  // Manipulation verdicts
  authentic: { icon: ShieldCheck, color: 'text-accent-green', bg: 'bg-accent-green-dim', border: 'border-accent-green/20', label: 'Authentic' },
  likely_authentic: { icon: ShieldCheck, color: 'text-accent-green', bg: 'bg-accent-green-dim', border: 'border-accent-green/20', label: 'Likely Authentic' },
  likely_manipulated: { icon: AlertTriangle, color: 'text-accent-amber', bg: 'bg-accent-amber-dim', border: 'border-accent-amber/20', label: 'Likely Manipulated' },
  manipulated: { icon: ShieldX, color: 'text-accent-red', bg: 'bg-accent-red-dim', border: 'border-accent-red/20', label: 'Manipulated' },
};

const sizeClasses = {
  sm: 'text-xs px-2.5 py-1 gap-1.5',
  md: 'text-sm px-3 py-1.5 gap-2',
  lg: 'text-base px-4 py-2 gap-2.5',
};

const iconSizes = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export default function VerdictBadge({ verdict, size = 'md' }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.color} ${config.bg} ${config.border} ${sizeClasses[size]}`}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
}
