import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { prescriptions } from "@/db/schema";
import { desc } from "drizzle-orm";
import DispenseButton from "./DispenseButton";

export default async function PharmacistPrescriptionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Pharmacist") {
    redirect("/dashboard");
  }

  // Fetch all prescriptions (in a real app, maybe filter by "Pending" or paginated)
  // Since we don't have explicit Drizzle relations set up between prescriptions and patient names cleanly,
  // we will just display the prescription details. A robust implementation would join the tables.
  const allPrescriptions = await db.query.prescriptions.findMany({
    orderBy: [desc(prescriptions.id)], // Simple fallback ordering
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Prescription Queue</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">All Prescriptions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage & Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No prescriptions found.</td>
                </tr>
              ) : (
                allPrescriptions.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.medicineName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.dosage} for {p.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{p.instructions || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        p.status === "Pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {p.status === "Pending" ? (
                        <DispenseButton id={p.id} />
                      ) : (
                        <span className="text-gray-400">Dispensed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
