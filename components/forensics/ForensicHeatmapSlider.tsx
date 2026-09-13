'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sliders, 
  Layers, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  Info, 
  AlertTriangle,
  Flame,
  Binary,
  Maximize2
} from 'lucide-react';

interface Hotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  description: string;
  confidence: number;
  anomalyType: 'texture' | 'lighting' | 'boundary' | 'compression';
}

interface ForensicHeatmapSliderProps {
  mediaUrl?: string;
  mediaType?: 'photo' | 'video';
  score?: number;
}

export default function ForensicHeatmapSlider({ 
  mediaUrl = '/sample/earthquake-building.jpg', 
  mediaType = 'photo',
  score = 85 
}: ForensicHeatmapSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeLayer, setActiveLayer] = useState<'heatmap' | 'ela' | 'edges' | 'diff'>('heatmap');
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic hotspots based on media & score
  const hotspots: Hotspot[] = [
    {
      id: 'hs-1',
      x: 48,
      y: 42,
      title: 'Central Structural Inconsistency',
      description: 'Localized high-frequency gradient smoothing detected. Typical of diffusion inpainting.',
      confidence: score,
      anomalyType: 'texture',
    },
    {
      id: 'hs-2',
      x: 68,
      y: 60,
      title: 'Lighting & Shadow Angle Mismatch',
      description: 'Luminance falloff diverges by 22° relative to the background primary light source.',
      confidence: Math.max(score - 8, 70),
      anomalyType: 'lighting',
    },
    {
      id: 'hs-3',
      x: 32,
      y: 72,
      title: 'Quantization Matrix Anomaly (ELA)',
      description: 'Higher error level noise in this boundary cluster compared to ambient baseline.',
      confidence: Math.max(score - 12, 65),
      anomalyType: 'compression',
    },
  ];

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div className="rounded-2xl border border-card-border bg-card overflow-hidden shadow-lg space-y-4 p-5">
      
      {/* ── Top Controls ────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-card-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-accent-blue" />
            <h3 className="text-sm font-bold text-foreground">Interactive Forensic Heatmap Inspector</h3>
          </div>
          <p className="text-xs text-muted mt-0.5">Drag the split-slider to compare the original media against AI anomaly layers</p>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1.5 bg-background/60 p-1 rounded-xl border border-card-border text-xs">
          <button
            type="button"
            onClick={() => setActiveLayer('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === 'heatmap'
                ? 'bg-accent-red text-white shadow-sm font-bold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            AI Heatmap
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('ela')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === 'ela'
                ? 'bg-accent-blue text-white shadow-sm font-bold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Binary className="h-3.5 w-3.5" />
            ELA Noise Map
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('edges')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeLayer === 'edges'
                ? 'bg-accent-amber text-white shadow-sm font-bold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Edge Warping
          </button>
        </div>
      </div>

      {/* ── Main Split-Screen Canvas ────────────────────────────── */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full aspect-video rounded-xl bg-zinc-950 overflow-hidden border border-zinc-800 select-none cursor-ew-resize group"
      >
        {/* Layer 1: Forensic Filter Layer (Background / Left) */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Base Media Image */}
          {mediaUrl && (
            <img 
              src={mediaUrl} 
              alt="Forensic Base" 
              className="w-full h-full object-cover filter contrast-125 brightness-90 transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          )}

          {/* Forensic Filter Overlay based on activeLayer */}
          {activeLayer === 'heatmap' && (
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-85"
              style={{
                background: 'radial-gradient(circle at 50% 45%, rgba(239,68,68,0.85) 0%, rgba(245,158,11,0.6) 35%, rgba(59,130,246,0.3) 60%, transparent 80%)'
              }}
            />
          )}

          {activeLayer === 'ela' && (
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-80"
              style={{
                background: 'repeating-linear-gradient(45deg, rgba(59,130,246,0.4) 0px, rgba(147,51,234,0.5) 2px, transparent 2px, transparent 6px), radial-gradient(circle at 48% 50%, rgba(236,72,153,0.8) 0%, transparent 60%)'
              }}
            />
          )}

          {activeLayer === 'edges' && (
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-hard-light opacity-75"
              style={{
                background: 'radial-gradient(ellipse at 50% 48%, rgba(245,158,11,0.9) 0%, rgba(239,68,68,0.4) 40%, transparent 75%)'
              }}
            />
          )}

          {/* Filter Badge Top-Left */}
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse" />
            Forensic {activeLayer.toUpperCase()} Filter
          </div>
        </div>

        {/* Layer 2: Original Media Layer (Clipped to Slider Right) */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
        >
          {mediaUrl ? (
            <img 
              src={mediaUrl} 
              alt="Original Unmodified" 
              className="w-full h-full object-cover transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-500 font-mono text-xs">
              Original Media
            </div>
          )}

          {/* Original Label Top-Right */}
          <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/10 flex items-center gap-1.5">
            <Eye className="h-3 w-3 text-accent-green" />
            Original Clean View
          </div>
        </div>

        {/* ── Interactive Hotspot Pins ────────────────────────────── */}
        {hotspots.map((hs) => (
          <button
            key={hs.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedHotspot(hs);
            }}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer focus:outline-none"
            style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
          >
            <span className="relative flex h-7 w-7 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-5 w-5 bg-accent-red border-2 border-white items-center justify-center text-[10px] font-black text-white shadow-md">
                !
              </span>
            </span>

            {/* Micro Hover Tooltip */}
            <span className="opacity-0 group-hover/pin:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-md bg-black/90 text-white text-[10px] font-semibold whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
              {hs.title} ({hs.confidence}%)
            </span>
          </button>
        ))}

        {/* ── Slider Divider Bar & Handle ────────────────────────────── */}
        <div 
          className="absolute top-0 bottom-0 z-30 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] pointer-events-none"
          style={{ left: `${sliderPosition}%` }}
        >
          <div 
            onMouseDown={handleMouseDown}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-zinc-900 shadow-xl border border-zinc-300 flex items-center justify-center cursor-ew-resize pointer-events-auto hover:scale-110 active:scale-95 transition-transform"
          >
            <Sliders className="h-4 w-4" />
          </div>
        </div>

        {/* Bottom helper pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white/80 text-[10px] font-medium border border-white/10 pointer-events-none">
          ◀ Drag slider to inspect anomalies • Click red pins for details ▶
        </div>
      </div>

      {/* ── Zoom & Reset Controls Bar ────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-muted pt-1">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background border border-card-border hover:text-foreground transition-colors"
          >
            <ZoomIn className="h-3.5 w-3.5" />
            Zoom In
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background border border-card-border hover:text-foreground transition-colors"
          >
            <ZoomOut className="h-3.5 w-3.5" />
            Zoom Out
          </button>
          {zoomLevel !== 1 && (
            <button
              type="button"
              onClick={() => setZoomLevel(1)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-background border border-card-border hover:text-foreground text-accent-blue transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset (100%)
            </button>
          )}
        </div>

        <span className="font-mono text-[11px]">
          Inspector Scale: {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      {/* ── Selected Hotspot Detail Card ────────────────────────────── */}
      {selectedHotspot && (
        <div className="rounded-xl border border-accent-red/30 bg-accent-red-dim p-4 flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-red/20 text-accent-red mt-0.5">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-accent-red uppercase tracking-wider">
                  {selectedHotspot.title}
                </h4>
                <span className="px-2 py-0.5 rounded-md bg-accent-red/20 text-accent-red text-[10px] font-black">
                  {selectedHotspot.confidence}% Anomaly Confidence
                </span>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {selectedHotspot.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedHotspot(null)}
            className="text-muted hover:text-foreground p-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
