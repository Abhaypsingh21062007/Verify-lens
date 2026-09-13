// ============================================================
// VerifyLens – Mock Data for Development
// ============================================================

import type {
  LegacyInvestigationReport,
  InvestigationReport,
  Feature,
  VerdictCategory,
} from './types';

// ── Features shown on the landing page ──────────────────────

export const features: Feature[] = [
  {
    icon: 'ScanSearch',
    title: 'Detect Manipulation',
    description:
      'Analyse images and videos for signs of AI-generation, splicing, cloning, and metadata tampering using multi-layered forensic checks.',
    color: 'red',
  },
  {
    icon: 'History',
    title: 'Trace Media History',
    description:
      'Reverse-search media across the web to find its earliest appearance, original context, and every known reuse.',
    color: 'blue',
  },
  {
    icon: 'ShieldCheck',
    title: 'Verify Context',
    description:
      'Cross-reference claimed dates, locations, and events against verified sources to spot when real media is paired with a false narrative.',
    color: 'green',
  },
];

// ── Sample investigation report ─────────────────────────────

export const sampleReport: LegacyInvestigationReport = {
  id: 'sample-001',
  createdAt: '2026-09-10T14:30:00Z',
  mediaUrl: '/sample/earthquake-building.jpg',
  mediaType: 'image',
  claim:
    'This photo shows the aftermath of a magnitude 7.2 earthquake that struck Istanbul, Turkey on September 8, 2026.',
  status: 'complete',
  manipulation: {
    verdict: 'authentic',
    confidence: 92,
    techniques: [],
    evidence: [
      {
        id: 'man-1',
        title: 'ELA Analysis Clean',
        description:
          'Error Level Analysis shows uniform compression artefacts consistent with a single-capture JPEG. No localised edits detected.',
        sentiment: 'supporting',
        confidence: 94,
        source: 'Forensic ELA Engine',
      },
      {
        id: 'man-2',
        title: 'Metadata Intact',
        description:
          'EXIF data is internally consistent — camera model, GPS coordinates, and timestamp all align with the claimed context.',
        sentiment: 'supporting',
        confidence: 91,
        source: 'Metadata Analyser',
      },
      {
        id: 'man-3',
        title: 'No AI-Generation Markers',
        description:
          'GAN / diffusion-model detector returned a 3% synthetic probability, well within the authentic range.',
        sentiment: 'supporting',
        confidence: 96,
        source: 'AI-Gen Detector v2',
      },
    ],
  },
  provenance: {
    earliestKnownDate: '2023-02-06T09:15:00Z',
    earliestKnownSource: 'Reuters',
    appearances: [
      {
        id: 'app-1',
        url: 'https://www.reuters.com/world/middle-east/earthquake-turkey-2023-02-06/',
        date: '2023-02-06T09:15:00Z',
        source: 'Reuters',
        title: 'Massive earthquake devastates southeastern Turkey',
        context:
          'Published as part of coverage of the February 2023 Turkey–Syria earthquake.',
      },
      {
        id: 'app-2',
        url: 'https://www.bbc.com/news/world-64533851',
        date: '2023-02-06T10:45:00Z',
        source: 'BBC News',
        title: 'Turkey earthquake: Thousands feared dead',
        context:
          'Used in lead image gallery covering the same February 2023 event.',
      },
      {
        id: 'app-3',
        url: 'https://example-blog.com/istanbul-earthquake-2026',
        date: '2026-09-08T18:00:00Z',
        source: 'Unverified Blog',
        title: 'Breaking: Istanbul rocked by major earthquake',
        context:
          'Reused without attribution to describe a supposed September 2026 Istanbul earthquake.',
      },
    ],
    evidence: [
      {
        id: 'prov-1',
        title: 'Image Pre-dates Claim by 3+ Years',
        description:
          'The earliest verified appearance of this image is from February 6, 2023, published by Reuters. The claim states September 8, 2026.',
        sentiment: 'contradicting',
        confidence: 98,
        source: 'Reverse Image Search',
      },
      {
        id: 'prov-2',
        title: 'Original Context: Turkey–Syria 2023',
        description:
          'Multiple Tier-1 outlets used this photo to cover the February 2023 Turkey–Syria earthquake, not a 2026 Istanbul event.',
        sentiment: 'contradicting',
        confidence: 97,
        source: 'Source Attribution Engine',
      },
    ],
  },
  context: {
    claimVerdict: 'false',
    contextVerdict: 'misleading',
    claimedDate: '2026-09-08',
    actualDate: '2023-02-06',
    claimedLocation: 'Istanbul, Turkey',
    actualLocation: 'Southeastern Turkey (Kahramanmaraş)',
    claimedEvent: 'Magnitude 7.2 earthquake, September 2026',
    actualEvent: 'Magnitude 7.8 earthquake, February 2023',
    evidence: [
      {
        id: 'ctx-1',
        title: 'Date Mismatch',
        description:
          'The image was taken in February 2023, more than three years before the claimed date of September 8, 2026.',
        sentiment: 'contradicting',
        confidence: 99,
        source: 'Temporal Analysis',
      },
      {
        id: 'ctx-2',
        title: 'Location Mismatch',
        description:
          'GPS metadata and visual landmarks place the photo in Kahramanmaraş, southeastern Turkey — not Istanbul.',
        sentiment: 'contradicting',
        confidence: 95,
        source: 'Geolocation Engine',
      },
      {
        id: 'ctx-3',
        title: 'No Seismic Event Recorded',
        description:
          'USGS and EMSC databases show no magnitude 7+ earthquake near Istanbul on or around September 8, 2026.',
        sentiment: 'contradicting',
        confidence: 99,
        source: 'Seismic Database Cross-check',
      },
      {
        id: 'ctx-4',
        title: 'Photo Is Authentic',
        description:
          'Although the image itself is genuine, it is being reused in a completely fabricated context.',
        sentiment: 'neutral',
        confidence: 92,
        source: 'Integrated Summary',
      },
    ],
  },
  summary:
    'The image is authentic but is being reused with a fabricated claim. It originally depicted damage from the February 2023 Turkey–Syria earthquake (Kahramanmaraş) and was first published by Reuters. The claim that it shows a September 2026 Istanbul earthquake is false — no such seismic event is recorded.',
  overallVerdict: 'misleading',
};

