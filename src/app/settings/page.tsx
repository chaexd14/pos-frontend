"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

export default function SettingsPage() {
  const [storeName,  setStoreName]  = useState("SaikoTeckh Cafe");
  const [address,    setAddress]    = useState("123 Main Street, Manila");
  const [taxRate,    setTaxRate]    = useState("12");
  const [currency,   setCurrency]   = useState("PHP");
  const [receiptMsg, setReceiptMsg] = useState("Thank you for your purchase!");
  const [saved,      setSaved]      = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Settings</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Configure store preferences and receipt options.</p>
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto p-6">
        <form onSubmit={handleSave} className="max-w-lg space-y-6">

          {/* Store Info */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Store Information</p>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Store Name</label>
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="h-9 text-sm border-gray-200 focus-visible:ring-gray-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Address</label>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-9 text-sm border-gray-200 focus-visible:ring-gray-400"
              />
            </div>
          </div>

          {/* Tax & Currency */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Tax & Currency</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">VAT Rate (%)</label>
                <Input
                  type="number"
                  min="0" max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="h-9 text-sm border-gray-200 focus-visible:ring-gray-400"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="PHP">PHP — Philippine Peso (₱)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="EUR">EUR — Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Receipt */}
          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Receipt</p>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Footer Message</label>
              <Input
                value={receiptMsg}
                onChange={(e) => setReceiptMsg(e.target.value)}
                className="h-9 text-sm border-gray-200 focus-visible:ring-gray-400"
              />
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-700 transition-colors"
            >
              <Check className="size-3.5" /> Save Changes
            </button>
            {saved && (
              <span className="text-xs text-emerald-600 font-medium animate-fade-in">Settings saved.</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
