'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { GraphNode, GraphEdge, GraphNodeType } from '@/lib/types';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  MessageSquareWarning,
  Video,
  VideoOff,
  Newspaper,
  ShieldCheck,
  Building2,
  XCircle,
  CheckCircle2,
  Lightbulb,
  X,
} from 'lucide-react';

// ── Node styling by type ────────────────────────────────────
const NODE_STYLES: Record<GraphNodeType, { bg: string; border: string; text: string; icon: typeof Info }> = {
  'current-claim':        { bg: 'bg-accent-amber/15', border: 'border-accent-amber/40', text: 'text-accent-amber', icon: MessageSquareWarning },
  'uploaded-media':       { bg: 'bg-accent-blue/15',  border: 'border-accent-blue/40',  text: 'text-accent-blue',  icon: Video },
  'earlier-media':        { bg: 'bg-accent-blue/15',  border: 'border-accent-blue/40',  text: 'text-accent-blue',  icon: VideoOff },
  'original-source':      { bg: 'bg-accent-green/15', border: 'border-accent-green/40', text: 'text-accent-green', icon: Building2 },
  'news-article':         { bg: 'bg-accent-blue/15',  border: 'border-accent-blue/40',  text: 'text-accent-blue',  icon: Newspaper },
  'fact-check':           { bg: 'bg-accent-green/15', border: 'border-accent-green/40', text: 'text-accent-green', icon: ShieldCheck },
  'official-source':      { bg: 'bg-accent-green/15', border: 'border-accent-green/40', text: 'text-accent-green', icon: Building2 },
  'contradiction':        { bg: 'bg-accent-red/15',   border: 'border-accent-red/40',   text: 'text-accent-red',   icon: XCircle },
  'supporting-evidence':  { bg: 'bg-accent-green/15', border: 'border-accent-green/40', text: 'text-accent-green', icon: CheckCircle2 },
};

const NODE_TYPE_LABELS: Record<GraphNodeType, string> = {
  'current-claim': 'Current Claim',
  'uploaded-media': 'Uploaded Media',
  'earlier-media': 'Earlier Media',
  'original-source': 'Original Source',
  'news-article': 'News Article',
  'fact-check': 'Fact-Check',
  'official-source': 'Official Source',
  'contradiction': 'Contradiction',
  'supporting-evidence': 'Supporting Evidence',
};

// Edge color based on label
function getEdgeColor(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes('contradict') || lower.includes('mismatch')) return 'var(--accent-red)';
  if (lower.includes('support') || lower.includes('matches')) return 'var(--accent-green)';
  return 'var(--accent-blue)';
}

// ── Layout: force-directed-ish manual placement ─────────────
// We compute static positions in a radial-ish layout.
function computePositions(nodes: GraphNode[]): Map<string, { x: number; y: number }> {
  const map = new Map<string, { x: number; y: number }>();
  const cx = 500;
  const cy = 350;

  // Place the claim node center-top and media just below
  // Then arrange the rest in a semicircle below
  const claimNodes = nodes.filter(n => n.type === 'current-claim');
  const mediaNodes = nodes.filter(n => n.type === 'uploaded-media');
  const rest = nodes.filter(n => n.type !== 'current-claim' && n.type !== 'uploaded-media');

  claimNodes.forEach(n => map.set(n.id, { x: cx, y: 80 }));
  mediaNodes.forEach(n => map.set(n.id, { x: cx, y: 230 }));

  // Arrange the rest in a wider arc below
  const arcRadius = 280;
  const startAngle = Math.PI * 0.15;
  const endAngle = Math.PI * 0.85;

  rest.forEach((n, i) => {
    const angle = startAngle + ((endAngle - startAngle) * i) / Math.max(rest.length - 1, 1);
    const x = cx + arcRadius * Math.cos(angle) * 1.4;
    const y = 350 + arcRadius * Math.sin(angle) * 0.7;
    map.set(n.id, { x, y });
  });

  return map;
}

