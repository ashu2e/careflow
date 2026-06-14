import { useRealtimeQueue, PatientQueueItem } from "@/hooks/useRealtimeQueue";
import { User, Clock, AlertCircle } from "lucide-react";

export function CheckInQueue({ onSelectPatient }: { onSelectPatient: (patient: PatientQueueItem) => void }) {
  const { data, isLoading, error } = useRealtimeQueue();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 text-red-600">
        <AlertCircle className="w-5 h-5 inline mr-2" />
        Failed to load patient queue.
      </div>
    );
  }

  const { patients, progress } = data;
  const progressPercent = Math.round((progress.seen / progress.total) * 100) || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Real-time Queue</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{progress.seen} of {progress.total} seen</span>
          <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-600 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {patients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No patients waiting in the queue.
          </div>
        ) : (
          patients.map((patient) => (
            <div 
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="group flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-teal-600 hover:shadow-sm cursor-pointer transition-all duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-teal-50 text-teal-700 p-2 rounded-full flex-shrink-0 group-hover:bg-teal-100 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{patient.name}</h3>
                  <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                    <span>{patient.age}y {patient.gender}</span>
                    <span>&bull;</span>
                    <span className="truncate max-w-[120px]">{patient.reason}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded mb-1">
                  {patient.token}
                </span>
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {patient.arrivalTime}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
