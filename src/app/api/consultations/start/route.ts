import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { patientId } = await request.json();
    console.log(`Starting consultation for patient ${patientId}`);
    return NextResponse.json({ success: true, status: 'In Progress' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
