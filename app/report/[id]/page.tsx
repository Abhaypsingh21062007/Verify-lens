import { ArrowLeft, Share2, Download } from 'lucide-react';
import Link from 'next/link';
import { mockCases } from '@/lib/mock-data';
import ReportView from '@/components/report/ReportView';
import DeleteReportButton from '@/components/report/DeleteReportButton';
import { getReport } from '@/lib/repository';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InvestigationReport } from '@/lib/types';

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ReportPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Report ${id} — VerifyLens`,
    description: 'Detailed investigation report from VerifyLens.',
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;

  // Attempt to find in in-memory store (AI generated), then static mock cases
  let report: InvestigationReport | undefined = getReport(id);
  
  if (!report) {
    report = mockCases.find(c => c.investigationId === id);
  }

  if (!report) {
    // We could generate a mock on the fly if it's a new ID
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
              Back to home
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href={`/shared/${id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-foreground hover:border-muted/30 transition-all"
                title="Share report"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Link>
              <Link
                href={`/report/${id}/print`}
                className="inline-flex items-center gap-2 rounded-lg border border-card-border px-4 py-2 text-xs font-medium text-muted hover:text-foreground hover:border-muted/30 transition-all"
                title="Export report"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </Link>
              <div className="w-px h-6 bg-card-border mx-1"></div>
              <DeleteReportButton />
            </div>
          </div>

          {/* Report */}
          <Suspense fallback={
            <div className="animate-pulse space-y-6">
              <div className="h-40 bg-card rounded-2xl border border-card-border"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-24 bg-card rounded-xl border border-card-border"></div>
                <div className="h-24 bg-card rounded-xl border border-card-border"></div>
                <div className="h-24 bg-card rounded-xl border border-card-border"></div>
                <div className="h-24 bg-card rounded-xl border border-card-border"></div>
              </div>
            </div>
          }>
            <ReportView report={report} />
          </Suspense>

          {/* Footer CTA */}
          <div className="mt-12 text-center animate-fade-in-up delay-300">
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
