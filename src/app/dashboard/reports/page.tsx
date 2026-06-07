"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || session.user.role !== "Admin") {
    // Basic client-side redirect for unauthorized users
    if (typeof window !== "undefined") {
      router.push("/dashboard");
    }
    return null;
  }

  // Mock data for charts (in a real app, fetch this from an API endpoint)
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12000, 19000, 15000, 22000, 18000, 25000, 30000],
        borderColor: "rgb(37, 99, 235)",
        backgroundColor: "rgba(37, 99, 235, 0.5)",
      },
    ],
  };

  const appointmentData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Appointments",
        data: [45, 52, 38, 65, 48, 20, 15],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Hospital Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          <Line 
            data={revenueData} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" as const },
              },
            }} 
          />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointments</h2>
          <Bar 
            data={appointmentData} 
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" as const },
              },
            }} 
          />
        </div>
      </div>
    </div>
  );
}
