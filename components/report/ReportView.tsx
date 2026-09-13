'use client';

import { useState } from 'react';
import type { InvestigationReport } from '@/lib/types';
import { getVerdictLabel, getVerdictColor, getConfidenceLabel } from '@/lib/types';
import ClaimMediaConsistency from './ClaimMediaConsistency';
import EvidenceGraph from './EvidenceGraph';
import MediaTimeline from './MediaTimeline';
import CounterfactualPanel from './CounterfactualPanel';
import SourceIndependence from './SourceIndependence';
import ExplainabilityPanel from './ExplainabilityPanel';
import ProvenancePassport from './ProvenancePassport';
import TranscriptPanel from './TranscriptPanel';
import { 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  Info,
  FileImage,
  MessageSquare,
  History,
  Scale,
  AlertTriangle
} from 'lucide-react';

interface ReportViewProps {
  report: InvestigationReport;
  isShared?: boolean;
}

export default function ReportView({ report, isShared = false }: ReportViewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  const colorName = getVerdictColor(report.verdict);
  
  // Choose icon based on verdict category
  const VerdictIcon = 
    colorName === 'green' ? ShieldCheck :
    colorName === 'red' || colorName === 'amber' ? ShieldAlert :
    HelpCircle;

  // Generate specific explanation if requested
  let explanation = report.summary;
  let largeLabel = getVerdictLabel(report.verdict);

  if (report.investigationId === 'real-false-context') {
    largeLabel = 'REAL MEDIA, FALSE CONTEXT';
    explanation = 'The file appears authentic, but the date and location in the attached claim are not supported.';
  } else {
    // Optionally format other labels
    largeLabel = largeLabel.toUpperCase();
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'graph', label: 'Evidence graph' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'explainability', label: 'Explainability' },
    { id: 'counterfactual', label: 'Counterfactual' },
    { id: 'provenance', label: 'Provenance' },
    { id: 'sources', label: 'Sources' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      {isShared && (
        <div className="rounded-xl border border-accent-amber/30 bg-accent-amber-dim p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent-amber shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-accent-amber leading-relaxed">
            This report is evidence-based and may require human review.
          </p>
        </div>
      )}

      {report.requiresHumanReview && !isShared && (
        <div className="rounded-xl border border-accent-amber/40 bg-accent-amber-dim/50 p-4 flex items-start gap-3 animate-pulse">
          <AlertTriangle className="h-5 w-5 text-accent-amber shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-accent-amber leading-relaxed">
            Human Review Recommended: The analysis produced conflicting evidence or low-confidence indicators. Please interpret these results carefully.
          </p>
        </div>
      )}

      {/* ── Main Verdict Card ────────────────────────────── */}
      <section className={`rounded-2xl border bg-card p-6 sm:p-8 relative overflow-hidden
        ${colorName === 'green' ? 'border-accent-green/30 shadow-lg shadow-accent-green/10' : ''}
        ${colorName === 'amber' ? 'border-accent-amber/30 shadow-lg shadow-accent-amber/10' : ''}
        ${colorName === 'red' ? 'border-accent-red/30 shadow-lg shadow-accent-red/10' : ''}
        ${colorName === 'blue' ? 'border-accent-blue/30 shadow-lg shadow-accent-blue/10' : ''}
      `}>
        {/* Subtle background glow based on verdict */}
        <div className={`absolute top-0 right-0 w-64 h-64 -mr-16 -mt-16 rounded-full blur-3xl opacity-10 pointer-events-none
          ${colorName === 'green' ? 'bg-accent-green' : ''}
          ${colorName === 'amber' ? 'bg-accent-amber' : ''}
          ${colorName === 'red' ? 'bg-accent-red' : ''}
          ${colorName === 'blue' ? 'bg-accent-blue' : ''}
        `} />

        <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
          <div className={`flex items-center justify-center w-16 h-16 rounded-2xl shrink-0
            ${colorName === 'green' ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' : ''}
            ${colorName === 'amber' ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' : ''}
            ${colorName === 'red' ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' : ''}
            ${colorName === 'blue' ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20' : ''}
          `}>
            <VerdictIcon className="h-8 w-8" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className={`text-2xl sm:text-3xl font-black tracking-tight
                ${colorName === 'green' ? 'text-accent-green' : ''}
                ${colorName === 'amber' ? 'text-accent-amber' : ''}
                ${colorName === 'red' ? 'text-accent-red' : ''}
                ${colorName === 'blue' ? 'text-accent-blue' : ''}
              `}>
                {largeLabel}
              </h1>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider
                ${colorName === 'green' ? 'bg-accent-green/10 text-accent-green' : ''}
                ${colorName === 'amber' ? 'bg-accent-amber/10 text-accent-amber' : ''}
                ${colorName === 'red' ? 'bg-accent-red/10 text-accent-red' : ''}
                ${colorName === 'blue' ? 'bg-accent-blue/10 text-accent-blue' : ''}
              `}>
                Confidence: {getConfidenceLabel((report.fileAuthenticity + report.claimAccuracy + report.provenanceConfidence + report.evidenceStrength) / 4)}
              </span>
            </div>
            
            <p className="text-foreground text-lg leading-relaxed max-w-3xl">
              {explanation}
            </p>
          </div>
        </div>
      </section>

      {/* ── Metric Cards ────────────────────────────── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* File Authenticity */}
        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileImage className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">File Authenticity</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-foreground">{report.fileAuthenticity}%</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${report.fileAuthenticity > 70 ? 'bg-accent-green' : report.fileAuthenticity > 40 ? 'bg-accent-amber' : 'bg-accent-red'}`} style={{ width: `${report.fileAuthenticity}%` }} />
          </div>
        </div>

        {/* Claim Accuracy */}
        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Claim Accuracy</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-foreground">{report.claimAccuracy}%</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${report.claimAccuracy > 70 ? 'bg-accent-green' : report.claimAccuracy > 40 ? 'bg-accent-amber' : 'bg-accent-red'}`} style={{ width: `${report.claimAccuracy}%` }} />
          </div>
        </div>

        {/* Provenance */}
        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <History className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Provenance</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-foreground">{report.provenanceConfidence}%</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${report.provenanceConfidence > 70 ? 'bg-accent-green' : report.provenanceConfidence > 40 ? 'bg-accent-amber' : 'bg-accent-red'}`} style={{ width: `${report.provenanceConfidence}%` }} />
          </div>
        </div>

        {/* Evidence Strength */}
        <div className="rounded-xl border border-card-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-4 w-4 text-muted" />
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Evidence Strength</h3>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-foreground">{report.evidenceStrength}%</span>
          </div>
          <div className="mt-3 h-1.5 w-full bg-background rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${report.evidenceStrength > 70 ? 'bg-accent-green' : report.evidenceStrength > 40 ? 'bg-accent-amber' : 'bg-accent-red'}`} style={{ width: `${report.evidenceStrength}%` }} />
          </div>
        </div>

      </section>

      {/* ── Disclaimer ────────────────────────────── */}
      <div className="flex items-start gap-3 rounded-lg bg-background p-4 text-sm text-muted">
        <Info className="h-5 w-5 shrink-0 text-accent-blue" />
        <p>These indicators summarize available evidence. They are not absolute proof.</p>
      </div>

      {/* ── Report Tabs ────────────────────────────── */}
      <section className="rounded-2xl border border-card-border bg-card overflow-hidden">
        <div className="border-b border-card-border overflow-x-auto">
          <div className="flex w-max min-w-full px-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2
                  ${activeTab === tab.id 
                    ? 'border-accent-blue text-foreground' 
                    : 'border-transparent text-muted hover:text-foreground hover:border-card-border'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 min-h-[300px]">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Voice Analysis Transcript Panel */}
              {report.voiceAnalysis && (
                <TranscriptPanel data={report.voiceAnalysis} />
              )}
              
              {report.voiceAnalysis && (report.claimMediaConsistency || report.findings.length > 0) && (
                <hr className="border-card-border" />
              )}

              {/* Claim vs Media Consistency */}
              {report.claimMediaConsistency && (
                <ClaimMediaConsistency data={report.claimMediaConsistency} />
              )}

              {/* Separator */}
              {report.claimMediaConsistency && report.findings.length > 0 && (
                <hr className="border-card-border" />
              )}

              {/* Findings */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground">Findings Overview</h3>
                {report.findings && report.findings.length > 0 ? (
                  <ul className="space-y-4">
                    {report.findings.map(finding => (
                      <li key={finding.id} className="rounded-xl bg-background/50 border border-card-border p-4">
                        <h4 className="font-semibold text-foreground mb-1">{finding.title}</h4>
                        <p className="text-sm text-muted">{finding.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">No findings detailed for this overview.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'graph' && (
            <EvidenceGraph
              nodes={report.knowledgeGraph.nodes}
              edges={report.knowledgeGraph.edges}
            />
          )}

          {activeTab === 'timeline' && (
            <MediaTimeline events={report.timeline} />
          )}

          {activeTab === 'counterfactual' && (
            <CounterfactualPanel counterfactuals={report.counterfactuals || []} />
          )}

          {activeTab === 'sources' && (
            <SourceIndependence data={report.sourceIndependence!} />
          )}

          {activeTab === 'explainability' && (
            <ExplainabilityPanel data={report.explainability} />
          )}

          {activeTab === 'provenance' && (
            <ProvenancePassport data={report.provenance} isShared={isShared} />
          )}
        </div>
      </section>

    </div>
  );
}
