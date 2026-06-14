"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Package, DollarSign, Activity } from "lucide-react";

export default function InventoryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  if (!session || session.user.role !== "Pharmacist") {
    if (typeof window !== "undefined") {
      router.push("/dashboard");
    }
    return null;
  }

  const { data, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const res = await fetch('/api/inventory');
      if (!res.ok) throw new Error('Failed to fetch inventory');
      return res.json();
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newItem: any) => {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (!res.ok) throw new Error('Failed to add medicine');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsAddModalOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedItem: any) => {
      const res = await fetch(`/api/inventory/${updatedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      if (!res.ok) throw new Error('Failed to update medicine');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setIsUpdateModalOpen(false);
      setSelectedItem(null);
    }
  });

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    addMutation.mutate({
      name: formData.get('name'),
      stock: formData.get('stock'),
      threshold: formData.get('threshold'),
      price: formData.get('price')
    });
  };

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;
    const formData = new FormData(e.currentTarget);
    updateMutation.mutate({
      id: selectedItem.id,
      stock: formData.get('stock'),
      price: formData.get('price')
    });
  };

  const inventory = data?.inventory || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Package className="w-6 h-6 mr-2 text-blue-600" />
        Pharmacy Inventory
      </h1>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Current Stock Levels & Pricing</h3>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Medicine
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (₹)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
              ) : inventory.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No inventory found.</td></tr>
              ) : (
                inventory.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.stock} units</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stock <= item.threshold ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                          Sufficient
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => { setSelectedItem(item); setIsUpdateModalOpen(true); }}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-100 transition-colors"
                      >
                        Update / Restock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-full max-w-md mx-auto z-50">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-solid border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Add New Medicine</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                    <input type="number" name="stock" required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                    <input type="number" name="threshold" required min="0" defaultValue={100} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                  <input type="number" name="price" required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-md mr-2">Cancel</button>
                  <button type="submit" disabled={addMutation.isPending} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">
                    {addMutation.isPending ? "Saving..." : "Save Medicine"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Update/Restock Modal */}
      {isUpdateModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsUpdateModalOpen(false)}></div>
          <div className="relative w-full max-w-md mx-auto z-50">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-2xl shadow-2xl outline-none focus:outline-none overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-solid border-gray-100 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Update Inventory: {selectedItem.name}</h3>
                <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-400 hover:text-gray-900"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Total Stock Level</label>
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-gray-400 mr-2" />
                    <input type="number" name="stock" required defaultValue={selectedItem.stock} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current: {selectedItem.stock} units</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per Unit (₹)</label>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                    <input type="number" name="price" required defaultValue={selectedItem.price} min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2 rounded-md mr-2">Cancel</button>
                  <button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md">
                    {updateMutation.isPending ? "Updating..." : "Update Inventory"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
