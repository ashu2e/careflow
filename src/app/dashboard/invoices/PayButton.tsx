"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PayButton({ id, amount }: { id: string, amount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // In a real app, this would redirect to Stripe Checkout
      const res = await fetch(`/api/invoices/${id}/pay`, {
        method: "POST",
      });
      if (res.ok) {
        alert("Payment successful (Mock)");
        router.refresh();
      } else {
        alert("Payment failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePay}
      disabled={loading}
      className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-medium disabled:opacity-50"
    >
      {loading ? "Processing..." : `Pay $${amount}`}
    </button>
  );
}
