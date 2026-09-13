// ============================================================
// VerifyLens – Core Type Definitions
// ============================================================

export type InputType = 'image' | 'video' | 'audio' | 'text';
export type InvestigationStatus = 'pending' | 'processing' | 'completed' | 'failed';

export enum VerdictCategory {
  AUTHENTIC_AND_SUPPORTED = 'AUTHENTIC_AND_SUPPORTED',
  AUTHENTIC_FALSE_CONTEXT = 'AUTHENTIC_FALSE_CONTEXT',
  LIKELY_MANIPULATED = 'LIKELY_MANIPULATED',
  LIKELY_SYNTHETIC = 'LIKELY_SYNTHETIC',
  CLAIM_CONTRADICTED = 'CLAIM_CONTRADICTED',
  INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE',
  CONFLICTING_EVIDENCE = 'CONFLICTING_EVIDENCE',
}

export interface MediaAsset {
  id: string;
  type: InputType;
  url: string;
  hash?: string;
  metadata?: Record<string, unknown>;
}

export interface Claim {
  id: string;
  content: string;
  source?: string;
  dateMade?: string; // ISO date string
}

export interface EvidenceItem {
  id: string;
  type: 'image' | 'text' | 'link' | 'metadata' | 'forensic';
  content: string;
  source: string;
  url?: string;
  confidence: number;
}

export type TimelineEventType = 'media' | 'claim' | 'source' | 'contradiction' | 'investigation';
export type CertaintyLabel = 'Confirmed' | 'Likely' | 'Observed' | 'Reported' | 'Unclear';

export interface TimelineEvent {
  id: string;
  date: string; // ISO date string
  label: string;
  description: string;
  type: TimelineEventType;
  certainty: CertaintyLabel;
  evidenceIds: string[];
}


export type GraphNodeType =
  | 'current-claim'
  | 'uploaded-media'
  | 'earlier-media'
  | 'original-source'
  | 'news-article'
  | 'fact-check'
  | 'official-source'
  | 'contradiction'
  | 'supporting-evidence';

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  detail?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface CounterfactualMetrics {
  fileAuthenticity: number;
  claimAccuracy: number;
  contextRisk: number;
}

export interface CounterfactualResult {
  id: string;
  scenario: string;
  verdict: string;
  confidence: number;
  explanation: string;
  changedFactors: string[];
  metrics: CounterfactualMetrics;
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  evidenceIds: string[];
}

export interface AnalysisStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
  details?: string;
}

export interface Investigation {
  id: string;
  status: InvestigationStatus;
  createdAt: string;
  updatedAt: string;
  assets: MediaAsset[];
  claims: Claim[];
  steps: AnalysisStep[];
}

export type MismatchLevel = 'High' | 'Medium' | 'Low' | 'None' | 'Unclear';
export type EvidenceLabel = 'Reported' | 'Observed' | 'Likely' | 'Unclear';

export interface ComparisonCard {
  label: string;
  caption: string;
  date: string;
  location: string;
  sourceLabel: EvidenceLabel;
}

export interface MismatchItem {
  dimension: string;
  level: MismatchLevel;
  detail?: string;
}

export interface ClaimMediaConsistencyData {
  claimText: string;
  evidenceSummary: string;
  interpretation: string;
  mismatches: MismatchItem[];
  currentPost: ComparisonCard;
  earlierSource: ComparisonCard;
}

export interface SourceCardInfo {
  id: string;
  publisher: string;
  sourceType: 'Official' | 'News' | 'Fact-check' | 'Social Media' | 'Blog' | 'Unknown';
  date: string;
  cluster: string;
  alignment: 'Supports' | 'Contradicts' | 'Neutral';
  reliability: 'High' | 'Medium' | 'Low' | 'Unknown';
  excerpt: string;
}

export interface SourceIndependenceData {
  totalFound: number;
  independentClusters: number;
  copiedSources: number;
  officialSources: number;
  factCheckSources: number;
  anonymousSocial: number;
  sourceCards: SourceCardInfo[];
}

export interface ExplainabilityFinding {
  score: number; // 0-100
  modelVersion: string;
  interval: string; // e.g., "00:12.4–00:13.8"
  explanation: string;
  limitation: string;
}

export interface ExplainabilityData {
  visual: ExplainabilityFinding & {
    region: string; // e.g., "Face boundary"
  };
  audio: ExplainabilityFinding;
  lipSync: ExplainabilityFinding;
}

export type ProvenanceStatus = 
  | 'Verified provenance'
  | 'Partial provenance'
  | 'No provenance found'
  | 'Conflicting provenance'
  | 'Invalid provenance';

export interface ProvenanceData {
  sha256: string;
  perceptualHash: string;
  fileType: string;
  fileSize: string;
  creationMetadata: string;
  modificationMetadata: string;
  editingSoftware: string;
  c2paStatus: ProvenanceStatus;
  firstObservedOnline: string;
  transformationsDetected: string;
}

export interface VoiceAnalysisData {
  transcript: string;
  language: string;
  englishMeaning: string;
  confidence: number;
  extractedClaims: string[];
  providerName: string;
}

