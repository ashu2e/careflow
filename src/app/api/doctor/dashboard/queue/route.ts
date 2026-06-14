import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    patients: [
      { id: '1', name: 'Alice Smith', age: 34, gender: 'F', token: 'A-102', arrivalTime: '08:15 AM', reason: 'Fever and Cough', status: 'Waiting', vitals: { bp: '120/80', hr: 72, temp: 101.2 } },
      { id: '2', name: 'Bob Johnson', age: 45, gender: 'M', token: 'A-103', arrivalTime: '08:30 AM', reason: 'Routine Checkup', status: 'Waiting' },
      { id: '3', name: 'Charlie Davis', age: 29, gender: 'M', token: 'A-104', arrivalTime: '08:45 AM', reason: 'Back Pain', status: 'Waiting' },
    ],
    progress: { seen: 4, total: 12 }
  });
}
