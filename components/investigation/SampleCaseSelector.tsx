'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Mic, 
  Image as ImageIcon, 
  Film, 
  Scale, 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Cpu,
  Layers,
  FileCheck,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export interface SampleCase {
  id: string;
  category: 'context' | 'deepfake' | 'audio' | 'conflict';
  archetype: string;
  title: string;
  viralClaim: string;
  verifiedReality: string;
  description: string;
  forensicMethods: string[];
  lesson: string;
  tag: string;
  icon: typeof ImageIcon;
  badgeColor: string;
  borderHover: string;
  verdictPreview: string;
  verdictColor: string;
  verdictBg: string;
  route: string;
}

export const sampleCases: SampleCase[] = [
  {
    id: 'sample-001',
    category: 'context',
    archetype: 'The #1 Type of Real-World Misinformation',
    title: 'Real Photo, Fabricated Context',
    viralClaim: '"Magnitude 7.2 earthquake devastates Istanbul today with massive building collapses."',
    verifiedReality: 'Unaltered photo from the Feb 2023 Turkey-Syria earthquake (Kahramanmaraş). Zero seismic activity in Istanbul today.',
    description: 'Authentic photos are the most dangerous form of misinformation because human eyes believe real pixels. VerifyLens cross-references reverse image archives and seismic sensor APIs to expose the 3-year date mismatch.',
    forensicMethods: ['Reverse Image OSINT', 'Error Level Analysis (ELA)', 'USGS Seismic API', 'EXIF Geolocation'],
    lesson: 'Most fake news is NOT an AI deepfake—it is genuine old media recycled with a sensationalized caption.',
    tag: 'Context Hijack',
    icon: ImageIcon,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderHover: 'hover:border-amber-500/50 hover:shadow-amber-500/5',
    verdictPreview: 'Authentic Media, False Story',
    verdictColor: 'text-accent-amber',
    verdictBg: 'bg-accent-amber/10 border-accent-amber/30',
    route: '/report/sample-001',
  },
  {
    id: 'misleading-info-video',
    category: 'deepfake',
    archetype: 'Generative AI Threat & Voice Cloning',
    title: 'AI Face-Swap & Neural Voice Clone',
    viralClaim: '"Official spokesperson announces shocking new emergency economic regulations."',
    verifiedReality: 'Altered 2018 corporate keynote footage. Face digitally swapped via FaceNet and voice cloned using ElevenLabs AI text-to-speech.',
    description: 'Multi-modal neural manipulation combining visual blending, vocal synthesis, and lip desynchronization. VerifyLens flags high-frequency edge blur and phoneme-viseme timing discrepancies.',
    forensicMethods: ['FaceNet Edge Warping', 'Acoustic Spectrum Vocoder Scan', 'Lip-Sync Viseme Delay (120ms)', 'YouTube Keynote Archive Match'],
    lesson: 'A true deepfake detector must analyze visual boundaries, audio harmonics, AND lip synchronization simultaneously.',
    tag: 'Deepfake AI',
    icon: Film,
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderHover: 'hover:border-rose-500/50 hover:shadow-rose-500/5',
    verdictPreview: 'Likely Manipulated (Deepfake)',
    verdictColor: 'text-accent-red',
    verdictBg: 'bg-accent-red/10 border-accent-red/30',
    route: '/report/misleading-info-video',
  },
  {
    id: 'synthetic-interview',
    category: 'audio',
    archetype: 'Dark Social & Regional Language Panic',
    title: 'Viral WhatsApp Audio Rumor',
    viralClaim: '"Ye video Surat ke aaj ke flood ka hai aur government sach chhupa rahi hai..." (Gov is hiding flood casualties).',
    verifiedReality: 'Authentic human voice recording, but factual claim is completely debunked by live Tapi River discharge sensors and disaster management bulletins.',
    description: 'Unchecked voice notes spread rapidly on WhatsApp. VerifyLens runs speech-to-text on regional languages (Hindi/Hinglish), extracts factual entities, and checks official hydro telemetry.',
    forensicMethods: ['Multilingual STT (Hindi/Hinglish)', 'Claim Entity Extraction', 'GSDMA River Discharge Logs', 'Dark Social Velocity Tracking'],
    lesson: 'Even when the voice is 100% human and unedited, the underlying story can still be a dangerous public rumor.',
    tag: 'Regional Speech OSINT',
    icon: Mic,
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    borderHover: 'hover:border-sky-500/50 hover:shadow-sky-500/5',
    verdictPreview: 'Claim Contradicted by Data',
    verdictColor: 'text-accent-blue',
    verdictBg: 'bg-accent-blue/10 border-accent-blue/30',
    route: '/report/synthetic-interview',
  },
  {
    id: 'conflicting-evidence',
    category: 'conflict',
    archetype: 'The Fog of Breaking News',
    title: 'Contradicting Sources & CGI Asset',
    viralClaim: '"Expedition discovers living prehistoric animal species in remote rainforest canopy."',
    verifiedReality: 'Wildlife newsroom initially reported footage as real, while VFX investigators identified identical 3D wireframe geometry in an Unreal Engine asset pack.',
    description: 'When credible sources disagree, an honest AI must avoid hallucinating false certainty. VerifyLens flags conflicting evidence and routes the file to human OSINT analysts.',
    forensicMethods: ['Dual Fact-Check Aggregation', '3D Asset Mesh Matching', 'Blender / Canon Header Discrepancy', 'Human Review Escalation'],
    lesson: 'Responsible AI must know its limits—transparently surfacing contradictions instead of making an unjustified guess.',
    tag: 'Human Review Alert',
    icon: Scale,
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderHover: 'hover:border-purple-500/50 hover:shadow-purple-500/5',
    verdictPreview: 'Conflicting Evidence (Review Needed)',
    verdictColor: 'text-purple-400',
    verdictBg: 'bg-purple-500/10 border-purple-500/30',
    route: '/report/conflicting-evidence',
  },
];

