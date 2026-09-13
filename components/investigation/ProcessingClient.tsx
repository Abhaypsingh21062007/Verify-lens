'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertTriangle, 
  FileImage,
  Info
} from 'lucide-react';
import Link from 'next/link';

interface ProcessingClientProps {
  investigationId: string;
  claimText: string;
  mediaUrl: string;
  mode?: string;
}

const DEFAULT_STEPS = [
  "Media uploaded and verified",
  "Checking visual integrity & AI generation markers",
  "Inspecting audio and facial consistency",
  "Tracing earliest web appearance & history",
  "Cross-referencing claims against verified databases",
  "Building evidence web and final report"
];

const VOICE_STEPS = [
  "Audio voice note received",
  "Transcribing spoken speech and detecting language",
  "Extracting factual claims from speech",
  "Cross-referencing claims against verified databases",
  "Generating final speech & verification report"
];

const EDUCATIONAL_TIPS = [
  "Perceptual hashes help find resized and cropped copies.",
  "Provenance describes file history, but it does not prove a claim is true.",
  "We compare media with captions because authentic content can still be misleading."
];

export default function ProcessingClient({ investigationId, claimText, mediaUrl, mode = 'quick' }: ProcessingClientProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<{ time: string, message: string }[]>([]);
  const [errorState, setErrorState] = useState<string | null>(null);
  const hasRedirected = useRef(false);

  const ANALYSIS_STEPS = mode === 'voice-scanner' ? VOICE_STEPS : DEFAULT_STEPS;

  useEffect(() => {
    setTimeout(() => {
      setLogs([{ time: new Date().toLocaleTimeString(), message: `Investigation ${investigationId} started.` }]);
    }, 0);

    let step = 0;
    let reportGenerated = false;
    let generationFailed = false;

    const runVoiceAnalysis = async () => {
      try {
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaUrl,
            claimText,
            investigationId,
          }),
        });
        const data = await res.json();
        
        if (!data.success) {
          generationFailed = true;
          setErrorState(`Transcription Failed: ${data.error}`);
          return;
        }

        // Pass voice data to generate report
        const { generateInvestigationReport } = await import('@/app/actions/generate-report');
        const reportRes = await generateInvestigationReport(investigationId, claimText || data.transcript, mediaUrl, data);
        
        if (reportRes.success) {
          reportGenerated = true;
          setLogs(prev => [
            { time: new Date().toLocaleTimeString(), message: `Voice AI Report generated successfully.` },
            ...prev
          ].slice(0, 10));
        } else {
          generationFailed = true;
          setErrorState(`Analysis Failed: ${reportRes.error}`);
        }
      } catch (err: any) {
        generationFailed = true;
        setErrorState(`Transcription Failed: ${err.message}`);
      }
    };

    const runStandardAnalysis = async () => {
      try {
        const { generateInvestigationReport } = await import('@/app/actions/generate-report');
        const res = await generateInvestigationReport(investigationId, claimText, mediaUrl);
        if (res.success) {
          reportGenerated = true;
          setLogs(prev => [
            { time: new Date().toLocaleTimeString(), message: `AI Report generated successfully.` },
            ...prev
          ].slice(0, 10));
        } else {
          generationFailed = true;
          setErrorState(`Analysis Failed: ${res.error}`);
        }
      } catch (err: any) {
        generationFailed = true;
        setErrorState(`(v2.0) Analysis Failed: ${err.message || String(err)}`);
      }
    };

    if (mode === 'voice-scanner') {
      runVoiceAnalysis();
    } else {
      runStandardAnalysis();
    }

    const interval = setInterval(() => {
      step++;
      
      if (generationFailed) {
         clearInterval(interval);
         return;
      }

      if (step >= ANALYSIS_STEPS.length) {
        if (!reportGenerated && !generationFailed) {
           step = ANALYSIS_STEPS.length - 1; 
           return;
        }

        clearInterval(interval);
        if (!hasRedirected.current) {
          hasRedirected.current = true;
          router.push(`/report/${investigationId}`);
        }
        return;
      }

      if (investigationId === 'sample-error' && step === 5) {
        clearInterval(interval);
        setErrorState("Poor-quality media detected. The file is too compressed to run reliable visual manipulation analysis.");
        setLogs(prev => [
          { time: new Date().toLocaleTimeString(), message: `ERROR: Analysis failed on step 6.` },
          ...prev
        ].slice(0, 10));
        return;
      }
      
      setCurrentStepIndex(step);
      
      setLogs(prev => [
        { time: new Date().toLocaleTimeString(), message: `Completed: ${ANALYSIS_STEPS[step - 1]}` },
        ...prev
      ].slice(0, 10));

    }, Math.floor(Math.random() * 300) + 700);

    return () => clearInterval(interval);
  }, [investigationId, claimText, mediaUrl, router, mode]);

  const progressPercentage = Math.round((currentStepIndex / ANALYSIS_STEPS.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
      
      {/* ── Left Column: Analysis Steps ──────────────────────────── */}
      <div className="lg:col-span-2 space-y-6">
        
        {errorState && (
          <div className="rounded-2xl border border-accent-red/30 bg-accent-red-dim p-6 shadow-sm flex flex-col gap-4 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-2 rounded-full bg-accent-red/20 text-accent-red">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-accent-red mb-1">Analysis Failed</h2>
                <p className="text-sm text-foreground/90 leading-relaxed">{errorState}</p>
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <Link 
                href="/investigate" 
                className="px-5 py-2.5 rounded-lg bg-card border border-card-border hover:bg-background text-sm font-semibold text-foreground transition-colors"
              >
                Return to upload
              </Link>
            </div>
          </div>
        )}

        {/* Progress Header */}
        <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Analysis Progress</h2>
              <p className="text-sm text-muted">ID: {investigationId}</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-accent-blue">{progressPercentage}%</span>
            </div>
          </div>
          
          <div className="h-2 rounded-full bg-background overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-accent-blue to-blue-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
            Analysis Pipeline
          </h3>
          <div className="space-y-3 relative">
            <div className="absolute left-3 top-3 bottom-3 w-px bg-card-border" />
            
            {ANALYSIS_STEPS.map((stepName, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;
              
              // Simulate a warning on "Audio and lip-sync analysis" for demonstration
              const isWarning = isCompleted && stepName.includes('Audio');

              return (
                <div key={stepName} className="relative flex items-center gap-4">
                  <div className="relative z-10 shrink-0 bg-card rounded-full">
                    {isCompleted ? (
                      isWarning ? (
                        <AlertTriangle className="h-6 w-6 text-accent-amber" />
                      ) : (
                        <CheckCircle2 className="h-6 w-6 text-accent-green" />
                      )
                    ) : isCurrent ? (
                      errorState ? (
                         <AlertTriangle className="h-6 w-6 text-accent-red" />
                      ) : (
                        <Loader2 className="h-6 w-6 text-accent-blue animate-spin" />
                      )
                    ) : (
                      <Circle className="h-6 w-6 text-muted/30" />
                    )}
                  </div>
                  
                  <div className={`flex-1 flex justify-between items-center ${isPending ? 'opacity-50' : ''}`}>
                    <span className={`text-sm ${isCurrent && !errorState ? 'font-semibold text-accent-blue' : isCurrent && errorState ? 'font-semibold text-accent-red' : 'text-foreground'}`}>
                      {stepName}
                    </span>
                    {isCurrent && !errorState && (
                      <span className="text-xs font-medium text-accent-blue animate-pulse">Running...</span>
                    )}
                    {isCurrent && errorState && (
                      <span className="text-xs font-medium text-accent-red">Failed</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right Column: Context & Logs ────────────────────────── */}
      <div className="space-y-6">
        
        {/* Media & Claim Summary */}
        <div className="rounded-2xl border border-card-border bg-card overflow-hidden shadow-sm">
          <div className="p-4 border-b border-card-border bg-background/50 flex items-center gap-2">
            <FileImage className="h-4 w-4 text-muted" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">Input Summary</span>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="aspect-video w-full rounded-lg bg-background/50 border border-card-border flex items-center justify-center overflow-hidden relative group">
              {mediaUrl.match(/\.(mp4|webm|mov)$/i) || mediaUrl.startsWith('data:video/') ? (
                <video src={mediaUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
              ) : mediaUrl ? (
                <img src={mediaUrl} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-blue/10 to-transparent opacity-50" />
                  <FileImage className="h-8 w-8 text-muted/50 group-hover:scale-110 transition-transform" />
                  <div className="absolute bottom-2 left-2 right-2 truncate text-[10px] text-muted/50 text-center font-mono">
                    {mediaUrl}
                  </div>
                </>
              )}
            </div>
            
            <div>
              <p className="text-xs font-medium text-muted mb-1">Claim Under Review</p>
              <p className="text-sm text-foreground italic border-l-2 border-accent-blue/50 pl-3 leading-relaxed">
                &quot;{claimText}&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Live Event Log */}
        <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
          <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            Live Event Log
          </h3>
          <div className="h-40 overflow-y-auto space-y-2 pr-2 font-mono text-[10px] sm:text-xs">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-muted animate-fade-in-up">
                <span className="opacity-50 shrink-0">[{log.time}]</span>
                <span className="text-foreground">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Tips */}
        <div className="rounded-2xl border border-accent-blue/20 bg-accent-blue-dim p-5">
          <h3 className="text-xs font-bold text-accent-blue mb-3 uppercase tracking-wider flex items-center gap-2">
            <Info className="h-4 w-4" />
            Why this matters
          </h3>
          <div className="space-y-3">
            {EDUCATIONAL_TIPS.map((tip, i) => (
              <p key={i} className="text-xs text-foreground/80 leading-relaxed">
                • {tip}
              </p>
            ))}
          </div>
        </div>

        {/* Skip button for testing */}
        {!errorState && (
          <button
            onClick={() => {
              if (!hasRedirected.current) {
                hasRedirected.current = true;
                router.push(`/report/${investigationId}`);
              }
            }}
            className="w-full py-3 px-4 rounded-xl border border-card-border bg-card text-sm font-semibold text-muted hover:text-foreground hover:border-muted/30 transition-all"
          >
            Bypass Analysis (Debug Mode)
          </button>
        )}
      </div>
    </div>
  );
}
