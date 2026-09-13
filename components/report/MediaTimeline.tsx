'use client';

import type { TimelineEvent, TimelineEventType, CertaintyLabel } from '@/lib/types';
import {
  Video,
  MessageSquareWarning,
  Newspaper,
  XCircle,
  Search,
  AlertTriangle,
  Info,
  Tag,
} from 'lucide-react';

// ── Styling per event type ──────────────────────────────────

interface EventStyle {
  bg: string;
  border: string;
  text: string;
  dot: string;
  icon: typeof Info;
}

const EVENT_STYLES: Record<TimelineEventType, EventStyle> = {
  media:         { bg: 'bg-accent-blue/10',  border: 'border-accent-blue/30',  text: 'text-accent-blue',  dot: 'bg-accent-blue',  icon: Video },
  claim:         { bg: 'bg-accent-amber/10', border: 'border-accent-amber/30', text: 'text-accent-amber', dot: 'bg-accent-amber', icon: MessageSquareWarning },
  source:        { bg: 'bg-accent-green/10', border: 'border-accent-green/30', text: 'text-accent-green', dot: 'bg-accent-green', icon: Newspaper },
  contradiction: { bg: 'bg-accent-red/10',   border: 'border-accent-red/30',   text: 'text-accent-red',   dot: 'bg-accent-red',   icon: XCircle },
  investigation: { bg: 'bg-accent-blue/10',  border: 'border-accent-blue/30',  text: 'text-accent-blue',  dot: 'bg-accent-blue',  icon: Search },
};

const EVENT_TYPE_LABELS: Record<TimelineEventType, string> = {
  media: 'Media',
  claim: 'Claim',
  source: 'Source',
  contradiction: 'Contradiction',
  investigation: 'Investigation',
};

// ── Certainty badge styling ─────────────────────────────────

function getCertaintyStyle(certainty: CertaintyLabel) {
  switch (certainty) {
    case 'Confirmed':
      return 'bg-accent-green/10 text-accent-green border-accent-green/20';
    case 'Likely':
      return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
    case 'Observed':
      return 'bg-accent-blue/10 text-accent-blue border-accent-blue/20';
    case 'Reported':
      return 'bg-accent-amber/10 text-accent-amber border-accent-amber/20';
    case 'Unclear':
    default:
      return 'bg-card text-muted border-card-border';
  }
}

// ── Date formatting ─────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ── Helper: group events by date ────────────────────────────

function groupByDate(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const map = new Map<string, TimelineEvent[]>();
  for (const ev of events) {
    const key = formatDate(ev.date);
    const arr = map.get(key) || [];
    arr.push(ev);
    map.set(key, arr);
  }
  return map;
}

// ── Component ───────────────────────────────────────────────

interface MediaTimelineProps {
  events: TimelineEvent[];
}

export default function MediaTimeline({ events }: MediaTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Info className="h-8 w-8 text-muted mb-3" />
        <p className="text-foreground font-medium">No timeline data available</p>
        <p className="text-sm text-muted max-w-xs mt-1">
          The timeline will populate once the investigation engine processes the case.
        </p>
      </div>
    );
  }

  // Sort chronologically
  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const grouped = groupByDate(sorted);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-foreground">Media Timeline</h3>

      {/* Warning */}
      <div className="rounded-xl border border-accent-amber/20 bg-accent-amber-dim p-4 flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-accent-amber shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80 leading-relaxed">
          Online appearance dates may not always equal the true creation date.
          Dates shown reflect when the media was <strong>first observed online</strong>,
          not necessarily when it was originally captured.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical trunk line */}
        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-card-border" />

        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([dateLabel, dayEvents], gi) => (
            <div key={dateLabel}>
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-card border border-card-border flex items-center justify-center shrink-0 shadow-sm">
                  <span className="text-[10px] font-bold text-foreground">
                    {new Date(dayEvents[0].date).getDate()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{dateLabel}</p>
                  {gi === 0 && (
                    <p className="text-[10px] text-accent-blue font-medium uppercase tracking-wider">First observed online</p>
                  )}
                </div>
              </div>

              {/* Events for this day */}
              <div className="space-y-3 ml-5 pl-[18px] border-l border-card-border">
                {dayEvents.map((ev) => {
                  const style = EVENT_STYLES[ev.type];
                  const Icon = style.icon;

                  return (
                    <div key={ev.id} className="relative">
                      {/* Connector dot */}
                      <div className={`absolute -left-[23px] top-4 w-3 h-3 rounded-full border-2 border-card ${style.dot}`} />

                      <div className={`rounded-xl border ${style.border} ${style.bg} p-4 space-y-3`}>
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${style.text} shrink-0`} />
                            <h4 className="text-sm font-semibold text-foreground">{ev.label}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted font-mono">{formatTime(ev.date)}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getCertaintyStyle(ev.certainty)}`}>
                              {ev.certainty}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {ev.description}
                        </p>

                        {/* Evidence IDs */}
                        {ev.evidenceIds.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <Tag className="h-3 w-3 text-muted shrink-0" />
                            {ev.evidenceIds.map((eid) => (
                              <span
                                key={eid}
                                className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-card border border-card-border text-muted"
                              >
                                {eid}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl border border-card-border bg-card p-4">
        <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wider">Event Types</p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {(Object.entries(EVENT_STYLES) as [TimelineEventType, EventStyle][]).map(([type, s]) => {
            const Icon = s.icon;
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                <Icon className={`h-3.5 w-3.5 ${s.text}`} />
                <span className="text-xs text-muted">{EVENT_TYPE_LABELS[type]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
