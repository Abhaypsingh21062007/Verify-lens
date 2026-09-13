import { ArrowLeft, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { mockCases } from '@/lib/mock-data';
import ReportView from '@/components/report/ReportView';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InvestigationReport } from '@/lib/types';

interface SharedReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharedReportPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Shared Report ${id} — VerifyLens`,
    description: 'Shared investigation report from VerifyLens.',
  };
}

export default async function SharedReportPage({ params }: SharedReportPageProps) {
  const { id } = await params;

  // Attempt to find in mock cases (static) or in-memory store
  let report: InvestigationReport | undefined = mockCases.find(c => c.investigationId === id);

  if (!report) {
    report = mockCases[0]; // fallback
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern pointer-events-none" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 animate-fade-in">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              VerifyLens Home
            </Link>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted border border-card-border px-3 py-1.5 rounded-full bg-card">
              <ShieldAlert className="h-3 w-3" />
              Read-Only View
            </div>
          </div>

          {/* Report (isShared = true) */}
          <Suspense fallback={
            <div className="animate-pulse space-y-6">
              <div className="h-40 bg-card rounded-2xl border border-card-border"></div>
            </div>
          }>
            <ReportView report={report} isShared={true} />
          </Suspense>

          {/* Footer CTA */}
          <div className="mt-12 text-center animate-fade-in-up delay-300">
            <h3 className="text-lg font-bold text-foreground mb-3">Investigate media yourself</h3>
            <Link
              href="/investigate"
              className="inline-flex items-center gap-2.5 rounded-xl bg-accent-blue px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-blue/20 hover:shadow-accent-blue/35 hover:-translate-y-0.5 transition-all duration-300"
            >
              Start New Investigation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
