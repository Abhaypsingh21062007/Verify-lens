import React from 'react';
import { EvidenceItem } from '@/lib/types';
import { ExternalLink, Link as LinkIcon, FileText, Image as ImageIcon, Code, ShieldCheck, Database } from 'lucide-react';

interface ProofsPanelProps {
  evidence: EvidenceItem[];
}

export default function ProofsPanel({ evidence }: ProofsPanelProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="rounded-xl border border-card-border bg-card p-8 text-center text-muted">
        <p>No concrete proofs or citations were generated for this report.</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'link': return <LinkIcon className="h-5 w-5 text-accent-blue" />;
      case 'text': return <FileText className="h-5 w-5 text-accent-green" />;
      case 'image': return <ImageIcon className="h-5 w-5 text-accent-amber" />;
      case 'metadata': return <Code className="h-5 w-5 text-purple-400" />;
      case 'forensic': return <Database className="h-5 w-5 text-accent-red" />;
      default: return <ShieldCheck className="h-5 w-5 text-foreground" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-foreground">Proofs & Citations</h3>
        <p className="text-sm text-muted max-w-3xl">
          The following evidence, documents, and sources were used by VerifyLens to reach the final verdict. Click on any URL to review the original source.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {evidence.map((item, index) => (
          <div key={item.id || index} className="rounded-xl border border-card-border bg-card overflow-hidden hover:border-accent-blue/30 transition-colors">
            <div className="p-5 flex flex-col sm:flex-row gap-5">
              <div className="shrink-0 pt-1">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border border-card-border">
                  {getIcon(item.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                    {item.source}
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-background border border-card-border text-muted">
                      {item.type}
                    </span>
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Credibility Score</span>
                    <div className="h-1.5 w-16 bg-background rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.confidence > 75 ? 'bg-accent-green' : item.confidence > 40 ? 'bg-accent-amber' : 'bg-accent-red'}`} 
                        style={{ width: `${item.confidence}%` }} 
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground">{item.confidence}%</span>
                  </div>
                </div>

                <div className="bg-background/50 rounded-lg p-4 border border-card-border/50 text-sm text-foreground/90 leading-relaxed italic border-l-2 border-l-accent-blue mb-4">
                  "{item.content}"
                </div>

                {item.url && (
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-accent-blue hover:text-accent-blue/80 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span className="truncate max-w-[250px] sm:max-w-[400px]">{item.url}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