interface EvidenceGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export default function EvidenceGraph({ nodes, edges }: EvidenceGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const positions = computePositions(nodes);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.15, 2.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.15, 0.4));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setSelectedNode(null); };

  // Mouse-drag panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Mock position calculation
  useEffect(() => {
    // We could calculate forces here, but we'll use predefined or simple layout for the demo
  }, []);

  // Scroll zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoom(z => Math.max(0.4, Math.min(2.5, z + delta)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const isEmpty = nodes.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Info className="h-8 w-8 text-muted mb-3" />
        <p className="text-foreground font-medium">No graph data available</p>
        <p className="text-sm text-muted max-w-xs mt-1">
          The evidence graph will populate once the investigation engine processes the case.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ── Controls ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Evidence Graph</h3>
        <div className="flex items-center gap-1">
          <button onClick={handleZoomIn} className="p-2 rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-card transition-all" title="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </button>
          <button onClick={handleZoomOut} className="p-2 rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-card transition-all" title="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg border border-card-border text-muted hover:text-foreground hover:bg-card transition-all" title="Reset view">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Graph Canvas ─────────────────────────────── */}
      <div
        ref={containerRef}
        className="relative w-full h-[520px] rounded-xl border border-card-border bg-background/50 overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            width: '1000px',
            height: '700px',
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: '-500px',
            marginTop: '-350px',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          {/* SVG edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 700">
            <defs>
              <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent-red)" opacity="0.7" />
              </marker>
              <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent-green)" opacity="0.7" />
              </marker>
              <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent-blue)" opacity="0.7" />
              </marker>
            </defs>
            {edges.map(edge => {
              const from = positions.get(edge.source);
              const to = positions.get(edge.target);
              if (!from || !to) return null;

              const color = getEdgeColor(edge.label);
              const markerEnd = color.includes('red') ? 'url(#arrowRed)' : color.includes('green') ? 'url(#arrowGreen)' : 'url(#arrowBlue)';

              // Compute midpoint for label
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;

              return (
                <g key={edge.id}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.5"
                    markerEnd={markerEnd}
                  />
                  <rect
                    x={mx - 40}
                    y={my - 9}
                    width="80"
                    height="18"
                    rx="4"
                    fill="var(--card)"
                    stroke={color}
                    strokeWidth="0.5"
                    opacity="0.9"
                  />
                  <text
                    x={mx}
                    y={my + 4}
                    textAnchor="middle"
                    fontSize="9"
                    fill="var(--foreground)"
                    opacity="0.8"
                    fontFamily="var(--font-sans)"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node cards */}
          {nodes.map(node => {
            const pos = positions.get(node.id);
            if (!pos) return null;
            const style = NODE_STYLES[node.type] || NODE_STYLES['supporting-evidence'];
            const Icon = style.icon;
            const isSelected = selectedNode?.id === node.id;

            return (
              <button
                key={node.id}
                data-node
                onClick={() => setSelectedNode(isSelected ? null : node)}
                className={`absolute flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-left
                  ${style.bg} ${style.border}
                  ${isSelected ? 'ring-2 ring-offset-1 ring-offset-background ring-accent-blue shadow-lg scale-110 z-20' : 'hover:scale-105 z-10'}
                `}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  maxWidth: '160px',
                }}
              >
                <Icon className={`h-4 w-4 shrink-0 ${style.text}`} />
                <span className="text-xs font-medium text-foreground leading-tight truncate">{node.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Node Detail Panel ───────────────── */}
      {selectedNode && (
        <div className="rounded-xl border border-card-border bg-card p-5 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              {(() => {
                const s = NODE_STYLES[selectedNode.type] || NODE_STYLES['supporting-evidence'];
                const NodeIcon = s.icon;
                return <NodeIcon className={`h-5 w-5 ${s.text}`} />;
              })()}
              <div>
                <h4 className="font-semibold text-foreground">{selectedNode.label}</h4>
                <span className="text-xs text-muted">{NODE_TYPE_LABELS[selectedNode.type]}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded text-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedNode.detail && (
            <p className="text-sm text-muted leading-relaxed">{selectedNode.detail}</p>
          )}

          {/* Connected edges */}
          <div className="mt-4 pt-3 border-t border-card-border">
            <p className="text-xs font-medium text-muted mb-2 uppercase tracking-wider">Connections</p>
            <div className="space-y-1.5">
              {edges
                .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                .map(e => {
                  const otherId = e.source === selectedNode.id ? e.target : e.source;
                  const otherNode = nodes.find(n => n.id === otherId);
                  const direction = e.source === selectedNode.id ? '→' : '←';
                  return (
                    <button
                      key={e.id}
                      onClick={() => {
                        if (otherNode) setSelectedNode(otherNode);
                      }}
                      className="w-full text-left flex items-center gap-2 text-xs px-2 py-1.5 rounded-md hover:bg-background/50 transition-colors"
                    >
                      <span className="text-muted">{direction}</span>
                      <span className="font-medium text-foreground">{otherNode?.label || otherId}</span>
                      <span className="ml-auto text-muted italic">{e.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ── Legend ────────────────────────────────────── */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Legend</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.entries(NODE_STYLES) as [GraphNodeType, typeof NODE_STYLES[GraphNodeType]][]).map(([type, s]) => {
            const Icon = s.icon;
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${s.bg} ${s.border} border`}>
                  <Icon className={`h-3.5 w-3.5 ${s.text}`} />
                </div>
                <span className="text-xs text-muted">{NODE_TYPE_LABELS[type]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Insight ──────────────────────────────────── */}
      <div className="rounded-xl border border-accent-blue/20 bg-accent-blue-dim p-4 flex items-start gap-3">
        <Lightbulb className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80 leading-relaxed">
          <span className="font-semibold text-accent-blue">Insight: </span>
          Many URLs do not necessarily represent independent confirmation.
        </p>
      </div>
    </div>
  );
}
