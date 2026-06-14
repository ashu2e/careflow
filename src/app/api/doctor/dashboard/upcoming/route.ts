import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    appointments: [
      { id: '101', time: '10:00 AM', name: 'Diana Prince', type: 'Follow-up' },
      { id: '102', time: '10:30 AM', name: 'Evan Wright', type: 'Consultation' },
    ]
  });
}
