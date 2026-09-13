import { HeatmapFinding } from './types';

export function getDeterministicHeatmapFindings(mediaUrl: string, mediaType: 'photo' | 'video' = 'video'): HeatmapFinding[] {
  // Deterministic mock data for demo purposes
  
  if (mediaType === 'photo') {
    return [
      {
        id: 'photo-finding-1',
        mediaType: 'photo',
        region: 'Subject Face Boundary',
        score: 85,
        severity: 'high',
        reason: 'Inconsistent lighting gradients and edge artifacts detected around the jawline, typical of deepfake swapping techniques.',
        limitation: 'High compression artifacts in the source image may increase false positive rate.',
        modelName: 'VerifyLens FaceNet-v3',
        modelVersion: '3.1.4',
        heatmapData: 'radial-gradient(circle at 45% 35%, rgba(255,50,50,0.7) 0%, rgba(255,50,50,0) 60%)',
        confidence: 92
      }
    ];
  }

  // Video mock data (temporal)
  return [
    {
      id: 'vid-finding-1',
      mediaType: 'video',
      timestamp: '00:02.5',
      frameIndex: 75,
      region: 'Background lighting',
      score: 45,
      severity: 'low',
      reason: 'Slight inconsistencies in temporal lighting shifts.',
      limitation: 'Camera motion blur reduces accuracy.',
      modelName: 'VerifyLens Temporal-v2',
      modelVersion: '2.0.1',
      heatmapData: 'radial-gradient(ellipse at 80% 20%, rgba(255,200,50,0.6) 0%, rgba(255,200,50,0) 50%)',
      confidence: 60
    },
    {
      id: 'vid-finding-2',
      mediaType: 'video',
      timestamp: '00:13.1',
      frameIndex: 393,
      region: 'Subject Face (Lip sync)',
      score: 92,
      severity: 'high',
      reason: 'Audio-visual desynchronization and unnatural mouth cavity rendering detected.',
      limitation: 'Audio noise floor might slightly impact sync confidence.',
      modelName: 'VerifyLens FaceNet-v3',
      modelVersion: '3.1.4',
      heatmapData: 'radial-gradient(circle at 55% 40%, rgba(255,50,50,0.8) 0%, rgba(255,100,50,0.4) 30%, rgba(0,0,0,0) 70%)',
      confidence: 95
    },
    {
      id: 'vid-finding-3',
      mediaType: 'video',
      timestamp: '00:24.8',
      frameIndex: 744,
      region: 'Left hand',
      score: 75,
      severity: 'medium',
      reason: 'Anomalous pixel structure and missing details in hand articulation, common in synthetic generation.',
      limitation: 'Fast movement creates natural motion blur that mimics synthesis artifacts.',
      modelName: 'VerifyLens Spatial-v4',
      modelVersion: '4.0.0',
      heatmapData: 'radial-gradient(circle at 30% 70%, rgba(255,100,50,0.7) 0%, rgba(255,100,50,0) 50%)',
      confidence: 82
    }
  ];
}

export function generateTemporalRiskSeries(): { time: number, score: number }[] {
  // Generate a mock risk curve for 30 seconds
  const series = [];
  for (let i = 0; i <= 30; i++) {
    let score = 15 + Math.random() * 20; // baseline noise
    
    // Create peaks around the finding timestamps
    if (i >= 2 && i <= 4) score += 30;
    if (i >= 12 && i <= 14) score += 60; // Huge peak at 13s
    if (i >= 23 && i <= 26) score += 40; // Peak at 24s

    // Cap at 100
    score = Math.min(100, Math.max(0, score));
    series.push({ time: i, score });
  }
  return series;
}
