'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { mockCases } from '@/lib/mock-data';
import { getVerdictLabel } from '@/lib/types';

export default function PrintReportPage() {
  const pathname = usePathname();
  // pathname is something like /report/sample-001/print
  const id = pathname.split('/')[2];

  useEffect(() => {
    // Slight delay to ensure fonts/layout render before print dialog
    const timer = setTimeout(() => {
      window.print();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  let report = mockCases.find(c => c.investigationId === id);
  if (!report) {
    report = mockCases[0]; // fallback
  }

  const creationTime = new Date().toLocaleString();

  return (
    <div className="bg-white min-h-screen text-black p-8 font-sans max-w-4xl mx-auto">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="border-b-2 border-gray-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-1">VerifyLens Investigation Report</h1>
          <p className="text-sm text-gray-600 font-mono">ID: {report.investigationId}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Generated on:</p>
          <p className="text-sm font-semibold">{creationTime}</p>
        </div>
      </div>

      {/* ── Verdict ────────────────────────────────────── */}
      <div className="mb-10 p-6 border-2 border-gray-900 rounded-lg">
        <h2 className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2">Final Verdict</h2>
        <p className="text-2xl font-black mb-3">
          {report.investigationId === 'real-false-context' 
            ? 'REAL MEDIA, FALSE CONTEXT' 
            : getVerdictLabel(report.verdict).toUpperCase()}
        </p>
        <p className="text-gray-800 text-lg">
          {report.summary}
        </p>
      </div>

      {/* ── Confidence Metrics ─────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Core Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 rounded-md flex justify-between items-center border border-gray-200">
            <span className="font-semibold text-gray-700">File Authenticity</span>
            <span className="text-2xl font-black">{report.fileAuthenticity}%</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-md flex justify-between items-center border border-gray-200">
            <span className="font-semibold text-gray-700">Claim Accuracy</span>
            <span className="text-2xl font-black">{report.claimAccuracy}%</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-md flex justify-between items-center border border-gray-200">
            <span className="font-semibold text-gray-700">Provenance Confidence</span>
            <span className="text-2xl font-black">{report.provenanceConfidence}%</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-md flex justify-between items-center border border-gray-200">
            <span className="font-semibold text-gray-700">Evidence Strength</span>
            <span className="text-2xl font-black">{report.evidenceStrength}%</span>
          </div>
        </div>
      </div>

      {/* ── Timeline ───────────────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Investigation Timeline</h3>
        <ul className="space-y-4">
          {report.timeline?.map((event, idx) => (
            <li key={idx} className="flex gap-4">
              <div className="w-32 shrink-0 text-sm font-semibold text-gray-600">{event.date}</div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{event.label}</div>
                <div className="text-sm text-gray-700">{event.description}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Evidence Sources ───────────────────────────── */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">Key Evidence Sources</h3>
        <ul className="space-y-4">
          {report.sourceIndependence?.sourceCards.map(source => (
            <li key={source.id} className="p-4 border border-gray-300 rounded-md bg-gray-50 break-inside-avoid">
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold">{source.publisher}</div>
                <div className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded">{source.sourceType}</div>
              </div>
              <div className="text-sm text-gray-600 mb-2">{source.date} | {source.alignment}</div>
              <p className="text-sm italic text-gray-800 border-l-2 border-gray-400 pl-3">
                {source.excerpt}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Limitations & Disclaimer ───────────────────── */}
      <div className="mt-16 pt-6 border-t-2 border-gray-900 text-sm text-gray-600">
        <h4 className="font-bold mb-2 text-gray-900">Important Limitations</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>These indicators summarize available evidence. They are not absolute proof.</li>
          <li>Missing provenance does not prove that media is fake. Provenance describes file history, not whether the attached story is true.</li>
          <li>Source count is not the same as source independence. Multiple pages may repeat one original claim.</li>
          <li>Heatmaps and model scores are indicators of statistical anomalies that require contextual interpretation.</li>
        </ul>
      </div>
      
      {/* Print styles to hide the page on screen and ensure clean print formatting */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
    </div>
  );
}
