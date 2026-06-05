"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useMemo, Suspense } from "react";

type ChartData  = { label: string; value: number };
type TopProduct = { name: string; category: string; qty: number; revenue: number; percentage: number };

const dailyData: ChartData[] = [
  { label: "08 AM", value: 1400 }, { label: "10 AM", value: 2900 },
  { label: "12 PM", value: 4500 }, { label: "02 PM", value: 3200 },
  { label: "04 PM", value: 5800 }, { label: "06 PM", value: 7100 },
  { label: "08 PM", value: 4800 },
];
const weeklyData: ChartData[] = [
  { label: "Mon", value: 15400 }, { label: "Tue", value: 18900 },
  { label: "Wed", value: 16500 }, { label: "Thu", value: 21000 },
  { label: "Fri", value: 28900 }, { label: "Sat", value: 34500 },
  { label: "Sun", value: 31200 },
];
const monthlyData: ChartData[] = [
  { label: "Week 1", value: 110400 }, { label: "Week 2", value: 125900 },
  { label: "Week 3", value: 148200 }, { label: "Week 4", value: 165400 },
];
const topProducts: TopProduct[] = [
  { name: "Iced Coffee",  category: "Iced Beverages", qty: 240, revenue: 28800, percentage: 80 },
  { name: "Latte",        category: "Hot Beverages",  qty: 180, revenue: 23400, percentage: 65 },
  { name: "Croissant",    category: "Pastries",       qty: 150, revenue: 13500, percentage: 50 },
  { name: "Cappuccino",   category: "Hot Beverages",  qty: 120, revenue: 14400, percentage: 40 },
  { name: "Flat White",   category: "Hot Beverages",  qty: 95,  revenue: 12825, percentage: 32 },
];

const TABS = [
  { key: "daily",   label: "Daily" },
  { key: "weekly",  label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "top",     label: "Top Products" },
  { key: "summary", label: "Summary" },
];

const summaryCards = [
  { label: "Gross Sales",    value: "₱384,200.00", change: "+8.4%",  up: true  },
  { label: "Net Sales",      value: "₱341,400.00", change: "+10.2%", up: true  },
  { label: "Average Order",  value: "₱242.00",     change: "−1.4%",  up: false },
  { label: "Items Sold",     value: "1,580 pcs",   change: "+5.6%",  up: true  },
];

function ReportsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const activeTab    = searchParams.get("tab") || "daily";

  const chartData = useMemo(() => {
    if (activeTab === "weekly")  return weeklyData;
    if (activeTab === "monthly") return monthlyData;
    return dailyData;
  }, [activeTab]);

  const maxVal    = useMemo(() => Math.max(...chartData.map((d) => d.value), 1), [chartData]);
  const totalSales = useMemo(() => chartData.reduce((s, d) => s + d.value, 0), [chartData]);

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      {/* Page Header */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Sales & Analytics</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Revenue trends, top items, and summary metrics.</p>
      </div>

      {/* Tab Pills */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-3 flex items-center gap-1.5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => router.push(`/reports?tab=${t.key}`)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              activeTab === t.key
                ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                : "bg-zinc-100/80 text-zinc-600 border-zinc-200 hover:bg-zinc-200/60"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto p-6 space-y-6">
        {/* Chart View (daily / weekly / monthly) */}
        {activeTab !== "top" && activeTab !== "summary" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            {/* Bar Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Period Revenue</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">₱{totalSales.toLocaleString()}</p>
                </div>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full ring-1 ring-emerald-200">
                  +14.2% growth
                </span>
              </div>
              <div className="flex items-end gap-2 h-48 pt-2">
                {chartData.map((d, i) => {
                  const pct = (d.value / maxVal) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                        ₱{d.value.toLocaleString()}
                      </span>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full bg-gray-800 rounded-t hover:bg-gray-600 transition-colors cursor-default"
                      />
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{d.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Metrics</p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="text-gray-500">Peak period</span>
                  <span className="font-semibold text-gray-800">
                    {chartData.reduce((prev, curr) => curr.value > prev.value ? curr : prev).label}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="text-gray-500">Average</span>
                  <span className="font-semibold text-gray-800">
                    ₱{Math.round(totalSales / chartData.length).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2.5">
                  <span className="text-gray-500">Data points</span>
                  <span className="font-semibold text-gray-800">{chartData.length} entries</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Transactions</span>
                  <span className="font-semibold text-gray-800">{chartData.length * 8} sales</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Products */}
        {activeTab === "top" && (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-2xl">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">Best-Selling Products</p>
            </div>
            <div className="divide-y divide-gray-50">
              {topProducts.map((p, idx) => (
                <div key={idx} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400 w-4">#{idx + 1}</span>
                      <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                      <span className="text-xs text-gray-400">({p.category})</span>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className="text-sm font-semibold text-gray-900">{p.qty} sold</span>
                      <span className="text-xs text-gray-400 ml-2">₱{p.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${p.percentage}%` }}
                      className="h-full bg-gray-700 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {activeTab === "summary" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCards.map((c) => (
              <div key={c.label} className="bg-white border border-gray-200 rounded-lg p-5">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{c.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{c.value}</p>
                <p className={`text-xs font-semibold mt-1 ${c.up ? "text-emerald-600" : "text-rose-500"}`}>
                  {c.change} vs last month
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-400">Loading…</div>}>
      <ReportsContent />
    </Suspense>
  );
}