// ── Repository of all investigations (mock) ──────────────────

export const mockInvestigations: LegacyInvestigationReport[] = [sampleReport];

// ── New Data Model Mock Cases ─────────────────────────────

export const mockCases: InvestigationReport[] = [
  {
    investigationId: 'misleading-info-video',
    verdict: 'LIKELY_MANIPULATED' as VerdictCategory,
    fileAuthenticity: 23,
    claimAccuracy: 10,
    provenanceConfidence: 85,
    evidenceStrength: 92,
    summary: 'A highly misleading video spreading false information. Forensic analysis reveals significant visual manipulation, lip-sync anomalies, and synthetic voice generation. The original footage has been traced and completely contradicts the current claim.',
    findings: [
      {
        id: 'f1',
        title: 'Deepfake Visual Anomalies detected',
        description: 'High-confidence manipulation detected around the subject\'s facial boundary, indicating a face-swap technique was used.',
        evidenceIds: ['e1']
      },
      {
        id: 'f2',
        title: 'Synthetic Voice Match',
        description: 'Spectral analysis confirms the audio track was generated using an AI text-to-speech model.',
        evidenceIds: ['e2']
      },
      {
        id: 'f3',
        title: 'Audio-Visual Desynchronization',
        description: 'Lip movements do not match the spoken phonemes, particularly during complex multi-syllabic words.',
        evidenceIds: ['e3']
      },
      {
        id: 'f4',
        title: 'Original Source Discovered',
        description: 'The base video is from a 2018 corporate presentation, which has been digitally altered to spread current misinformation.',
        evidenceIds: ['e4']
      }
    ],
    evidence: [
      {
        id: 'e1',
        type: 'forensic',
        content: 'Facial boundary artifacts detected by VerifyLens FaceNet-v3 with 95% confidence.',
        source: 'Visual Forensic Heatmap',
        confidence: 95
      },
      {
        id: 'e2',
        type: 'forensic',
        content: 'Audio spectrum matches ElevenLabs V2 generative footprint.',
        source: 'Audio Forensic Engine',
        confidence: 98
      },
      {
        id: 'e3',
        type: 'forensic',
        content: 'Lip-sync discrepancy of 120ms detected during key syllables.',
        source: 'AV-Sync Analyzer',
        confidence: 89
      },
      {
        id: 'e4',
        type: 'link',
        content: 'Original 2018 corporate presentation video found on YouTube.',
        source: 'Reverse Video Search',
        url: 'https://youtube.com/watch?v=example',
        confidence: 99
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        date: '2018-05-14T09:00:00Z',
        label: 'Original Authentic Video Published',
        description: 'The base footage was originally published as a corporate keynote presentation.',
        type: 'media',
        certainty: 'Confirmed',
        evidenceIds: ['e4']
      },
      {
        id: 'tl-2',
        date: '2026-09-12T14:20:00Z',
        label: 'Misleading Claim Posted',
        description: 'A heavily edited version of the video was posted on social media with a false caption spreading misinformation.',
        type: 'claim',
        certainty: 'Reported',
        evidenceIds: []
      },
      {
        id: 'tl-3',
        date: '2026-09-13T08:15:00Z',
        label: 'VerifyLens Analysis Initiated',
        description: 'Video analyzed using deep forensic scanning, immediately flagging face-swap and synthetic audio.',
        type: 'investigation',
        certainty: 'Confirmed',
        evidenceIds: ['e1', 'e2', 'e3']
      }
    ],
    knowledgeGraph: {
      nodes: [
        { id: 'n1', label: 'Misleading Viral Video', type: 'current-claim', detail: 'The manipulated video circulating on social media.' },
        { id: 'n2', label: 'Original 2018 Keynote', type: 'original-source', detail: 'The authentic base footage without audio or facial alterations.' },
        { id: 'n3', label: 'FaceNet-v3 Detector', type: 'supporting-evidence', detail: 'Flags high probability of face-swap manipulation.' },
        { id: 'n4', label: 'Audio AI Detector', type: 'supporting-evidence', detail: 'Flags 98% synthetic voice match.' }
      ],
      edges: [
        { id: 'ed1', source: 'n1', target: 'n2', label: 'manipulated from' },
        { id: 'ed2', source: 'n3', target: 'n1', label: 'detects deepfake in' },
        { id: 'ed3', source: 'n4', target: 'n1', label: 'detects synthetic audio in' }
      ]
    },
    claimMediaConsistency: {
      claimText: 'Breaking: Official spokesperson announces shocking new policy.',
      evidenceSummary: 'The video is a deepfake. The visual features and audio have been synthetically altered to put false words in the speaker\'s mouth.',
      interpretation: 'This is a high-risk coordinated piece of misinformation. The original footage has been completely hijacked.',
      mismatches: [
        { dimension: 'Visual Authenticity', level: 'High', detail: 'Subject face is digitally altered.' },
        { dimension: 'Audio Authenticity', level: 'High', detail: 'Voice is AI-generated.' },
        { dimension: 'Context', level: 'High', detail: 'Original video was a harmless 2018 corporate presentation.' }
      ],
      currentPost: {
        label: 'Current Misleading Post',
        caption: 'Breaking: Official spokesperson announces shocking new policy.',
        date: 'September 12, 2026',
        location: 'Unknown',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: 'Authentic Source',
        caption: 'Annual Corporate Keynote 2018',
        date: 'May 14, 2018',
        location: 'San Francisco, CA',
        sourceLabel: 'Observed'
      }
    },
    counterfactuals: [
      {
        id: 'cf-1',
        scenario: 'Without synthetic audio overlay',
        verdict: 'Visual manipulation remains evident',
        confidence: 95,
        explanation: 'Even if the synthetic audio is stripped, the visual face-swap artifacts remain highly detectable by our models.',
        changedFactors: ['Audio removed'],
        metrics: { fileAuthenticity: 20, claimAccuracy: 10, contextRisk: 90 }
      }
    ],
    sourceIndependence: {
      totalFound: 15,
      independentClusters: 2,
      copiedSources: 12,
      officialSources: 1,
      factCheckSources: 2,
      anonymousSocial: 10,
      sourceCards: [
        {
          id: 'src-1',
          publisher: 'FactCheck.org',
          sourceType: 'Fact-check',
          date: 'September 13, 2026',
          cluster: 'Fact Checks',
          alignment: 'Contradicts',
          reliability: 'High',
          excerpt: '"The viral video claiming a new policy is a confirmed deepfake..."'
        }
      ]
    },
    explainability: {
      visual: {
        score: 95,
        modelVersion: 'VerifyLens FaceNet-v3',
        interval: '00:08.5–00:15.2',
        region: 'Subject Face Boundary',
        explanation: 'Critical suspicion around the face boundary. Edge artifacts and temporal lighting inconsistencies confirm face-swap manipulation.',
        limitation: 'Extreme motion blur can occasionally trigger false positives, though not present here.'
      },
      audio: {
        score: 98,
        modelVersion: 'VerifyLens Audio-v2',
        interval: 'Full duration',
        explanation: 'The audio signal lacks natural breath patterns and exhibits spectral signatures identical to ElevenLabs generative models.',
        limitation: 'Heavy background noise reduction can sometimes mimic these spectral signatures.'
      },
      lipSync: {
        score: 89,
        modelVersion: 'VerifyLens Sync-v3.0',
        interval: '00:10.0–00:22.5',
        explanation: 'Significant delay and shape mismatch between audio phonemes and visual visemes during multi-syllabic words.',
        limitation: 'Low resolution video can reduce lip tracking confidence.'
      }
    },
    provenance: {
      sha256: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
      perceptualHash: 'pHash: 11001100 10101010 11110000 00001111',
      fileType: 'video/mp4',
      fileSize: '8.4 MB',
      creationMetadata: 'Stripped (No original EXIF)',
      modificationMetadata: 'Contains traces of Premiere Pro export',
      editingSoftware: 'Suspected Adobe Premiere Pro',
      c2paStatus: 'No provenance found',
      firstObservedOnline: '14 May 2018 (Original)',
      transformationsDetected: 'Face replacement, audio replacement, re-encoded'
    }
  },
  {
    investigationId: 'synthetic-interview',
    verdict: 'LIKELY_SYNTHETIC' as VerdictCategory,
    fileAuthenticity: 19,
    claimAccuracy: 58,
    provenanceConfidence: 22,
    evidenceStrength: 74,
    summary: 'A short interview with face, voice, and lip-sync inconsistencies.',
    findings: [
      {
        id: 'f5',
        title: 'Face boundary anomaly',
        description: 'Irregularities detected around the subject\'s facial edges.',
        evidenceIds: []
      },
      {
        id: 'f6',
        title: 'Lip-sync mismatch',
        description: 'Audio waveforms do not align with lip movements.',
        evidenceIds: []
      },
      {
        id: 'f7',
        title: 'Synthetic voice indicators',
        description: 'Spectral analysis shows patterns typical of AI voice generation.',
        evidenceIds: []
      }
    ],
    evidence: [],
    timeline: [],
    knowledgeGraph: { nodes: [], edges: [] },
    claimMediaConsistency: {
      claimText: 'This is an interview with the official spokesperson.',
      evidenceSummary: 'Facial features and voice patterns show indicators consistent with AI-generated media.',
      interpretation: 'No earlier matching source was found. The claim cannot be confirmed or denied based on provenance alone, but forensic signals suggest the media is likely synthetic.',
      mismatches: [
        { dimension: 'Date', level: 'Unclear', detail: 'No earlier version found to compare.' },
        { dimension: 'Location', level: 'Unclear', detail: 'No geolocation data available.' },
        { dimension: 'Event', level: 'Low', detail: 'Event existence is plausible but unverified.' },
        { dimension: 'Caption', level: 'Unclear', detail: 'Insufficient data for caption comparison.' }
      ],
      currentPost: {
        label: 'Current Post',
        caption: 'This is an interview with the official spokesperson.',
        date: 'Unknown (Reported)',
        location: 'Unknown (Reported)',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: 'Earlier Source',
        caption: 'No matching earlier source found.',
        date: 'N/A',
        location: 'N/A',
        sourceLabel: 'Unclear'
      }
    }
  },
  {
    investigationId: 'insufficient-evidence',
    requiresHumanReview: true,
    verdict: 'INSUFFICIENT_EVIDENCE' as VerdictCategory,
    fileAuthenticity: 51,
    claimAccuracy: 50,
    provenanceConfidence: 8,
    evidenceStrength: 22,
    summary: 'A compressed screenshot with no reliable source history.',
    findings: [
      {
        id: 'f8',
        title: 'No reliable matching source',
        description: 'Unable to trace the image back to a credible origin.',
        evidenceIds: []
      },
      {
        id: 'f9',
        title: 'Detector disagreement',
        description: 'Various forensic models produced conflicting authenticity scores.',
        evidenceIds: []
      },
      {
        id: 'f10',
        title: 'Poor-quality media',
        description: 'High compression artifacts prevent detailed pixel-level analysis.',
        evidenceIds: []
      }
    ],
    evidence: [],
    timeline: [],
    knowledgeGraph: { nodes: [], edges: [] },
    claimMediaConsistency: {
      claimText: 'A screenshot of the alleged government document was shared on social media.',
      evidenceSummary: 'The image is heavily compressed. No reliable earlier source was found, and forensic detectors produced conflicting results.',
      interpretation: 'There is not enough information to determine whether the media or the claim is authentic. The low resolution and absent metadata prevent a confident assessment.',
      mismatches: [
        { dimension: 'Date', level: 'Unclear', detail: 'No metadata or earlier version available for comparison.' },
        { dimension: 'Location', level: 'Unclear', detail: 'No geolocation data embedded or inferred.' },
        { dimension: 'Event', level: 'Unclear', detail: 'Cannot confirm or deny the referenced event.' },
        { dimension: 'Caption', level: 'Unclear', detail: 'Original context unknown.' }
      ],
      currentPost: {
        label: 'Current Post',
        caption: 'Alleged government document shared on social media.',
        date: 'Unknown (Reported)',
        location: 'Unknown (Reported)',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: 'Earlier Source',
        caption: 'No matching earlier source found.',
        date: 'N/A',
        location: 'N/A',
        sourceLabel: 'Unclear'
      }
    }
  },
  {
    investigationId: 'conflicting-evidence',
    requiresHumanReview: true,
    verdict: 'CONFLICTING_EVIDENCE' as VerdictCategory,
    fileAuthenticity: 50,
    claimAccuracy: 50,
    provenanceConfidence: 50,
    evidenceStrength: 50,
    summary: 'The evidence sources strongly disagree on the context of this media. Expert human review is advised.',
    findings: [
      {
        id: 'f11',
        title: 'Contradictory Fact-Checks',
        description: 'Two different independent fact-checking organisations reached opposite conclusions.',
        evidenceIds: []
      },
      {
        id: 'f12',
        title: 'Mixed Metadata',
        description: 'Some metadata suggests recent creation, while other tags suggest historical origin.',
        evidenceIds: []
      }
    ],
    evidence: [],
    timeline: [],
    knowledgeGraph: { nodes: [], edges: [] },
    claimMediaConsistency: {
      claimText: 'This video proves the existence of the newly discovered species.',
      evidenceSummary: 'There are multiple conflicting sources regarding the origin of this video. Some claim it is real, while others cite it as an AI-generated art project.',
      interpretation: 'Due to highly conflicting evidence, automated systems cannot confidently determine the authenticity of this claim. Human review is recommended.',
      mismatches: [
        { dimension: 'Date', level: 'Unclear', detail: 'Conflicting dates found in metadata.' },
        { dimension: 'Location', level: 'Unclear', detail: 'Conflicting location data.' },
        { dimension: 'Event', level: 'Unclear', detail: 'Contradictory reports.' },
        { dimension: 'Caption', level: 'Unclear', detail: 'Contradictory reports.' }
      ],
      currentPost: {
        label: 'Current Post',
        caption: 'This video proves the existence of the newly discovered species.',
        date: 'Unknown',
        location: 'Unknown',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: 'Earlier Source',
        caption: 'Conflicting sources found.',
        date: 'N/A',
        location: 'N/A',
        sourceLabel: 'Unclear'
      }
    }
  }
];
