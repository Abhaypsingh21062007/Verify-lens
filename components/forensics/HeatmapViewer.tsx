'use client';

import { useState, useEffect } from 'react';
import { HeatmapMode, HeatmapFinding } from '@/lib/types';
import HeatmapControls from './HeatmapControls';
import HeatmapLegend from './HeatmapLegend';
import ExplanationDisclaimer from './ExplanationDisclaimer';
import FrameStrip from './FrameStrip';
import TemporalRiskChart from './TemporalRiskChart';
import FindingDetails from './FindingDetails';
import { getDeterministicHeatmapFindings, generateTemporalRiskSeries } from '@/lib/forensics-demo-adapter';

interface HeatmapViewerProps {
  mediaUrl: string; // The URL to the media (or mock URL)
  mediaType?: 'photo' | 'video'; // Passed in, or default to photo
}

export default function HeatmapViewer({ mediaUrl, mediaType = 'photo' }: HeatmapViewerProps) {
  const [mode, setMode] = useState<HeatmapMode>('overlay');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Demo data
  const findings = getDeterministicHeatmapFindings(mediaUrl, mediaType);
  const temporalData = mediaType === 'video' ? generateTemporalRiskSeries() : [];
  
  // Determine the active finding based on time (for video) or just the first finding (for photo)
  let activeFinding: HeatmapFinding | null = null;
  if (mediaType === 'photo') {
    activeFinding = findings[0] || null;
  } else {
    // Find a finding close to the current time
    activeFinding = findings.find(f => {
      if (!f.timestamp) return false;
      const parts = f.timestamp.split(':');
      const timeInSecs = parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
      return Math.abs(timeInSecs - currentTime) < 1.5; // active window
    }) || null;
  }

  // Handle video playback simulation for demo
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && mediaType === 'video') {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= 30) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, mediaType]);

  const activeHeatmap = activeFinding?.heatmapData;

  return (
    <div className="flex flex-col md:flex-row rounded-xl border border-card-border bg-card overflow-hidden">
      
      {/* LEFT: Visualizer Area */}
      <div className="w-full md:w-[55%] border-b md:border-b-0 md:border-r border-card-border bg-zinc-950 flex flex-col">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
          <HeatmapControls mode={mode} onModeChange={setMode} />
          <HeatmapLegend />
        </div>

        <div className="flex-1 relative min-h-[300px] flex items-center justify-center p-4">
          
          <div className="relative w-full aspect-video max-w-2xl bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
            {/* Split screen logic wrapper */}
            <div className={`absolute inset-0 flex ${mode === 'side-by-side' ? 'flex-row' : ''}`}>
              
              {/* Image/Video Base */}
              <div className={`relative ${mode === 'side-by-side' ? 'w-1/2 border-r border-zinc-700' : 'w-full h-full'}`}>
                {/* Mock media placeholder (since mediaUrl might be generic) */}
                <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center text-zinc-600 font-mono text-sm">
                  {mediaType === 'video' ? `Video Frame ${Math.floor(currentTime * 24)}` : 'Source Image'}
                </div>
                {/* Simple shape representing a subject */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 rounded-[2rem] border border-zinc-700/50 bg-zinc-800" />
                
                {/* Overlay heatmap if in 'overlay' or 'heatmap' mode */}
                {(mode === 'overlay' || mode === 'heatmap') && activeHeatmap && (
                  <div 
                    className="absolute inset-0 mix-blend-screen transition-opacity duration-300"
                    style={{ 
                      background: activeHeatmap,
                      opacity: mode === 'heatmap' ? 1 : 0.6 
                    }} 
                  />
                )}
              </div>

              {/* Side-by-side right pane */}
              {mode === 'side-by-side' && (
                <div className="relative w-1/2 h-full bg-zinc-900">
                  <div className="absolute inset-0 bg-zinc-950" />
                  {activeHeatmap && (
                    <div 
                      className="absolute inset-0 mix-blend-screen"
                      style={{ background: activeHeatmap }} 
                    />
                  )}
                </div>
              )}
            </div>

            {/* Video time overlay */}
            {mediaType === 'video' && (
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-white/70 bg-black/80 px-2 py-1 rounded">
                00:{currentTime < 10 ? `0${currentTime.toFixed(1)}` : currentTime.toFixed(1)}
              </div>
            )}
          </div>
        </div>

        {/* Video specific temporal controls */}
        {mediaType === 'video' && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 space-y-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-blue text-white hover:bg-accent-blue/80 transition-colors"
              >
                {isPlaying ? (
                  <div className="w-3 h-3 border-x-4 border-white" />
                ) : (
                  <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-1" />
                )}
              </button>
              <div className="flex-1">
                <TemporalRiskChart data={temporalData} currentTime={currentTime} onSeek={setCurrentTime} />
              </div>
            </div>
            
            <FrameStrip findings={findings} currentTime={currentTime} onSeek={setCurrentTime} />
          </div>
        )}
      </div>

      {/* RIGHT: Details Area */}
      <div className="w-full md:w-[45%] p-5 flex flex-col justify-start">
        <ExplanationDisclaimer />
        
        <div className="mt-4 flex-1">
          <FindingDetails finding={activeFinding} />
        </div>
      </div>
    </div>
  );
}
