"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  Users, Calendar, FileText, Settings, LogOut, 
  Activity, Home, Pill, Receipt
} from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  if (!session?.user) return null;

  const role = session.user.role;

  const getNavItems = () => {
    switch (role) {
      case "Admin":
        return [
          { name: "Dashboard", href: "/dashboard", icon: Home },
          { name: "Staff", href: "/dashboard/staff", icon: Users },
          { name: "Reports", href: "/dashboard/reports", icon: Activity },
          { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ];
      case "Doctor":
        return [
          { name: "Appointments", href: "/dashboard", icon: Calendar },
          { name: "Patients", href: "/dashboard/patients", icon: Users },
        ];
      case "Patient":
        return [
          { name: "My Appointments", href: "/dashboard", icon: Calendar },
          { name: "Medical History", href: "/dashboard/history", icon: FileText },
          { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
        ];
      case "Receptionist":
        return [
          { name: "Appointments", href: "/dashboard", icon: Calendar },
          { name: "Register Patient", href: "/dashboard/register", icon: Users },
          { name: "Billing", href: "/dashboard/billing", icon: Receipt },
        ];
      case "Pharmacist":
        return [
          { name: "Prescriptions", href: "/dashboard", icon: Pill },
          { name: "Inventory", href: "/dashboard/inventory", icon: Activity },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">CareFlow HMS</span>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex-shrink-0 w-full group block">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">{session.user.name}</p>
              <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                {session.user.role}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-400 hover:text-red-500"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
