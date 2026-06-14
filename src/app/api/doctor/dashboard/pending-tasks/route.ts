import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    count: 3,
    tasks: [
      { id: 't1', title: 'Review Lab: Complete Blood Count', type: 'Lab' },
      { id: 't2', title: 'Sign SOAP Note (Alice)', type: 'Note' },
      { id: 't3', title: 'Approve Refill Request', type: 'Prescription' }
    ]
  });
}
