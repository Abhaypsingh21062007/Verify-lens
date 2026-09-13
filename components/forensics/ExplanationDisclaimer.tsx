import { Info } from 'lucide-react';

export default function ExplanationDisclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-accent-amber/20 bg-accent-amber-dim p-3">
      <Info className="h-4 w-4 text-accent-amber shrink-0 mt-0.5" />
      <div>
        <p className="text-xs font-semibold text-accent-amber uppercase tracking-wider mb-0.5">
          Model attention map — not proof of manipulation.
        </p>
        <p className="text-[11px] text-foreground/80 leading-relaxed">
          These visual overlays represent regions where the AI model detected statistical anomalies. 
          They are indicators of potential manipulation, but must be interpreted in context with other evidence.
        </p>
      </div>
    </div>
  );
}
