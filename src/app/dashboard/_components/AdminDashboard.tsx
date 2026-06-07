"use client";

import { Users, Activity, DollarSign } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Users className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Staff Management</h2>
          </div>
          <p className="text-gray-600">Manage doctors, receptionists, and pharmacists.</p>
          <div className="mt-4">
            <Link href="/dashboard/staff" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Go to Staff &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Activity className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Reports</h2>
          </div>
          <p className="text-gray-600">View hospital performance and appointments.</p>
          <div className="mt-4">
            <Link href="/dashboard/reports" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View Reports &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <DollarSign className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Revenue</h2>
          </div>
          <p className="text-gray-600">Track billing and payments.</p>
        </div>
      </div>
    </div>
  );
}
