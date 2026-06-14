import { PatientQueueItem } from "@/hooks/useRealtimeQueue";
import { Activity, Thermometer, Heart, Play } from "lucide-react";

interface NextPatientCardProps {
  patient: PatientQueueItem | null;
  onStartVisit: (patientId: string, appointmentId: string) => void;
  isStarting: boolean;
}

export function NextPatientCard({ patient, onStartVisit, isStarting }: NextPatientCardProps) {
  if (!patient) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <Activity className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">No pending patients</h2>
        <p className="text-gray-500 max-w-sm">
          Take a break, review lab reports, or check upcoming appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 mb-1 block">Next Patient</span>
          <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{patient.age} years &bull; {patient.gender} &bull; Token: {patient.token}</p>
        </div>
        <button
          onClick={() => patient.appointmentId && onStartVisit(patient.id, patient.appointmentId)}
          disabled={isStarting}
          className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-md font-medium transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 transform hover:scale-105"
        >
          {isStarting ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>Start Visit</span>
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Chief Complaint</h3>
          <p className="text-gray-900 text-lg bg-gray-50 p-4 rounded border border-gray-100">{patient.reason}</p>
        </div>

        {patient.vitals && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Vitals snapshot</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white border border-gray-100 p-3 rounded shadow-sm flex items-center space-x-3">
                <div className="bg-red-50 text-red-500 p-2 rounded">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">BP</p>
                  <p className="font-semibold text-gray-900">{patient.vitals.bp}</p>
                </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-3 rounded shadow-sm flex items-center space-x-3">
                <div className="bg-orange-50 text-orange-500 p-2 rounded">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Heart Rate</p>
                  <p className="font-semibold text-gray-900">{patient.vitals.hr} bpm</p>
                </div>
              </div>

              <div className="bg-white border border-gray-100 p-3 rounded shadow-sm flex items-center space-x-3">
                <div className="bg-blue-50 text-blue-500 p-2 rounded">
                  <Thermometer className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Temp</p>
                  <p className="font-semibold text-gray-900">{patient.vitals.temp} &deg;F</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
