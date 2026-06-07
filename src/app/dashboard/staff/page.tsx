import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, staff, doctors } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import StaffForm from "./StaffForm";

export default async function StaffManagementPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "Admin") {
    redirect("/dashboard");
  }

  // Fetch all staff and doctors
  const allStaff = await db.query.staff.findMany({
    with: { user: true }
  });

  const allDoctors = await db.query.doctors.findMany({
    with: { user: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Add New Staff / Doctor</h2>
        <StaffForm />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Current Staff Members</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization/Dept</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.user?.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Doctor</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.specialization}</td>
                </tr>
              ))}
              {allStaff.map((st) => (
                <tr key={st.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{st.user?.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{st.user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{st.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{st.department || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
