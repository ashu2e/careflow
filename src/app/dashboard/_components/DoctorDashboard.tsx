"use client";

import { Calendar, Users } from "lucide-react";
import Link from "next/link";

export default function DoctorDashboard({ doctor, appointments }: { doctor: any, appointments: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Doctor Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Calendar className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Consultations</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <li className="px-6 py-4 text-gray-500">No appointments scheduled.</li>
          ) : (
            appointments.map((apt) => (
              <li key={apt.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{apt.patient?.user?.fullName}</p>
                  <p className="text-sm text-gray-500">{apt.date} at {apt.timeSlot}</p>
                </div>
                <div>
                  <Link href={`/dashboard/consultation/${apt.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Start Consultation
                  </Link>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
