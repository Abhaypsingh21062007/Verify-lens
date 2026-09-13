interface TemporalRiskChartProps {
  data: { time: number; score: number }[];
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function TemporalRiskChart({ data, currentTime, onSeek }: TemporalRiskChartProps) {
  const maxTime = Math.max(...data.map(d => d.time), 1);
  const getX = (time: number) => (time / maxTime) * 100;
  const getY = (score: number) => 100 - score;

  // Create SVG path
  const pathData = data.map((d, i) => {
    const x = getX(d.time);
    const y = getY(d.score);
    if (i === 0) return `M ${x} ${y}`;
    return `L ${x} ${y}`;
  }).join(' ');

  const areaData = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-semibold text-muted uppercase tracking-wider">Temporal Risk</span>
      </div>
      
      <div 
        className="relative w-full h-16 bg-background/50 border border-card-border rounded-lg overflow-hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          onSeek(percent * maxTime);
        }}
      >
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="risk-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,50,50,0.4)" />
              <stop offset="50%" stopColor="rgba(255,200,50,0.2)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </linearGradient>
          </defs>
          
          <path d={areaData} fill="url(#risk-gradient)" />
          <path d={pathData} fill="none" stroke="rgba(255,100,100,0.8)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Current time indicator */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-accent-blue z-10"
          style={{ left: `${getX(currentTime)}%` }}
        >
          <div className="absolute top-0 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
        </div>
      </div>
    </div>
  );
}
