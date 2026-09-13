// ============================================================
// VerifyLens – Investigation Repository (Mock)
// ============================================================
// Simple in-memory store. In production this would be backed
// by a database (Postgres, Supabase, etc.).

import type { InvestigationReport, Investigation } from './types';
import { mockCases } from './mock-data';

// Seed store with modern InvestigationReport mock cases
const store: Map<string, InvestigationReport> = new Map(
  mockCases.map((r) => [r.investigationId, { ...r }]),
);

/** Get a report by its id or investigationId. */
export function getReport(id: string): InvestigationReport | undefined {
  const direct = store.get(id);
  if (direct) return direct;
  return mockCases.find((c) => c.investigationId === id);
}

/** Get all stored reports. */
export function getAllReports(): InvestigationReport[] {
  return Array.from(store.values());
}

/** Save (or update) a report. */
export function saveReport(report: any): void {
  const id = report.investigationId || report.id;
  if (id) {
    store.set(id, report);
  }
}

/** Delete a report by id. Returns true if it existed. */
export function deleteReport(id: string): boolean {
  return store.delete(id);
}

// ── New Data Model Support ──────────────────────────────────

const newStore: Map<string, Investigation> = new Map();

export function saveInvestigation(inv: Investigation): void {
  newStore.set(inv.id, inv);
}

export function getInvestigation(id: string): Investigation | undefined {
  return newStore.get(id);
}

