import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ScanSearch,
  History,
  ShieldCheck,
  Eye,
  Zap,
  Globe,
} from 'lucide-react';
import { features } from '@/lib/mock-data';

import SampleCaseSelector from '@/components/investigation/SampleCaseSelector';

const iconMap: Record<string, typeof ScanSearch> = {
  ScanSearch,
  History,
  ShieldCheck,
};

const colorMap: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  red: {
    text: 'text-accent-red',
    bg: 'bg-accent-red-dim',
    border: 'border-accent-red/20',
    glow: 'group-hover:shadow-accent-red/10',
  },
  blue: {
    text: 'text-accent-blue',
    bg: 'bg-accent-blue-dim',
    border: 'border-accent-blue/20',
    glow: 'group-hover:shadow-accent-blue/10',
  },
  green: {
    text: 'text-accent-green',
    bg: 'bg-accent-green-dim',
    border: 'border-accent-green/20',
    glow: 'group-hover:shadow-accent-green/10',
  },
  amber: {
    text: 'text-accent-amber',
    bg: 'bg-accent-amber-dim',
    border: 'border-accent-amber/20',
    glow: 'group-hover:shadow-accent-amber/10',
  },
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />
      <div className="absolute inset-0 radial-glow pointer-events-none" />

      {/* ── Hero Section ──────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-20">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-accent-blue/20 bg-accent-blue-dim px-4 py-1.5 text-xs font-medium text-accent-blue">
            <Sparkles className="h-3.5 w-3.5" />
            Context-Aware Media Investigation
          </div>

          {/* Heading */}
          <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
            Verify the story{' '}
            <span className="gradient-text">behind the media.</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up delay-200 mx-auto max-w-2xl text-lg sm:text-xl text-muted leading-relaxed">
            Detect manipulation, trace earlier versions, and discover when real media
            is used with a false claim.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/investigate"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-accent-blue px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              Start Investigation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/report/sample-001"
              className="group inline-flex items-center gap-2.5 rounded-xl border border-card-border bg-card/60 px-7 py-3.5 text-sm font-semibold text-foreground hover:bg-card hover:border-muted/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              <Eye className="h-4 w-4 text-muted group-hover:text-accent-blue transition-colors" />
              Try Sample Case
            </Link>
          </div>
        </div>

        {/* Decorative floating elements */}
        <div className="hidden lg:block absolute -right-16 top-32 w-72 h-72 rounded-full bg-accent-blue/[0.04] blur-3xl animate-float" />
        <div className="hidden lg:block absolute -left-20 top-60 w-56 h-56 rounded-full bg-purple-500/[0.04] blur-3xl animate-float delay-200" />
      </section>

      {/* ── Feature Cards ─────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = iconMap[feature.icon] || ScanSearch;
              const colors = colorMap[feature.color] || colorMap.blue;

              return (
                <div
                  key={feature.title}
                  className={`group relative rounded-2xl border border-card-border bg-card p-6 sm:p-8 transition-all duration-300 hover:border-muted/30 hover:-translate-y-1 hover:shadow-2xl ${colors.glow} animate-fade-in-up`}
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} mb-5 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Interactive Demo Studies Section ───────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-6xl">
          <SampleCaseSelector />
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              How It Works
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Four questions, answered with evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ScanSearch,
                num: '01',
                title: 'Is it manipulated?',
                desc: 'Forensic analysis checks for splicing, cloning, AI-generation, and metadata inconsistencies.',
                color: 'blue',
              },
              {
                icon: ShieldCheck,
                num: '02',
                title: 'Is the claim supported?',
                desc: 'Cross-reference the attached caption or narrative against trusted, verified sources.',
                color: 'green',
              },
              {
                icon: History,
                num: '03',
                title: 'Is it being reused?',
                desc: 'Trace the media back to its earliest known appearance to detect out-of-context reuse.',
                color: 'amber',
              },
              {
                icon: Zap,
                num: '04',
                title: 'What\'s the evidence?',
                desc: 'Every conclusion is backed by explainable evidence you can review and share.',
                color: 'red',
              },
            ].map((item, i) => {
              const colors = colorMap[item.color];
              return (
                <div
                  key={item.num}
                  className="relative rounded-2xl border border-card-border bg-card p-6 space-y-4 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-black ${colors.text} opacity-40`}>
                      {item.num}
                    </span>
                    <item.icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────── */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-accent-blue/20 bg-gradient-to-br from-accent-blue-dim to-card p-8 sm:p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-blue/10 border border-accent-blue/20">
              <Globe className="h-7 w-7 text-accent-blue" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Ready to investigate?
            </h2>
            <p className="text-muted max-w-lg mx-auto">
              Upload any image, video, or audio along with the claim you want to verify.
              VerifyLens will do the rest.
            </p>
            <Link
              href="/investigate"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-accent-blue px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-accent-blue/25 hover:shadow-accent-blue/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start Investigation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
