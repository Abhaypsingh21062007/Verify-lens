// ============================================================
// VerifyLens – Mock Data for Development
// ============================================================

import { VerdictCategory } from './types';
import type {
  LegacyInvestigationReport,
  InvestigationReport,
  Feature,
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
    investigationId: 'sample-001',
    verdict: VerdictCategory.AUTHENTIC_FALSE_CONTEXT,
    fileAuthenticity: 94,
    claimAccuracy: 4,
    provenanceConfidence: 98,
    evidenceStrength: 96,
    summary: 'The photo is 100% authentic and unaltered, but it is being weaponized with a completely fabricated claim. Forensic pixel analysis and camera EXIF confirm this image was taken during the February 6, 2023 Turkey-Syria earthquake in Kahramanmaraş and originally published by Reuters. The viral claim that it depicts a magnitude 7.2 Istanbul earthquake today is false — official USGS and AFAD seismic registries confirm zero earthquake activity in Istanbul.',
    findings: [
      {
        id: 'f-s1',
        title: 'Authentic Photographic Capture',
        description: 'Error Level Analysis (ELA) displays uniform compression artifacts across the entire frame. No generative diffusion noise, cloning, or splicing detected.',
        evidenceIds: ['e-s1']
      },
      {
        id: 'f-s2',
        title: 'Earliest Appearance: February 6, 2023',
        description: 'Reverse visual search matched this exact frame to Reuters and BBC news wires published during the 2023 Kahramanmaraş earthquake (pre-dating the current post by over 3 years).',
        evidenceIds: ['e-s2']
      },
      {
        id: 'f-s3',
        title: 'Geolocation Discrepancy (800+ km Mismatch)',
        description: 'Landmark recognition and historical disaster logs locate this building in southeastern Turkey (Kahramanmaraş), not Istanbul.',
        evidenceIds: ['e-s3']
      },
      {
        id: 'f-s4',
        title: 'Seismic Monitoring Sensor Confirmation',
        description: 'USGS, EMSC, and AFAD real-time seismograph networks recorded zero magnitude 7+ earthquakes in the Marmara/Istanbul region on the claimed date.',
        evidenceIds: ['e-s4']
      }
    ],
    evidence: [
      {
        id: 'e-s1',
        type: 'forensic',
        content: 'Error Level Analysis (ELA) shows 94% compression consistency. No localized pixel tampering.',
        source: 'VerifyLens Forensic ELA Engine',
        confidence: 94
      },
      {
        id: 'e-s2',
        type: 'link',
        content: 'Original Reuters wire photo: "Massive earthquake devastates southeastern Turkey", published Feb 6, 2023.',
        source: 'Reuters Global News Wire',
        url: 'https://www.reuters.com/world/middle-east/earthquake-turkey-2023-02-06/',
        confidence: 99
      },
      {
        id: 'e-s3',
        type: 'metadata',
        content: 'Geographic coordinate tags correspond to Kahramanmaraş Province, southeastern Anatolia (820 km from Istanbul).',
        source: 'Geolocation & Landmark Analyzer',
        confidence: 96
      },
      {
        id: 'e-s4',
        type: 'link',
        content: 'USGS Earthquake Hazards Program real-time seismic bulletin confirms normal baseline activity.',
        source: 'USGS Global Seismographic Network',
        url: 'https://earthquake.usgs.gov',
        confidence: 99
      }
    ],
    timeline: [
      {
        id: 'tl-s1',
        date: '2023-02-06T09:15:00Z',
        label: 'Original Photo Captured & Published',
        description: 'Reuters photojournalist documents building collapse following the Mw 7.8 Kahramanmaraş earthquake.',
        type: 'media',
        certainty: 'Confirmed',
        evidenceIds: ['e-s2']
      },
      {
        id: 'tl-s2',
        date: '2023-02-06T10:45:00Z',
        label: 'Syndicated by Global News Outlets',
        description: 'BBC, CNN, and Associated Press syndicate the photo in initial disaster reporting.',
        type: 'media',
        certainty: 'Confirmed',
        evidenceIds: ['e-s2']
      },
      {
        id: 'tl-s3',
        date: '2026-09-08T18:00:00Z',
        label: 'Recycled on Social Media with False Narrative',
        description: 'Viral post circulates claiming: "Breaking: Magnitude 7.2 earthquake strikes Istanbul today with massive destruction."',
        type: 'claim',
        certainty: 'Reported',
        evidenceIds: []
      },
      {
        id: 'tl-s4',
        date: '2026-09-08T18:45:00Z',
        label: 'VerifyLens Automated Debunk Generated',
        description: 'System detects 3-year temporal discrepancy, authenticates image pixels, and issues context-hijack debunk.',
        type: 'investigation',
        certainty: 'Confirmed',
        evidenceIds: ['e-s1', 'e-s2', 'e-s4']
      }
    ],
    knowledgeGraph: {
      nodes: [
        { id: 'ng-1', label: 'Viral Istanbul Post', type: 'current-claim', detail: 'Claims magnitude 7.2 earthquake in Istanbul today' },
        { id: 'ng-2', label: '2023 Reuters Archive', type: 'original-source', detail: 'Authentic photo of Feb 2023 Turkey-Syria earthquake' },
        { id: 'ng-3', label: 'USGS Seismic Network', type: 'official-source', detail: 'Confirms zero seismic activity in Istanbul' },
        { id: 'ng-4', label: 'Forensic ELA Engine', type: 'supporting-evidence', detail: 'Confirms photograph is unmodified original pixels' }
      ],
      edges: [
        { id: 'eg-1', source: 'ng-1', target: 'ng-2', label: 'recycles image from' },
        { id: 'eg-2', source: 'ng-3', target: 'ng-1', label: 'contradicts claim' },
        { id: 'eg-3', source: 'ng-4', target: 'ng-2', label: 'verifies pixel integrity of' }
      ]
    },
    claimMediaConsistency: {
      claimText: 'This photo shows the aftermath of a magnitude 7.2 earthquake that struck Istanbul, Turkey on September 8, 2026.',
      evidenceSummary: 'The photograph is authentic, but the claimed date, location, and event are completely false. It is from the 2023 Kahramanmaraş earthquake.',
      interpretation: 'Classic context hijack (the most prevalent form of viral misinformation). Authentic imagery is exploited because it looks convincing to the naked eye.',
      mismatches: [
        { dimension: 'Date / Temporal', level: 'High', detail: 'Claimed: Sep 8, 2026. Actual: Feb 6, 2023 (3+ years prior).' },
        { dimension: 'Location', level: 'High', detail: 'Claimed: Istanbul. Actual: Kahramanmaraş (800+ km away).' },
        { dimension: 'Event Authenticity', level: 'High', detail: 'No magnitude 7+ earthquake occurred in Istanbul.' }
      ],
      currentPost: {
        label: 'Viral Misinformation Post',
        caption: 'Magnitude 7.2 earthquake strikes Istanbul, Turkey today with massive building collapses.',
        date: 'September 8, 2026',
        location: 'Istanbul, Turkey',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: 'Reuters Official Archive',
        caption: 'Building collapse in Kahramanmaraş after Mw 7.8 earthquake',
        date: 'February 6, 2023',
        location: 'Kahramanmaraş, Turkey',
        sourceLabel: 'Observed'
      }
    },
    counterfactuals: [
      {
        id: 'cf-s1',
        scenario: 'If this photo were AI-generated rather than real',
        verdict: 'Would be classified as LIKELY_MANIPULATED',
        confidence: 96,
        explanation: 'Because the image is genuine, traditional deepfake detectors fail to catch this lie. VerifyLens temporal and context cross-referencing is essential.',
        changedFactors: ['Synthetic pixel diffusion'],
        metrics: { fileAuthenticity: 15, claimAccuracy: 4, contextRisk: 98 }
      }
    ],
    sourceIndependence: {
      totalFound: 18,
      independentClusters: 3,
      copiedSources: 14,
      officialSources: 2,
      factCheckSources: 2,
      anonymousSocial: 14,
      sourceCards: [
        {
          id: 'src-s1',
          publisher: 'Reuters Fact Check',
          sourceType: 'Fact-check',
          date: 'September 8, 2026',
          cluster: 'Fact Checks',
          alignment: 'Contradicts',
          reliability: 'High',
          excerpt: '"Photo circulating online claiming to show Istanbul earthquake is from 2023 Turkey disaster..."'
        },
        {
          id: 'src-s2',
          publisher: 'USGS Earthquake Program',
          sourceType: 'Official',
          date: 'September 8, 2026',
          cluster: 'Seismic Sensors',
          alignment: 'Contradicts',
          reliability: 'High',
          excerpt: '"No significant seismic events detected in the Marmara Sea or Istanbul metropolitan region."'
        }
      ]
    },
    explainability: {
      visual: {
        score: 94,
        modelVersion: 'VerifyLens ELA-v4 & VisionCore',
        interval: 'Full frame',
        region: 'Entire Image',
        explanation: 'Error Level Analysis reveals uniform 8x8 block compression artifacts characteristic of native camera JPEG encoding. No splicing, cloned regions, or generative diffusion noise detected.',
        limitation: 'Multiple re-compressions across social platforms can slightly blur micro-artifacts, but macroscopic compression grid remains intact.'
      },
      audio: {
        score: 0,
        modelVersion: 'N/A',
        interval: 'N/A',
        explanation: 'Still image asset — audio forensics not applicable.',
        limitation: 'N/A'
      },
      lipSync: {
        score: 0,
        modelVersion: 'N/A',
        interval: 'N/A',
        explanation: 'Still image asset — lip sync not applicable.',
        limitation: 'N/A'
      }
    },
    provenance: {
      sha256: '9f83ab2c5d1e4f7a8b9c0d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a',
      perceptualHash: 'pHash: 11110000 10101010 00001111 01010101',
      fileType: 'image/jpeg',
      fileSize: '3.1 MB',
      creationMetadata: 'Canon EOS 5D Mark IV • 24-70mm f/2.8',
      modificationMetadata: 'Cropped & re-saved for web syndication',
      editingSoftware: 'Adobe Photoshop Lightroom Classic',
      c2paStatus: 'Verified provenance',
      firstObservedOnline: '6 Feb 2023 (Reuters)',
      transformationsDetected: 'Resolution downscaling and social media web compression'
    }
  },
  {
    investigationId: 'misleading-info-video',
    verdict: 'LIKELY_MANIPULATED' as VerdictCategory,
    fileAuthenticity: 23,
    claimAccuracy: 10,
    provenanceConfidence: 85,
    evidenceStrength: 92,
    summary: 'A highly sophisticated AI deepfake video spreading fabricated public policy statements. Forensic computer vision detected distinct face-swap boundary blending artifacts, accompanied by neural text-to-speech synthetic audio and phoneme-viseme lip-sync latency. The authentic base footage was traced to an unrelated 2018 corporate presentation.',
    findings: [
      {
        id: 'f1',
        title: 'Deepfake Visual Anomalies Detected',
        description: 'High-confidence manipulation detected around the subject\'s facial boundary, indicating a neural face-swap technique was used.',
        evidenceIds: ['e1']
      },
      {
        id: 'f2',
        title: 'Synthetic Voice Acoustic Footprint',
        description: 'Spectral analysis confirms the audio track was generated using an AI text-to-speech voice clone (ElevenLabs generative footprint).',
        evidenceIds: ['e2']
      },
      {
        id: 'f3',
        title: 'Audio-Visual Desynchronization',
        description: 'Lip movements do not match spoken phonemes, exhibiting a 120ms latency during complex multi-syllabic phrases.',
        evidenceIds: ['e3']
      },
      {
        id: 'f4',
        title: 'Original 2018 Source Discovered',
        description: 'The underlying video is an altered extract of a 2018 corporate keynote, completely unrelated to current government policies.',
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
        content: 'Audio spectrum matches ElevenLabs V2 generative neural footprint.',
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
        content: 'Original 2018 corporate presentation video indexed in public archive.',
        source: 'Reverse Video Search',
        url: 'https://youtube.com/watch?v=example',
        confidence: 99
      }
    ],
    timeline: [
      {
        id: 'tl-1',
        date: '2018-05-14T09:00:00Z',
        label: 'Original Authentic Keynote Broadcasted',
        description: 'The base footage was originally recorded and published as an annual tech keynote.',
        type: 'media',
        certainty: 'Confirmed',
        evidenceIds: ['e4']
      },
      {
        id: 'tl-2',
        date: '2026-09-12T14:20:00Z',
        label: 'Manipulated Deepfake Clip Posted Online',
        description: 'A digitally altered clip with neural face-swap and synthetic audio was posted with a false breaking policy announcement caption.',
        type: 'claim',
        certainty: 'Reported',
        evidenceIds: []
      },
      {
        id: 'tl-3',
        date: '2026-09-13T08:15:00Z',
        label: 'VerifyLens Automated Investigation',
        description: 'Video scanned across visual, acoustic, and provenance pipelines, flagging face replacement and synthetic voice generation.',
        type: 'investigation',
        certainty: 'Confirmed',
        evidenceIds: ['e1', 'e2', 'e3']
      }
    ],
    knowledgeGraph: {
      nodes: [
        { id: 'n1', label: 'Manipulated Deepfake Clip', type: 'current-claim', detail: 'The altered video circulating on social media' },
        { id: 'n2', label: '2018 Keynote Archive', type: 'original-source', detail: 'The authentic base footage without audio or facial modifications' },
        { id: 'n3', label: 'FaceNet-v3 Detector', type: 'supporting-evidence', detail: 'Flags high probability of neural face-swap manipulation' },
        { id: 'n4', label: 'Audio AI Detector', type: 'supporting-evidence', detail: 'Flags 98% synthetic voice match' }
      ],
      edges: [
        { id: 'ed1', source: 'n1', target: 'n2', label: 'manipulated from' },
        { id: 'ed2', source: 'n3', target: 'n1', label: 'detects deepfake in' },
        { id: 'ed3', source: 'n4', target: 'n1', label: 'detects synthetic audio in' }
      ]
    },
    claimMediaConsistency: {
      claimText: 'Breaking: Official spokesperson announces shocking new policy regulations.',
      evidenceSummary: 'The video is a confirmed deepfake. Visual facial landmarks and acoustic spectra have been synthetically generated to fabricate spoken statements.',
      interpretation: 'Coordinated synthetic media campaign attempting to mislead public opinion on official regulatory announcements.',
      mismatches: [
        { dimension: 'Visual Authenticity', level: 'High', detail: 'Subject facial boundary features digital warping and edge blending.' },
        { dimension: 'Audio Authenticity', level: 'High', detail: 'Speech cadence lacks natural respiratory pauses and exhibits neural vocoder harmonics.' },
        { dimension: 'Contextual Origin', level: 'High', detail: 'Original footage was a 2018 technology product keynote.' }
      ],
      currentPost: {
        label: 'Current Misleading Post',
        caption: 'Breaking: Official spokesperson announces shocking new policy.',
        date: 'September 12, 2026',
        location: 'Washington, DC',
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
        explanation: 'Even if the synthetic audio track is muted, the facial boundary artifacts and unnatural blink rates are independently flagged by visual forensics.',
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
          excerpt: '"The viral video claiming a new policy is a confirmed deepfake combining 2018 archival footage with AI voice generation..."'
        }
      ]
    },
    explainability: {
      visual: {
        score: 95,
        modelVersion: 'VerifyLens FaceNet-v3',
        interval: '00:08.5–00:15.2',
        region: 'Subject Facial Boundary',
        explanation: 'Critical manipulation detected around the cheek and jawline boundaries. Subtle edge smoothing and lighting gradient mismatches confirm neural face-swapping.',
        limitation: 'High motion blur can occasionally degrade edge confidence, though lighting gradient analysis remains consistent.'
      },
      audio: {
        score: 98,
        modelVersion: 'VerifyLens Audio-v2',
        interval: 'Full duration',
        explanation: 'Audio signal exhibits discrete neural vocoder pitch quantization and lacks natural microphone room acoustic resonance.',
        limitation: 'Extreme audio compression can sometimes reduce high-frequency harmonic visibility.'
      },
      lipSync: {
        score: 89,
        modelVersion: 'VerifyLens Sync-v3.0',
        interval: '00:10.0–00:22.5',
        explanation: 'Significant time lag (120ms) between spoken plosive phonemes (/p/, /b/) and visual lip contact visemes.',
        limitation: 'Low frame rate videos (below 15 fps) can reduce temporal tracking precision.'
      }
    },
    provenance: {
      sha256: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
      perceptualHash: 'pHash: 11001100 10101010 11110000 00001111',
      fileType: 'video/mp4',
      fileSize: '8.4 MB',
      creationMetadata: 'Stripped (No original EXIF)',
      modificationMetadata: 'Contains traces of Premiere Pro & DeepFaceLab export',
      editingSoftware: 'Suspected DeepFaceLab / Adobe Premiere Pro',
      c2paStatus: 'No provenance found',
      firstObservedOnline: '14 May 2018 (Original)',
      transformationsDetected: 'Face replacement, synthetic audio injection, re-encoded H.264'
    }
  },
  {
    investigationId: 'synthetic-interview',
    verdict: 'CLAIM_CONTRADICTED' as VerdictCategory,
    fileAuthenticity: 88,
    claimAccuracy: 8,
    provenanceConfidence: 92,
    evidenceStrength: 95,
    summary: 'A viral forwarded WhatsApp voice note claiming local authorities are secretly concealing catastrophic flood destruction in Surat. Speech-to-text neural transcription of the regional Hindi/Hinglish audio and factual cross-referencing against Gujarat State Disaster Management Authority (GSDMA) hydro sensors confirm normal water levels and zero emergency alerts.',
    findings: [
      {
        id: 'f-v1',
        title: 'Authentic Human Voice Recording',
        description: 'Acoustic spectral analysis confirms natural vocal pitch variation (85-255 Hz) and background ambient acoustics, ruling out AI voice synthesis.',
        evidenceIds: ['e-v1']
      },
      {
        id: 'f-v2',
        title: 'Government Hydro Sensors Refute Flood Claim',
        description: 'Real-time telemetry from Tapi river gauges in Surat recorded normal water discharge (under 25,000 cusecs, well below danger mark of 150,000 cusecs).',
        evidenceIds: ['e-v2']
      },
      {
        id: 'f-v3',
        title: 'Viral Dark Social Propagation Pattern',
        description: 'Audio message was forwarded over 4,500 times across private messaging groups within 6 hours without corroborating news coverage.',
        evidenceIds: ['e-v3']
      }
    ],
    evidence: [
      {
        id: 'e-v1',
        type: 'forensic',
        content: 'Natural vocal frequency distribution and acoustic reverberation confirm authentic human voice note.',
        source: 'Acoustic Forensic Engine',
        confidence: 92
      },
      {
        id: 'e-v2',
        type: 'link',
        content: 'Official Gujarat State Disaster Management Bulletin (GSDMA) reports all dams and river levels in Surat normal.',
        source: 'GSDMA Official Portal',
        url: 'https://gsdma.gujarat.gov.in',
        confidence: 99
      },
      {
        id: 'e-v3',
        type: 'metadata',
        content: 'Audio perceptual hash traced across messaging forward chains with sensationalized captions.',
        source: 'Dark Social Forward Tracker',
        confidence: 88
      }
    ],
    timeline: [
      {
        id: 'tl-v1',
        date: '2026-09-12T18:30:00Z',
        label: 'Voice Note First Recorded',
        description: 'Audio file created on mobile device and sent to private messaging group.',
        type: 'media',
        certainty: 'Confirmed',
        evidenceIds: ['e-v1']
      },
      {
        id: 'tl-v2',
        date: '2026-09-13T04:00:00Z',
        label: 'Viral Surge on Messaging Channels',
        description: 'Audio message forwarded thousands of times with alarming captions causing public anxiety.',
        type: 'claim',
        certainty: 'Observed',
        evidenceIds: ['e-v3']
      },
      {
        id: 'tl-v3',
        date: '2026-09-13T07:15:00Z',
        label: 'Official Municipal Debunk Issued',
        description: 'Surat Municipal Corporation issues official statement refuting flood rumors with live river feed.',
        type: 'investigation',
        certainty: 'Confirmed',
        evidenceIds: ['e-v2']
      }
    ],
    knowledgeGraph: {
      nodes: [
        { id: 'n-v1', label: 'Viral WhatsApp Voice Note', type: 'uploaded-media', detail: 'Audio note forwarded across messaging groups' },
        { id: 'n-v2', label: 'Surat Flood Cover-up Claim', type: 'current-claim', detail: 'Alleges government is hiding severe flood casualties' },
        { id: 'n-v3', label: 'Multilingual Speech AI', type: 'supporting-evidence', detail: 'Transcribed regional Hindi/Hinglish speech' },
        { id: 'n-v4', label: 'GSDMA Hydrologic Records', type: 'official-source', detail: 'Live telemetry proves river discharge is safe' }
      ],
      edges: [
        { id: 'ed-v1', source: 'n-v1', target: 'n-v2', label: 'makes claim' },
        { id: 'ed-v2', source: 'n-v3', target: 'n-v1', label: 'transcribes regional audio' },
        { id: 'ed-v3', source: 'n-v4', target: 'n-v2', label: 'disproves factual claim' }
      ]
    },
    voiceAnalysis: {
      transcript: "Ye video Surat ke aaj ke flood ka hai aur government sach chhupa rahi hai. Sabhi log alert ho jao.",
      language: "Hindi-English (Hinglish)",
      englishMeaning: "This video shows today's flood in Surat and the government is hiding the truth. Everyone stay on alert.",
      confidence: 96,
      extractedClaims: [
        "Major catastrophic flood is currently submerging Surat city.",
        "Local government and disaster authorities are hiding destruction."
      ],
      providerName: "VerifyLens Multilingual Speech AI"
    },
    claimMediaConsistency: {
      claimText: 'This audio claims a massive flood is occurring in Surat and authorities are covering it up.',
      evidenceSummary: 'Official hydrologic sensor data and municipal reports show standard seasonal water levels. The claim of an undisclosed flood disaster is false.',
      interpretation: 'Authentic human voice recording spreading panic rumor without empirical basis.',
      mismatches: [
        { dimension: 'Disaster Occurrence', level: 'High', detail: 'Zero flood warnings or casualties recorded by emergency agencies.' },
        { dimension: 'Water Levels', level: 'High', detail: 'Tapi river discharge is 22,000 cusecs (safe limit is 150,000 cusecs).' }
      ],
      currentPost: {
        label: 'Viral WhatsApp Forward',
        caption: 'Surat flood catastrophe cover-up warning',
        date: 'September 13, 2026',
        location: 'Surat, Gujarat',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: 'Official Disaster Registry',
        caption: 'GSDMA Daily Situation Report: Normal Status',
        date: 'September 13, 2026',
        location: 'Gandhinagar, Gujarat',
        sourceLabel: 'Observed'
      }
    },
    explainability: {
      visual: {
        score: 0,
        modelVersion: 'N/A',
        interval: 'N/A',
        region: 'N/A',
        explanation: 'Audio asset investigation — visual spectrum not applicable.',
        limitation: 'N/A'
      },
      audio: {
        score: 15,
        modelVersion: 'VerifyLens Audio-v2',
        interval: 'Full duration',
        explanation: 'Human vocal jitter, breathing intervals, and smartphone microphone room reverberation align with genuine human voice capture.',
        limitation: 'Low bitrate voice compression can mask micro-frequencies.'
      },
      lipSync: {
        score: 0,
        modelVersion: 'N/A',
        interval: 'N/A',
        explanation: 'Audio only file.',
        limitation: 'N/A'
      }
    },
    sourceIndependence: {
      totalFound: 8,
      independentClusters: 2,
      copiedSources: 6,
      officialSources: 1,
      factCheckSources: 1,
      anonymousSocial: 6,
      sourceCards: [
        {
          id: 'src-v1',
          publisher: 'GSDMA Official Portal',
          sourceType: 'Official',
          date: 'September 13, 2026',
          cluster: 'Official Portals',
          alignment: 'Contradicts',
          reliability: 'High',
          excerpt: '"All river gauges across Surat district report normal discharge with zero flood warnings."'
        }
      ]
    },
    provenance: {
      sha256: '8f9a2b4c6e1d3f5a7b9c0e2d4f6a8b1c3d5e7f9a0b2c4d6e8f1a3b5c7d9e0f2a',
      perceptualHash: 'pHash: 11011001 01010101 11110000 00001111',
      fileType: 'audio/webm',
      fileSize: '420 KB',
      creationMetadata: 'Recorded on Android device via WhatsApp Voice Note',
      modificationMetadata: 'Recompressed OPUS codec',
      editingSoftware: 'None detected',
      c2paStatus: 'No provenance found',
      firstObservedOnline: '13 Sep 2026 (WhatsApp Forward)',
      transformationsDetected: 'Audio recompression'
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
    summary: 'Sources and automated forensic engines strongly disagree on the authenticity and context of this video. An accredited wildlife newsroom reported the video as authentic field expedition footage, whereas a CGI forensic watchdog identified identical 3D wireframe models in an Unreal Engine asset library. Automated certainty is withheld to prevent AI hallucination; expert human OSINT review is recommended.',
    findings: [
      {
        id: 'f-c1',
        title: 'Contradictory Fact-Check Conclusions',
        description: 'Wildlife Newsroom Alpha validated the footage as authentic rainforest recording, while VFX Watchdog Beta flagged matching polygon meshes in a 3D marketplace.',
        evidenceIds: ['e-c1', 'e-c2']
      },
      {
        id: 'f-c2',
        title: 'Conflicting Metadata Header Stamps',
        description: 'Container EXIF contains Canon EOS R5 camera metadata, but XMP footer traces show Blender 4.1 rendering markers.',
        evidenceIds: ['e-c3']
      }
    ],
    evidence: [
      {
        id: 'e-c1',
        type: 'link',
        content: 'News Agency Alpha: "Expedition confirms rare specimen sighting in remote rainforest canopy."',
        source: 'Agency Alpha Fact Check',
        url: 'https://example.com/alpha-news',
        confidence: 72
      },
      {
        id: 'e-c2',
        type: 'link',
        content: 'VFX Watchdog Beta: "Unreal Engine 5 creature asset wireframe match identified with 92% geometry similarity."',
        source: 'VFX Watchdog Blog',
        url: 'https://example.com/beta-vfx',
        confidence: 78
      },
      {
        id: 'e-c3',
        type: 'metadata',
        content: 'Conflicting EXIF vs XMP software traces (Blender 4.1 render tag alongside Canon EOS R5 hardware tag).',
        source: 'EXIF & Stream Inspector',
        confidence: 85
      }
    ],
    timeline: [
      {
        id: 'tl-c1',
        date: '2024-11-20T10:00:00Z',
        label: 'Earliest Digital Asset Timestamp',
        description: 'Camera sensor and 3D render project timestamps recorded.',
        type: 'media',
        certainty: 'Observed',
        evidenceIds: ['e-c3']
      },
      {
        id: 'tl-c2',
        date: '2026-09-10T14:00:00Z',
        label: 'Viral Video Shared as "Living Prehistoric Creature"',
        description: 'Video spreads across social platforms claiming a revolutionary biological discovery.',
        type: 'claim',
        certainty: 'Reported',
        evidenceIds: ['e-c1']
      },
      {
        id: 'tl-c3',
        date: '2026-09-12T09:00:00Z',
        label: 'Opposing Investigative Rebuttals Published',
        description: 'Independent investigative groups publish mutually contradictory findings.',
        type: 'contradiction',
        certainty: 'Unclear',
        evidenceIds: ['e-c1', 'e-c2']
      }
    ],
    knowledgeGraph: {
      nodes: [
        { id: 'n-c1', label: 'Viral Specimen Video', type: 'uploaded-media', detail: 'Submitted footage under review' },
        { id: 'n-c2', label: 'New Species Discovery Claim', type: 'current-claim', detail: 'Claims living prehistoric discovery' },
        { id: 'n-c3', label: 'Agency Alpha (Supports)', type: 'news-article', detail: 'Publishes field expedition corroboration' },
        { id: 'n-c4', label: 'Watchdog Beta (Contradicts)', type: 'contradiction', detail: 'Publishes 3D mesh wireframe match' }
      ],
      edges: [
        { id: 'ed-c1', source: 'n-c1', target: 'n-c2', label: 'depicts' },
        { id: 'ed-c2', source: 'n-c3', target: 'n-c2', label: 'corroborates' },
        { id: 'ed-c3', source: 'n-c4', target: 'n-c1', label: 'flags CGI render in' }
      ]
    },
    claimMediaConsistency: {
      claimText: 'This video proves the discovery of an unrecorded living prehistoric species.',
      evidenceSummary: 'Accredited sources provide directly conflicting assessments with equal credibility weight.',
      interpretation: 'System safely withholds automated verdict. Human OSINT analyst review is strongly recommended.',
      mismatches: [
        { dimension: 'Corroboration', level: 'High', detail: '50% of trusted sources corroborate, 50% refute with VFX evidence.' },
        { dimension: 'Metadata Integrity', level: 'Medium', detail: 'Camera hardware tags conflict with 3D animation software tags.' }
      ],
      currentPost: {
        label: 'Viral Post',
        caption: 'Living prehistoric creature filmed in rainforest canopy',
        date: 'September 10, 2026',
        location: 'Amazon Basin',
        sourceLabel: 'Reported'
      },
      earlierSource: {
        label: '3D VFX Portfolio',
        caption: 'Specimen creature animation test (Unreal Engine 5)',
        date: 'November 2024',
        location: 'Online Portfolio',
        sourceLabel: 'Unclear'
      }
    },
    explainability: {
      visual: {
        score: 52,
        modelVersion: 'VerifyLens VisionCore v2.4',
        interval: 'Full frame',
        region: 'Creature Texture & Background Foliage',
        explanation: 'Subsurface scattering on skin passes optical tests, but foliage depth map reveals polygonal seams consistent with CGI composites.',
        limitation: 'High dynamic range lighting can produce ambiguous shader signatures.'
      },
      audio: {
        score: 48,
        modelVersion: 'VerifyLens Audio-v2',
        interval: 'Ambient track',
        explanation: 'Rainforest ambient sound matches authentic field audio, with low synthetic distortion.',
        limitation: 'Field audio libraries are commonly repurposed in CGI renders.'
      },
      lipSync: {
        score: 0,
        modelVersion: 'N/A',
        interval: 'N/A',
        explanation: 'Non-human subject.',
        limitation: 'N/A'
      }
    },
    sourceIndependence: {
      totalFound: 16,
      independentClusters: 4,
      copiedSources: 10,
      officialSources: 0,
      factCheckSources: 2,
      anonymousSocial: 14,
      sourceCards: [
        {
          id: 'src-c1',
          publisher: 'Wildlife News Alpha',
          sourceType: 'News',
          date: 'September 11, 2026',
          cluster: 'Field Reporting',
          alignment: 'Supports',
          reliability: 'Medium',
          excerpt: '"Biologists review footage and find no immediate evidence of CGI tampering in initial review."'
        },
        {
          id: 'src-c2',
          publisher: 'CGI Forensic Watchdog',
          sourceType: 'Fact-check',
          date: 'September 12, 2026',
          cluster: 'VFX Analysis',
          alignment: 'Contradicts',
          reliability: 'High',
          excerpt: '"Identical creature wireframe geometry found in public 3D asset marketplace repository."'
        }
      ]
    },
    provenance: {
      sha256: '4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6e8f0a2b4c6e8f0a2b4c6e',
      perceptualHash: 'pHash: 10101010 01010101 11001100 00110011',
      fileType: 'video/mp4',
      fileSize: '14.2 MB',
      creationMetadata: 'Canon EOS R5 / Blender 4.1 Hybrid',
      modificationMetadata: 'Rendered & re-encoded H.264',
      editingSoftware: 'Suspected Blender / DaVinci Resolve',
      c2paStatus: 'Conflicting provenance',
      firstObservedOnline: '20 Nov 2024',
      transformationsDetected: 'Hybrid composite, color graded'
    }
  }
];
