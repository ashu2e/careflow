import { useQuery } from '@tanstack/react-query';

export interface PatientQueueItem {
  id: string;
  appointmentId?: string;
  name: string;
  age: number;
  gender: string;
  token: string;
  arrivalTime: string;
  reason: string;
  status: string;
  vitals?: {
    bp: string;
    hr: number;
    temp: number;
  };
}

export interface QueueResponse {
  patients: PatientQueueItem[];
  progress: {
    seen: number;
    total: number;
  };
}

export function useRealtimeQueue() {
  // TanStack Query handles caching, deduping, and background updates.
  // Polling is configured via refetchInterval.
  // 
  // To swap to WebSockets:
  // 1. Remove refetchInterval.
  // 2. Use useEffect to listen to WS events (e.g., socket.on('queue_update', (newData) => queryClient.setQueryData(['doctorQueue'], newData))).
  
  return useQuery<QueueResponse>({
    queryKey: ['doctorQueue'],
    queryFn: async () => {
      const response = await fetch('/api/doctor/dashboard/queue');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });
}
