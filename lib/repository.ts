// ============================================================
// VerifyLens – Investigation Repository (Mock)
// ============================================================
// Simple in-memory store. In production this would be backed
// by a database (Postgres, Supabase, etc.).

import type { LegacyInvestigationReport as InvestigationReport, Investigation } from './types';
import { mockInvestigations } from './mock-data';

// Clone mock data to avoid mutation issues
const store: Map<string, any> = new Map(
  mockInvestigations.map((r) => [r.id, { ...r }]),
);

/** Get a report by its id. */
export function getReport(id: string): any | undefined {
  return store.get(id);
}

/** Get all stored reports, newest first. */
export function getAllReports(): any[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime(),
  );
}

/** Save (or update) a report. */
export function saveReport(report: any): void {
  // Use investigationId or id based on type
  const id = report.investigationId || report.id;
  store.set(id, report);
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