export default function SampleCaseSelector() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const filteredCases = selectedCategory === 'all' 
    ? sampleCases 
    : sampleCases.filter(c => c.category === selectedCategory);

  return (
    <div className="space-y-6 pt-4">
      {/* Header Banner */}
      <div className="rounded-2xl border border-accent-blue/20 bg-gradient-to-r from-accent-blue/10 via-card to-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue text-[11px] font-bold tracking-wide uppercase">
              <Sparkles className="h-3 w-3" />
              Interactive Demo Case Studies
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground">
              How VerifyLens Investigates Misinformation
            </h2>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              Misinformation takes multiple forms—from recycled genuine photos to AI deepfakes and viral voice notes. Select any case below to inspect the complete forensic report:
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-card-border/60">
          <span className="text-xs font-semibold text-muted flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Case Studies (4)' },
            { id: 'context', label: '📸 Context Hijack (Real Photo, Fake Story)' },
            { id: 'deepfake', label: '🤖 AI Deepfake & Voice Clone' },
            { id: 'audio', label: '🎙️ WhatsApp Audio (Hindi STT)' },
            { id: 'conflict', label: '⚖️ Breaking News Contradiction' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all duration-200 border ${
                selectedCategory === tab.id
                  ? 'bg-accent-blue text-white border-accent-blue shadow-sm shadow-accent-blue/30'
                  : 'bg-card/80 text-muted hover:text-foreground hover:bg-card border-card-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCases.map((c) => {
          const Icon = c.icon;
          const isExpanded = expandedCaseId === c.id;

          return (
            <div
              key={c.id}
              className={`group flex flex-col justify-between rounded-2xl border border-card-border bg-card p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${c.borderHover}`}
            >
              <div className="space-y-4">
                {/* Header Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    {c.archetype}
                  </span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${c.badgeColor}`}>
                    {c.tag}
                  </span>
                </div>

                {/* Title & Icon */}
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${c.badgeColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg group-hover:text-accent-blue transition-colors">
                      {c.title}
                    </h3>
                    <div className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md border mt-1 ${c.verdictBg} ${c.verdictColor}`}>
                      Verdict: {c.verdictPreview}
                    </div>
                  </div>
                </div>

                {/* Claim vs Reality Comparison Box */}
                <div className="space-y-2 rounded-xl bg-background/80 border border-card-border/80 p-3.5 text-xs">
                  {/* Viral Claim (Red) */}
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-accent-red shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-accent-red">The Viral Claim: </span>
                      <span className="text-foreground/90 italic font-medium">{c.viralClaim}</span>
                    </div>
                  </div>

                  {/* Verified Reality (Green) */}
                  <div className="flex items-start gap-2 pt-2 border-t border-card-border/50">
                    <CheckCircle2 className="h-4 w-4 text-accent-green shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-accent-green">The Verified Reality: </span>
                      <span className="text-foreground/90 font-medium">{c.verifiedReality}</span>
                    </div>
                  </div>
                </div>

                {/* Forensic Detection Vectors */}
                <div>
                  <div className="text-[11px] font-bold text-muted uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-accent-blue" />
                    Forensic Vectors Deployed:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.forensicMethods.map((m, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-card-border"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Educational Lesson */}
                <div className="rounded-xl bg-accent-blue/5 border border-accent-blue/20 p-3 text-xs text-foreground/90 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-accent-blue shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-accent-blue">Key Fact-Check Takeaway: </strong>
                    <span>{c.lesson}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-5 border-t border-card-border flex items-center justify-between gap-3">
                <Link
                  href={c.route}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-accent-blue px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-accent-blue/20 hover:bg-accent-blue/90 hover:shadow-accent-blue/35 transition-all duration-200"
                >
                  Inspect Full Report
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
