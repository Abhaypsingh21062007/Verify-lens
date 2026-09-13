'use server';

import { saveInvestigation } from '@/lib/repository';
import { Investigation, InvestigationStatus } from '@/lib/types';
import { mockCases } from '@/lib/mock-data';
import { redirect } from 'next/navigation';

export async function createInvestigation(formData: FormData) {
  const claim = formData.get('claim') as string;
  const url = formData.get('url') as string;
  const file = formData.get('file') as File | null;
  
  let assetUrl = url || '/sample/earthquake-building.jpg';
  let assetType: 'image' | 'video' | 'audio' = 'image';

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    
    const ext = file.name.split('.').pop() || 'tmp';
    const filename = `upload_${Date.now()}.${ext}`;
    fs.writeFileSync(path.join(uploadsDir, filename), buffer);
    
    assetUrl = `/uploads/${filename}`;
    
    if (file.type.startsWith('video/')) assetType = 'video';
    else if (file.type.startsWith('audio/')) assetType = 'audio';
  }

  const newId = `inv-${Date.now()}`;
  const mode = formData.get('mode') as string;
  
  const investigation: Investigation = {
    id: newId,
    status: 'pending' as InvestigationStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assets: [
      {
        id: `ast-${Date.now()}`,
        type: assetType,
        url: assetUrl,
        metadata: { mode }
      }
    ],
    claims: claim ? [
      {
        id: `clm-${Date.now()}`,
        content: claim,
      }
    ] : [],
    steps: []
  };

  saveInvestigation(investigation);
  
  return newId;
}

export async function startSampleInvestigation(caseId: string) {
  const sampleCase = mockCases.find(c => c.investigationId === caseId);
  if (!sampleCase) {
    throw new Error('Sample case not found');
  }

  const investigation: Investigation = {
    id: sampleCase.investigationId,
    status: 'pending' as InvestigationStatus,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assets: [
      {
        id: `ast-${Date.now()}`,
        type: 'video', // Mocking this for the sample cases
        url: `/sample/${sampleCase.investigationId}.mp4`,
      }
    ],
    claims: [
      {
        id: `clm-${Date.now()}`,
        content: sampleCase.summary, // using summary as claim for the mock
      }
    ],
    steps: []
  };

  saveInvestigation(investigation);

  // We can redirect straight to processing
  redirect(`/investigate/${sampleCase.investigationId}/processing`);
}
