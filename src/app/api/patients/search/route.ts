import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Mock search results
  return NextResponse.json({
    results: [
      { id: 'p1', name: 'Alex Turner', dob: '1980-05-12' },
      { id: 'p2', name: 'Alexa Siri', dob: '1992-11-20' }
    ]
  });
}
