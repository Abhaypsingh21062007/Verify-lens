// ============================================================
// VerifyLens – Analysis Engine (Mock)
// ============================================================
// In production this module would orchestrate calls to forensic
// APIs, reverse-image-search services, and LLM-backed
// context-verification pipelines. For now it returns mock
// results after a simulated delay.

import type { InvestigationInput, LegacyInvestigationReport as InvestigationReport } from './types';
import { sampleReport } from './mock-data';

let nextId = 1;

function generateId(): string {
  return `inv-${Date.now()}-${nextId++}`;
}

/**
 * Simulate an investigation.
 *
 * In the real implementation this would:
 *  1. Upload the media to a forensic analysis backend
 *  2. Run manipulation detection (ELA, GAN detection, metadata)
 *  3. Perform reverse-image search for provenance
 *  4. Cross-reference the claim against trusted sources
 *  5. Synthesise evidence into a verdict
 *
 * For now we return the sample report with a fresh id.
 */
export async function runInvestigation(
  _input: InvestigationInput,
): Promise<InvestigationReport> {
  // Simulate network + processing delay
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const report: InvestigationReport = {
    ...sampleReport,
    id: generateId(),
    createdAt: new Date().toISOString(),
    claim: _input.claim || sampleReport.claim,
    status: 'complete',
  };

  return report;
}

/**
 * Simulate analysis progress updates.
 * Returns an async generator that yields progress messages.
 */
export async function* analyzeWithProgress(
): AsyncGenerator<{ step: string; progress: number }> {
  const steps = [
    { step: 'Uploading media…', progress: 10 },
    { step: 'Running manipulation detection…', progress: 25 },
    { step: 'Performing ELA analysis…', progress: 40 },
    { step: 'Checking for AI-generation markers…', progress: 55 },
    { step: 'Searching for earlier appearances…', progress: 70 },
    { step: 'Cross-referencing claim with databases…', progress: 85 },
    { step: 'Synthesising report…', progress: 95 },
    { step: 'Complete', progress: 100 },
  ];

  for (const s of steps) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    yield s;
  }
}
