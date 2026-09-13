'use server';

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

import { InvestigationReportSchema } from '@/lib/schema';
import { saveReport } from '@/lib/repository';

export async function generateInvestigationReport(
  investigationId: string, 
  claimText: string, 
  mediaUrl: string,
  voiceData?: any
) {
  try {
    let apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    // Fallback if the user hasn't restarted the Next.js dev server after adding .env.local
    if (!apiKey) {
      try {
        const fs = require('fs');
        const path = require('path');
        const envFile = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
        const match = envFile.match(/GEMINI_API_KEY=(.*)/);
        if (match && match[1]) {
          apiKey = match[1].trim();
        }
      } catch (e) {
        console.warn('Could not manually read .env.local', e);
      }
    }

    if (!apiKey) {
      throw new Error("API Key is completely missing. Please check .env.local");
    }

    const google = createGoogleGenerativeAI({ apiKey });
    
    let promptText = "";
    
    if (voiceData) {
      promptText = `You are an expert forensic media analyst system called VerifyLens.
The user has provided an audio/video file (a Voice Note) and we have extracted the following transcript and claims using Gnani AI:
- Transcript: "${voiceData.transcript}"
- Language: "${voiceData.language}"
- English Meaning: "${voiceData.englishMeaning}"
- Extracted Claims: ${JSON.stringify(voiceData.extractedClaims)}

Analyze the truthfulness of these extracted claims based on general knowledge and plausibility. Find evidence to support or contradict the claims.
IMPORTANT: The investigationId must be "${investigationId}".
You MUST include the exact Voice Analysis Data provided above in the \`voiceAnalysis\` field of the JSON output.

METRICS INSTRUCTIONS:
- You must output all confidence metrics (fileAuthenticity, claimAccuracy, provenanceConfidence, evidenceStrength) as INTEGERS between 0 and 100 (e.g. 85, NOT 0.85).

Output MUST strictly follow the JSON schema for an InvestigationReport.`;
    } else {
      promptText = `You are an expert forensic media analyst system called VerifyLens. 
The user has provided a media file and made the following claim about it: "${claimText}".

Conduct a highly detailed, genuine forensic analysis of the provided image to evaluate this claim.
Do NOT hallucinate or invent fake metadata. Rely strictly on what you can visually deduce from the image content itself (e.g., lighting inconsistencies, structural errors typical of AI, genuine visual context, artifacts, etc.).
If no image is provided, analyze the claim based on general knowledge and plausibility.

IMPORTANT: The investigationId must be "${investigationId}".

METRICS INSTRUCTIONS:
- You must output all confidence metrics (fileAuthenticity, claimAccuracy, provenanceConfidence, evidenceStrength) as INTEGERS between 0 and 100 (e.g. 85, NOT 0.85).

Output MUST strictly follow the JSON schema for an InvestigationReport. Provide rich, detailed explanations in the findings, counterfactuals, and explainability sections.`;
    }

    const messages: any[] = [
      {
        role: 'user',
        content: [
          { type: 'text', text: promptText }
        ]
      }
    ];

    if (!voiceData) {
      if (mediaUrl.startsWith('data:image/')) {
        const base64Data = mediaUrl.split(',')[1];
        const uint8Array = Uint8Array.from(Buffer.from(base64Data, 'base64'));
        messages[0].content.push({ type: 'image', image: uint8Array });
      } else if (mediaUrl.startsWith('data:video/')) {
        const parts = mediaUrl.split(',');
        const mimeType = parts[0].split(':')[1].split(';')[0];
        const base64Data = parts[1];
        const uint8Array = Uint8Array.from(Buffer.from(base64Data, 'base64'));
        // Fallback to base64 string if Uint8Array causes ModelMessage schema error for files
        messages[0].content.push({ type: 'file', data: base64Data, mimeType });
      } else if (mediaUrl.startsWith('/sample/') || mediaUrl.startsWith('/uploads/')) {
        try {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.join(process.cwd(), 'public', mediaUrl);
          const fileBuffer = fs.readFileSync(filePath);
          const uint8Array = new Uint8Array(fileBuffer);
          
          const ext = path.extname(filePath).toLowerCase();
          if (ext === '.mp4' || ext === '.webm' || ext === '.mov') {
             const mimeType = ext === '.mp4' ? 'video/mp4' : ext === '.webm' ? 'video/webm' : 'video/quicktime';
             const base64Data = fileBuffer.toString('base64');
             messages[0].content.push({ type: 'file', data: base64Data, mimeType });
          } else {
             messages[0].content.push({ type: 'image', image: uint8Array });
          }
        } catch (e) {
          console.warn('Could not read local file', e);
        }
      }
    }

    console.log("Calling generateObject with messages:", JSON.stringify(messages.map(m => ({
      role: m.role,
      content: m.content.map((c: any) => ({
        type: c.type,
        mimeType: c.mimeType,
        dataLength: c.data ? c.data.length : undefined,
        imageLength: c.image ? c.image.length : undefined
      }))
    })), null, 2));

    const { object } = await generateObject({
      model: google('gemini-3.8-flash'),
      schema: InvestigationReportSchema,
      messages,
    });

    // Save to the in-memory store.
    saveReport(object);
    
    return { success: true, report: object };
  } catch (error: any) {
    console.error('Failed to generate report:', error);
    return { success: false, error: error.message || String(error) };
  }
}
