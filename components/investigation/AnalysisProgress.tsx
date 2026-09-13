'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const steps = [
  { label: 'Uploading media…', icon: '📤' },
  { label: 'Running manipulation detection…', icon: '🔬' },
  { label: 'Performing ELA analysis…', icon: '🖼️' },
  { label: 'Checking for AI-generation markers…', icon: '🤖' },
  { label: 'Searching for earlier appearances…', icon: '🔍' },
  { label: 'Cross-referencing claim with databases…', icon: '📊' },
  { label: 'Synthesising report…', icon: '📝' },
];

export default function AnalysisProgress({ onComplete }: AnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 animate-pulse-glow">
          <Sparkles className="h-7 w-7 text-accent-blue animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Analysing Media</h2>
        <p className="text-sm text-muted">
          Running multi-layered forensic analysis…
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted">
          <span>Progress</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
        <div className="h-2 rounded-full bg-card border border-card-border overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-blue to-blue-400 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
              i === currentStep
                ? 'bg-accent-blue/10 border border-accent-blue/20'
                : i < currentStep
                ? 'opacity-60'
                : 'opacity-20'
            }`}
          >
            <span className="text-base">{step.icon}</span>
            <span
              className={`text-sm ${
                i === currentStep
                  ? 'text-accent-blue font-medium'
                  : i < currentStep
                  ? 'text-muted line-through'
                  : 'text-muted'
              }`}
            >
              {step.label}
            </span>
            {i < currentStep && (
              <span className="ml-auto text-accent-green text-xs">✓</span>
            )}
            {i === currentStep && (
              <span className="ml-auto">
                <span className="inline-block w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
