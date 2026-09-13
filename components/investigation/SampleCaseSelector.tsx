'use client';

import { useTransition } from 'react';
import { Play, Sparkles, AlertTriangle, HelpCircle } from 'lucide-react';
import { startSampleInvestigation } from '@/app/investigate/actions';

const sampleCases = [
  {
    id: 'misleading-info-video',
    title: 'Likely manipulated video',
    description: 'A heavily edited video spreading false information with synthetic audio.',
    icon: Sparkles,
    color: 'text-accent-amber',
    bg: 'bg-accent-amber-dim',
    border: 'border-accent-amber/30'
  },
  {
    id: 'synthetic-interview',
    title: 'Likely synthetic interview',
    description: 'A short interview with face, voice, and lip-sync inconsistencies.',
    icon: AlertTriangle,
    color: 'text-accent-red',
    bg: 'bg-accent-red-dim',
    border: 'border-accent-red/30'
  },
  {
    id: 'insufficient-evidence',
    title: 'Insufficient evidence',
    description: 'A compressed screenshot with no reliable source history.',
    icon: HelpCircle,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue-dim',
    border: 'border-accent-blue/30'
  }
];

export default function SampleCaseSelector() {
  const [isPending, startTransition] = useTransition();

  const handleSelectCase = (caseId: string) => {
    startTransition(() => {
      startSampleInvestigation(caseId);
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground mb-4">Or try a sample case</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sampleCases.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              disabled={isPending}
              className={`group flex flex-col items-start text-left rounded-xl border border-card-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-muted/40 hover:shadow-lg ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`mb-3 flex items-center justify-center w-10 h-10 rounded-lg ${c.bg} ${c.color} border ${c.border}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-accent-blue transition-colors">
                {c.title}
              </h3>
              <p className="text-xs text-muted leading-relaxed mb-4 flex-1">
                {c.description}
              </p>
              
              <div className="mt-auto flex items-center text-xs font-medium text-accent-blue opacity-80 group-hover:opacity-100 transition-opacity">
                <Play className="h-3.5 w-3.5 mr-1" />
                Investigate
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
