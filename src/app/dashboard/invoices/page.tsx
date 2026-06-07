import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invoices, patients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import PayButton from "./PayButton";

export default async function PatientInvoicesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Patient") {
    redirect("/dashboard");
  }

  const patientRecord = await db.query.patients.findFirst({
    where: eq(patients.userId, session.user.id),
  });

  if (!patientRecord) return <div>Patient record not found.</div>;

  const myInvoices = await db.query.invoices.findMany({
    where: eq(invoices.patientId, patientRecord.id),
    orderBy: [desc(invoices.generatedAt)],
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No invoices found.</td>
                </tr>
              ) : (
                myInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.id.substring(0,8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${inv.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inv.generatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inv.paymentStatus === "Pending" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {inv.paymentStatus === "Pending" ? (
                        <PayButton id={inv.id} amount={inv.amount} />
                      ) : (
                        <span className="text-gray-400">Paid</span>
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
