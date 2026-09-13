import React from 'react';
import { Mic, Languages, FileText, CheckCircle, Info } from 'lucide-react';
import { VoiceAnalysisData } from '@/lib/types';

interface TranscriptPanelProps {
  data: VoiceAnalysisData;
}

export default function TranscriptPanel({ data }: TranscriptPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Attribution Card */}
      <div className="flex items-center gap-3 bg-card border border-card-border rounded-xl p-4 shadow-sm">
        <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
          <Mic className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Speech-to-text powered by Gnani AI</p>
          <p className="text-xs text-muted">Provider: {data.providerName}</p>
        </div>
      </div>

      {/* Warning Explanation */}
      <div className="rounded-xl border border-accent-blue/20 bg-accent-blue/5 p-4 flex gap-3">
        <Info className="h-5 w-5 text-accent-blue shrink-0" />
        <p className="text-xs text-foreground/80 leading-relaxed">
          <span className="font-semibold text-accent-blue">VerifyLens Notice: </span>
          Gnani AI helps VerifyLens understand what is being said in multilingual audio. It does not determine whether the voice is authentic or whether the claim is true. VerifyLens separately analyzes audio authenticity and retrieves evidence for claim verification.
        </p>
      </div>

      {/* Transcript Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Languages className="h-4 w-4 text-muted" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Original Transcript</h3>
          </div>
          <p className="text-sm text-foreground italic border-l-2 border-muted pl-3 leading-relaxed">
            "{data.transcript}"
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>Detected: <span className="font-medium text-foreground">{data.language}</span></span>
            <span>Confidence: <span className="font-medium text-accent-green">{data.confidence}%</span></span>
          </div>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-muted" />
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">English Meaning</h3>
          </div>
          <p className="text-sm text-foreground font-medium">
            "{data.englishMeaning}"
          </p>
        </div>
      </div>

      {/* Extracted Claims */}
      <div className="rounded-xl border border-card-border bg-card p-5">
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-accent-blue" />
          Extracted Claims for Verification
        </h3>
        <ul className="space-y-3">
          {data.extractedClaims.map((claim, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-accent-amber/20 text-accent-amber text-[10px] font-bold">
                {index + 1}
              </span>
              <div>
                <p className="text-sm text-foreground">{claim}</p>
                <p className="text-xs text-accent-amber mt-0.5 font-medium">Status: Not independently verified</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
