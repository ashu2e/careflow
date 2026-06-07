"use client";

import { Pill, Activity } from "lucide-react";
import Link from "next/link";

export default function PharmacistDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pharmacist Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Pill className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Prescription Queue</h2>
          </div>
          <p className="text-gray-600">View and dispense pending prescriptions.</p>
          <div className="mt-4">
            <Link href="/dashboard/prescriptions" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Go to Queue &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3 text-blue-600 mb-4">
            <Activity className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-gray-900">Inventory</h2>
          </div>
          <p className="text-gray-600">Manage medicine stock levels.</p>
          <div className="mt-4">
            <Link href="/dashboard/inventory" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Manage Inventory &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
