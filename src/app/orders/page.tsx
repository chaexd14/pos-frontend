"use client";

import React, { useMemo, useState, Suspense } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  timestamp: string;
  customer: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: "Completed" | "Refunded" | "Voided";
};

const initialOrders: Order[] = [
  {
    id: "TRX-1002",
    timestamp: "2026-06-05 14:24",
    customer: "Walk-in",
    items: [
      { name: "Americano (Medium)", qty: 2, price: 90 },
      { name: "Croissant", qty: 1, price: 90 },
    ],
    subtotal: 270,
    tax: 32.4,
    total: 302.4,
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "TRX-1001",
    timestamp: "2026-06-05 11:15",
    customer: "Walk-in",
    items: [
      { name: "Caramel Macchiato (Large)", qty: 1, price: 150 },
      { name: "Oat Milk", qty: 1, price: 25 },
    ],
    subtotal: 175,
    tax: 21.0,
    total: 196.0,
    paymentMethod: "GCash",
    status: "Refunded",
  },
  {
    id: "TRX-1000",
    timestamp: "2026-06-04 18:32",
    customer: "Walk-in",
    items: [{ name: "Flat White (Medium)", qty: 3, price: 135 }],
    subtotal: 405,
    tax: 48.6,
    total: 453.6,
    paymentMethod: "Card",
    status: "Voided",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Refunded:  "bg-amber-50  text-amber-700  ring-amber-200",
  Voided:    "bg-rose-50   text-rose-700   ring-rose-200",
};

function OrdersContent() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRefund = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Refunded" as const } : o)));
  };

  const handleVoid = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "Voided" as const } : o)));
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const toggleExpand = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      {/* Page Header */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Transaction Ledger</h1>
        <p className="text-xs text-zinc-500 mt-0.5">All orders, refunds, and voids in one place.</p>
      </div>

      {/* Filters */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-400" />
          <Input
            placeholder="Search by ID or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm border-zinc-200 focus-visible:ring-zinc-400 bg-zinc-50/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 transition-colors">
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["All", "Completed", "Refunded", "Voided"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                statusFilter === s
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                  : "bg-zinc-100/80 text-zinc-600 border-zinc-200 hover:bg-zinc-200/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <span className="ml-auto text-xs text-zinc-400 font-medium shrink-0">
          {filtered.length} record{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Ledger Table */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6">
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs">
          {/* Header Row */}
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 border-b border-zinc-200 bg-zinc-50/50">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Order ID</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Date & Time</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Payment</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-right">Total</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Status</span>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-center">Action</span>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-sm">No transactions found.</div>
          ) : (
            filtered.map((o) => (
              <React.Fragment key={o.id}>
                {/* Main Row */}
                <div
                  className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr_1fr] gap-4 px-4 py-3.5 border-b border-zinc-100 hover:bg-zinc-50/50 transition-colors cursor-pointer items-center"
                  onClick={() => toggleExpand(o.id)}
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={`size-3.5 text-zinc-400 transition-transform shrink-0 ${expandedId === o.id ? "rotate-180" : ""}`}
                    />
                    <span className="font-mono text-sm font-semibold text-zinc-800">{o.id}</span>
                  </div>
                  <span className="text-sm text-zinc-600">{o.timestamp}</span>
                  <span className="text-sm text-zinc-600">{o.paymentMethod}</span>
                  <span className="text-sm font-semibold text-zinc-900 text-right">₱{o.total.toFixed(2)}</span>
                  <div className="flex justify-center">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ring-1 ${STATUS_COLORS[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                  {/* Inline actions */}
                  <div className="flex justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {o.status === "Completed" && (
                      <>
                        <button
                          onClick={() => handleRefund(o.id)}
                          className="text-[11px] px-2 py-1 rounded bg-amber-50 text-amber-700 hover:bg-amber-100 font-medium ring-1 ring-amber-200 transition-colors"
                        >
                          Refund
                        </button>
                        <button
                          onClick={() => handleVoid(o.id)}
                          className="text-[11px] px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 font-medium ring-1 ring-rose-200 transition-colors"
                        >
                          Void
                        </button>
                      </>
                    )}
                    {o.status !== "Completed" && (
                      <span className="text-[11px] text-zinc-400 italic">—</span>
                    )}
                  </div>
                </div>

                {/* Expanded Detail Row */}
                {expandedId === o.id && (
                  <div className="bg-zinc-50/50 border-b border-zinc-200 px-8 py-4">
                    <div className="grid gap-6 sm:grid-cols-2 max-w-2xl">
                      {/* Items */}
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Items Ordered</p>
                        <div className="space-y-1.5">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm text-zinc-700">
                              <span>{item.qty}× {item.name}</span>
                              <span className="font-medium text-zinc-900">₱{(item.qty * item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Totals */}
                      <div>
                        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Breakdown</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between text-zinc-500">
                            <span>Subtotal</span>
                            <span>₱{o.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-500">
                            <span>VAT (12%)</span>
                            <span>₱{o.tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-zinc-900 border-t border-zinc-200 pt-1 mt-1">
                            <span>Total</span>
                            <span>₱{o.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading…</div>}>
      <OrdersContent />
    </Suspense>
  );
}
