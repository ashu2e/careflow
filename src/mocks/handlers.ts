import { http, HttpResponse } from 'msw';

export const handlers = [
  // 1. Queue Endpoint
  http.get('/api/doctor/dashboard/queue', () => {
    return HttpResponse.json({
      patients: [
        { id: '1', name: 'Alice Smith', age: 34, gender: 'F', token: 'A-102', arrivalTime: '08:15 AM', reason: 'Fever and Cough', status: 'Waiting', vitals: { bp: '120/80', hr: 72, temp: 101.2 } },
        { id: '2', name: 'Bob Johnson', age: 45, gender: 'M', token: 'A-103', arrivalTime: '08:30 AM', reason: 'Routine Checkup', status: 'Waiting' },
        { id: '3', name: 'Charlie Davis', age: 29, gender: 'M', token: 'A-104', arrivalTime: '08:45 AM', reason: 'Back Pain', status: 'Waiting' },
      ],
      progress: { seen: 4, total: 12 }
    });
  }),

  // 2. Upcoming Appointments
  http.get('/api/doctor/dashboard/upcoming', ({ request }) => {
    return HttpResponse.json({
      appointments: [
        { id: '101', time: '10:00 AM', name: 'Diana Prince', type: 'Follow-up' },
        { id: '102', time: '10:30 AM', name: 'Evan Wright', type: 'Consultation' },
      ]
    });
  }),

  // 3. Pending Tasks
  http.get('/api/doctor/dashboard/pending-tasks', () => {
    return HttpResponse.json({
      count: 3,
      tasks: [
        { id: 't1', title: 'Review Lab: Complete Blood Count', type: 'Lab' },
        { id: 't2', title: 'Sign SOAP Note (Alice)', type: 'Note' },
        { id: 't3', title: 'Approve Refill Request', type: 'Prescription' }
      ]
    });
  }),

  // 4. Unread Messages
  http.get('/api/doctor/dashboard/messages/unread', () => {
    return HttpResponse.json({
      count: 2,
      latest: {
        sender: 'Dr. Emily Chen (Cardiology)',
        preview: 'Regarding the ECG results for patient #492...'
      }
    });
  }),

  // 5. Start Consultation
  http.post('/api/consultations/start', async ({ request }) => {
    const { patientId } = await request.json() as { patientId: string };
    console.log(`Starting consultation for patient ${patientId}`);
    return HttpResponse.json({ success: true, status: 'In Progress' });
  }),

  // 6. Global Search
  http.get('/api/patients/search', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query || query.length < 2) return HttpResponse.json({ results: [] });

    return HttpResponse.json({
      results: [
        { id: 'p1', name: 'Alex Turner', dob: '1980-05-12' },
        { id: 'p2', name: 'Alexa Siri', dob: '1992-11-20' }
      ]
    });
  })
];
