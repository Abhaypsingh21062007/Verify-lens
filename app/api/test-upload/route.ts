import { NextRequest, NextResponse } from 'next/server';
import { generateInvestigationReport } from '../../actions/generate-report';

export async function POST(req: NextRequest) {
  try {
    const res = await generateInvestigationReport("mock-123", "Test claim", "/sample/earthquake-building.jpg");
    return NextResponse.json(res);
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
