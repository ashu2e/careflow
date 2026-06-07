"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function InventoryPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session || session.user.role !== "Pharmacist") {
    if (typeof window !== "undefined") {
      router.push("/dashboard");
    }
    return null;
  }

  // Mock inventory data (in a real app, this would be fetched from the DB)
  const [inventory, setInventory] = useState([
    { id: 1, name: "Paracetamol 500mg", stock: 1500, threshold: 500 },
    { id: 2, name: "Amoxicillin 250mg", stock: 320, threshold: 400 },
    { id: 3, name: "Ibuprofen 400mg", stock: 850, threshold: 300 },
    { id: 4, name: "Cetirizine 10mg", stock: 1200, threshold: 200 },
    { id: 5, name: "Azithromycin 500mg", stock: 150, threshold: 200 },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pharmacy Inventory</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Current Stock Levels</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
            + Add Medicine
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock} units</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.stock <= item.threshold ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Sufficient
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-4">Update</button>
                    <button className="text-green-600 hover:text-green-900">Restock</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
