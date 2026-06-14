"use client";

import { Users, Activity, DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AdminDashboard({ stats, userName }: { stats?: any, userName?: string }) {
  if (!stats) return <div>Loading...</div>;

  const pieData = {
    labels: ['Scheduled', 'Completed', 'Cancelled'],
    datasets: [
      {
        data: [stats.appointments.scheduled, stats.appointments.completed, stats.appointments.cancelled],
        backgroundColor: ['#3b82f6', '#10b981', '#ef4444'],
        hoverBackgroundColor: ['#2563eb', '#059669', '#dc2626'],
      },
    ],
  };

  const barData = {
    labels: ['Revenue'],
    datasets: [
      {
        label: 'Paid',
        data: [stats.revenue.paid],
        backgroundColor: '#10b981',
      },
      {
        label: 'Pending',
        data: [stats.revenue.pending],
        backgroundColor: '#f59e0b',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Patients</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStaff + stats.totalDoctors}</p>
          </div>
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <Activity className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Appointments</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.appointments.scheduled + stats.appointments.completed + stats.appointments.cancelled}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${stats.revenue.paid}</p>
          </div>
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments Overview</h3>
          <div className="h-64 flex justify-center">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 flex justify-center">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link href="/dashboard/staff" className="bg-blue-600 text-white px-4 py-2 rounded shadow text-sm font-medium hover:bg-blue-700 transition-colors">
          Manage Staff
        </Link>
        <Link href="/dashboard/reports" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
          View Detailed Reports
        </Link>
      </div>
    </div>
  );
}
