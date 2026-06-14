import { useQuery } from '@tanstack/react-query';
import { Calendar, MoreVertical, FileEdit } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  time: string;
  name: string;
  type: string;
}

export function UpcomingAppointments() {
  const { data, isLoading, error } = useQuery<{ appointments: Appointment[] }>({
    queryKey: ['upcomingAppointments'],
    queryFn: async () => {
      const res = await fetch('/api/doctor/dashboard/upcoming?limit=2');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    }
  });

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-48 animate-pulse"></div>;
  }

  if (error || !data) {
    return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-sm text-red-500">Failed to load appointments</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-900 flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-teal-600" />
          Upcoming Appointments
        </h3>
        <Link href="/dashboard/book" className="text-xs text-teal-600 hover:text-teal-700 font-medium">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {data.appointments.length === 0 ? (
          <p className="text-sm text-gray-500">No more appointments today.</p>
        ) : (
          data.appointments.map(apt => (
            <div key={apt.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-md transition-colors border border-transparent hover:border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">{apt.name}</p>
                <p className="text-xs text-gray-500">{apt.time} &bull; {apt.type}</p>
              </div>
              <button 
                className="text-gray-400 hover:text-teal-600 p-1 rounded hover:bg-teal-50 transition-colors"
                title="Pre-fill note"
              >
                <FileEdit className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
