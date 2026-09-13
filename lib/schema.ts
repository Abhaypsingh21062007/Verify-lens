import { z } from 'zod';
import { VerdictCategory } from './types';

// Zod schemas corresponding to the types in lib/types.ts

const FindingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  evidenceIds: z.array(z.string()),
});

const EvidenceItemSchema = z.object({
  id: z.string(),
  type: z.enum(['image', 'text', 'link', 'metadata', 'forensic']),
  content: z.string(),
  source: z.string(),
  url: z.string().optional(),
  confidence: z.number(),
});

const TimelineEventSchema = z.object({
  id: z.string(),
  date: z.string(),
  label: z.string(),
  description: z.string(),
  type: z.enum(['media', 'claim', 'source', 'contradiction', 'investigation']),
  certainty: z.enum(['Confirmed', 'Likely', 'Observed', 'Reported', 'Unclear']),
  evidenceIds: z.array(z.string()),
});

const GraphNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum([
    'current-claim',
    'uploaded-media',
    'earlier-media',
    'original-source',
    'news-article',
    'fact-check',
    'official-source',
    'contradiction',
    'supporting-evidence'
  ]),
  detail: z.string().optional(),
});

const GraphEdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string(),
});

const CounterfactualMetricsSchema = z.object({
  fileAuthenticity: z.number(),
  claimAccuracy: z.number(),
  contextRisk: z.number(),
});

const CounterfactualResultSchema = z.object({
  id: z.string(),
  scenario: z.string(),
  verdict: z.string(),
  confidence: z.number(),
  explanation: z.string(),
  changedFactors: z.array(z.string()),
  metrics: CounterfactualMetricsSchema,
});

const ComparisonCardSchema = z.object({
  label: z.string(),
  caption: z.string(),
  date: z.string(),
  location: z.string(),
  sourceLabel: z.enum(['Reported', 'Observed', 'Likely', 'Unclear']),
});

const MismatchItemSchema = z.object({
  dimension: z.string(),
  level: z.enum(['High', 'Medium', 'Low', 'None', 'Unclear']),
  detail: z.string().optional(),
});

const ClaimMediaConsistencyDataSchema = z.object({
  claimText: z.string(),
  evidenceSummary: z.string(),
  interpretation: z.string(),
  mismatches: z.array(MismatchItemSchema),
  currentPost: ComparisonCardSchema,
  earlierSource: ComparisonCardSchema,
});

const SourceCardInfoSchema = z.object({
  id: z.string(),
  publisher: z.string(),
  sourceType: z.enum(['Official', 'News', 'Fact-check', 'Social Media', 'Blog', 'Unknown']),
  date: z.string(),
  cluster: z.string(),
  alignment: z.enum(['Supports', 'Contradicts', 'Neutral']),
  reliability: z.enum(['High', 'Medium', 'Low', 'Unknown']),
  excerpt: z.string(),
});

const SourceIndependenceDataSchema = z.object({
  totalFound: z.number(),
  independentClusters: z.number(),
  copiedSources: z.number(),
  officialSources: z.number(),
  factCheckSources: z.number(),
  anonymousSocial: z.number(),
  sourceCards: z.array(SourceCardInfoSchema),
});

const ExplainabilityFindingSchema = z.object({
  score: z.number(),
  modelVersion: z.string(),
  interval: z.string(),
  explanation: z.string(),
  limitation: z.string(),
});

const ExplainabilityDataSchema = z.object({
  visual: ExplainabilityFindingSchema.extend({
    region: z.string(),
  }),
  audio: ExplainabilityFindingSchema,
  lipSync: ExplainabilityFindingSchema,
});

const ProvenanceDataSchema = z.object({
  sha256: z.string(),
  perceptualHash: z.string(),
  fileType: z.string(),
  fileSize: z.string(),
  creationMetadata: z.string(),
  modificationMetadata: z.string(),
  editingSoftware: z.string(),
  c2paStatus: z.enum([
    'Verified provenance',
    'Partial provenance',
    'No provenance found',
    'Conflicting provenance',
    'Invalid provenance'
  ]),
  firstObservedOnline: z.string(),
  transformationsDetected: z.string(),
});

const VoiceAnalysisDataSchema = z.object({
  transcript: z.string(),
  language: z.string(),
  englishMeaning: z.string(),
  confidence: z.number(),
  extractedClaims: z.array(z.string()),
  providerName: z.string(),
});

export const InvestigationReportSchema = z.object({
  investigationId: z.string(),
  verdict: z.nativeEnum(VerdictCategory),
  fileAuthenticity: z.number(),
  claimAccuracy: z.number(),
  provenanceConfidence: z.number(),
  evidenceStrength: z.number(),
  summary: z.string(),
  findings: z.array(FindingSchema),
  evidence: z.array(EvidenceItemSchema),
  timeline: z.array(TimelineEventSchema),
  knowledgeGraph: z.object({
    nodes: z.array(GraphNodeSchema),
    edges: z.array(GraphEdgeSchema),
  }),
  counterfactuals: z.array(CounterfactualResultSchema).optional(),
  claimMediaConsistency: ClaimMediaConsistencyDataSchema.optional(),
  sourceIndependence: SourceIndependenceDataSchema.optional(),
  explainability: ExplainabilityDataSchema.optional(),
  provenance: ProvenanceDataSchema.optional(),
  voiceAnalysis: VoiceAnalysisDataSchema.optional(),
  requiresHumanReview: z.boolean().optional(),
});
