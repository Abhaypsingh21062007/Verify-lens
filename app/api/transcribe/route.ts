import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided.' }, { status: 400 });
    }

    const demoMode = process.env.DEMO_MODE === 'true';
    const gnaniEnabled = process.env.GNANI_ENABLED === 'true';

    // Simulate processing delay for demo realism
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (demoMode || !gnaniEnabled) {
      return NextResponse.json({
        success: true,
        transcript: "Ye video Surat ke aaj ke flood ka hai aur government sach chhupa rahi hai.",
        language: "Hindi-English Hinglish",
        englishMeaning: "This video shows today’s flood in Surat and the government is hiding the truth.",
        confidence: 94.5,
        extractedClaims: [
          "This video shows today’s flood in Surat.",
          "The government is hiding the real destruction."
        ],
        providerName: "Demo transcription mode"
      });
    }

    // Future integration point for actual Gnani API
    // const gnaniApiKey = process.env.GNANI_API_KEY;
    // const gnaniUrl = process.env.GNANI_API_URL;
    // ... call actual Gnani AI

    return NextResponse.json({ success: false, error: 'Gnani AI API not implemented yet. Set DEMO_MODE=true.' }, { status: 501 });
  } catch (error: any) {
    console.error("Transcription error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