export interface InvestigationReport {
  investigationId: string;
  verdict: VerdictCategory;
  fileAuthenticity: number; // 0-100
  claimAccuracy: number; // 0-100
  provenanceConfidence: number; // 0-100
  evidenceStrength: number; // 0-100
  summary: string;
  findings: Finding[];
  evidence: EvidenceItem[];
  timeline: TimelineEvent[];
  knowledgeGraph: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  counterfactuals?: CounterfactualResult[];
  claimMediaConsistency?: ClaimMediaConsistencyData;
  sourceIndependence?: SourceIndependenceData;
  explainability?: ExplainabilityData;
  provenance?: ProvenanceData;
  voiceAnalysis?: VoiceAnalysisData;
  requiresHumanReview?: boolean;
}

// ============================================================
// Helper Functions
// ============================================================

export function getVerdictLabel(verdict: VerdictCategory): string {
  switch (verdict) {
    case VerdictCategory.AUTHENTIC_AND_SUPPORTED:
      return 'Authentic & Supported';
    case VerdictCategory.AUTHENTIC_FALSE_CONTEXT:
      return 'Authentic but False Context';
    case VerdictCategory.LIKELY_MANIPULATED:
      return 'Likely Manipulated';
    case VerdictCategory.LIKELY_SYNTHETIC:
      return 'Likely Synthetic (AI)';
    case VerdictCategory.CLAIM_CONTRADICTED:
      return 'Claim Contradicted';
    case VerdictCategory.INSUFFICIENT_EVIDENCE:
      return 'Insufficient Evidence';
    case VerdictCategory.CONFLICTING_EVIDENCE:
      return 'Conflicting Evidence';
    default:
      return 'Unknown';
  }
}

export function getVerdictColor(verdict: VerdictCategory): string {
  switch (verdict) {
    case VerdictCategory.AUTHENTIC_AND_SUPPORTED:
      return 'green';
    case VerdictCategory.AUTHENTIC_FALSE_CONTEXT:
      return 'amber';
    case VerdictCategory.LIKELY_MANIPULATED:
    case VerdictCategory.LIKELY_SYNTHETIC:
    case VerdictCategory.CLAIM_CONTRADICTED:
      return 'red';
    case VerdictCategory.INSUFFICIENT_EVIDENCE:
    case VerdictCategory.CONFLICTING_EVIDENCE:
      return 'blue';
    default:
      return 'gray';
  }
}

export function getConfidenceLabel(score: number): string {
  if (score >= 90) return 'Very High';
  if (score >= 75) return 'High';
  if (score >= 50) return 'Medium';
  if (score >= 25) return 'Low';
  return 'Very Low';
}

export function getAnalysisStepLabel(status: AnalysisStep['status']): string {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'failed': return 'Failed';
    default: return 'Unknown';
  }
}

// ============================================================
// Legacy Types (kept to prevent UI breakage until UI is updated)
// ============================================================

export type LegacyManipulationVerdict = 'authentic' | 'likely_authentic' | 'uncertain' | 'likely_manipulated' | 'manipulated';
export type LegacyClaimVerdict = 'supported' | 'partially_supported' | 'unverifiable' | 'misleading' | 'false';
export type LegacyContextVerdict = 'verified' | 'partially_verified' | 'uncertain' | 'misleading' | 'fabricated';
export type LegacyEvidenceSentiment = 'supporting' | 'contradicting' | 'neutral' | 'uncertain';
export type LegacyMediaType = 'image' | 'video' | 'audio';

export interface LegacyEvidence {
  id: string;
  title: string;
  description: string;
  sentiment: LegacyEvidenceSentiment;
  confidence: number;
  source: string;
  details?: string;
  imageUrl?: string;
}

export interface LegacyManipulationAnalysis {
  verdict: LegacyManipulationVerdict;
  confidence: number;
  techniques: string[];
  evidence: LegacyEvidence[];
  heatmapUrl?: string;
}

export interface LegacyMediaAppearance {
  id: string;
  url: string;
  date: string;
  source: string;
  title: string;
  context: string;
}

export interface LegacyProvenanceAnalysis {
  earliestKnownDate: string;
  earliestKnownSource: string;
  appearances: LegacyMediaAppearance[];
  evidence: LegacyEvidence[];
}

export interface LegacyContextAnalysis {
  claimVerdict: LegacyClaimVerdict;
  contextVerdict: LegacyContextVerdict;
  claimedDate?: string;
  actualDate?: string;
  claimedLocation?: string;
  actualLocation?: string;
  claimedEvent?: string;
  actualEvent?: string;
  evidence: LegacyEvidence[];
}

export interface LegacyInvestigationReport {
  id: string;
  createdAt: string;
  mediaUrl: string;
  mediaType: LegacyMediaType;
  claim: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  manipulation: LegacyManipulationAnalysis | null;
  provenance: LegacyProvenanceAnalysis | null;
  context: LegacyContextAnalysis | null;
  summary: string;
  overallVerdict: LegacyContextVerdict;
}

export interface InvestigationInput {
  mediaFile?: File;
  mediaUrl?: string;
  claim: string;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'red' | 'amber';
}

// ============================================================
// Heatmap Explainability Types
// ============================================================

export type HeatmapMode = 'original' | 'heatmap' | 'overlay' | 'side-by-side' | 'difference';

export interface HeatmapFinding {
  id: string;
  mediaType: 'photo' | 'video';
  timestamp?: string; // e.g. "00:13.1"
  frameIndex?: number;
  region: string;
  score: number; // 0-100
  severity: 'low' | 'medium' | 'high';
  reason: string;
  limitation: string;
  modelName: string;
  modelVersion: string;
  heatmapData: string; // URL or base64 or CSS gradient representation for demo
  confidence: number; // 0-100
}
