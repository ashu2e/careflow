"use client";

import { Calendar, UserPlus, Receipt } from "lucide-react";
import Link from "next/link";

export default function ReceptionistDashboard({ userName }: { userName?: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <UserPlus className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Register Patient</h2>
          </div>
          <p className="text-gray-600">Add new patients to the system.</p>
          <div className="mt-4">
            <Link href="/dashboard/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Register New Patient &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Calendar className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
          </div>
          <p className="text-gray-600">Schedule and manage appointments.</p>
          <div className="mt-4">
            <Link href="/dashboard/book" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Manage Schedule &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Receipt className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Billing</h2>
          </div>
          <p className="text-gray-600">Generate invoices and accept payments.</p>
          <div className="mt-4">
            <Link href="/dashboard/billing" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Go to Billing &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
