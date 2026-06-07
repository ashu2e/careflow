"use client";

import { Calendar, FileText, Receipt } from "lucide-react";
import Link from "next/link";

export default function PatientDashboard({ patient, appointments }: { patient: any, appointments: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome to your Patient Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Calendar className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{appointments.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total appointments</p>
          <div className="mt-4">
            <Link href="/dashboard/book" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Book new appointment &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <FileText className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Medical Records</h2>
          </div>
          <p className="text-gray-600">Access your lab reports and prescriptions.</p>
          <div className="mt-4">
            <Link href="/dashboard/history" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View records &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Receipt className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
          </div>
          <p className="text-gray-600">View and pay your hospital bills.</p>
          <div className="mt-4">
            <Link href="/dashboard/invoices" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Manage billing &rarr;
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Appointments</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {appointments.length === 0 ? (
            <li className="px-6 py-4 text-gray-500">No appointments found.</li>
          ) : (
            appointments.map((apt) => (
              <li key={apt.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Dr. {apt.doctor?.user?.fullName}</p>
                  <p className="text-sm text-gray-500">{apt.date} at {apt.timeSlot}</p>
                </div>
                <div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    apt.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                    apt.status === "Completed" ? "bg-green-100 text-green-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
