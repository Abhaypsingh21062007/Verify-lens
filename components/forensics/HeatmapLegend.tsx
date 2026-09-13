export default function HeatmapLegend() {
  return (
    <div className="flex items-center gap-3 bg-background/50 border border-card-border rounded-lg px-3 py-2 text-xs">
      <span className="text-muted font-medium">Low Risk</span>
      <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-transparent via-accent-amber/50 to-accent-red/80 min-w-[100px]" />
      <span className="text-foreground font-medium">High Risk</span>
    </div>
  );
}
