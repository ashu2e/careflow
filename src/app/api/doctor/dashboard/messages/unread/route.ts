import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    count: 2,
    latest: {
      sender: 'Dr. Emily Chen (Cardiology)',
      preview: 'Regarding the ECG results for patient #492...'
    }
  });
}
