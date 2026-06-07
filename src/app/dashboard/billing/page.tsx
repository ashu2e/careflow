import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { invoices, patients } from "@/db/schema";
import { desc } from "drizzle-orm";
import InvoiceForm from "./InvoiceForm";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user.role !== "Receptionist" && session.user.role !== "Admin")) {
    redirect("/dashboard");
  }

  const allPatients = await db.query.patients.findMany({
    with: { user: true }
  });

  const recentInvoices = await db.query.invoices.findMany({
    orderBy: [desc(invoices.generatedAt)],
    limit: 10,
    with: {
      patient: {
        with: { user: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Billing & Invoicing</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Generate New Invoice</h2>
        <InvoiceForm patients={allPatients} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No invoices generated yet.</td>
                </tr>
              ) : (
                recentInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{inv.id.substring(0,8)}...</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{inv.patient?.user?.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${inv.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        inv.paymentStatus === "Pending" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inv.generatedAt).toLocaleDateString()}
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
