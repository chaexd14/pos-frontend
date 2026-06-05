export default function DashboardPage() {
  const stats = [
    { label: "Today's Sales",   value: "₱7,240.00",  sub: "+12% vs yesterday",   up: true  },
    { label: "Orders Today",    value: "38",          sub: "6 pending",            up: true  },
    { label: "Items Sold",      value: "124 pcs",     sub: "Top: Iced Coffee",     up: true  },
    { label: "Avg Order Value", value: "₱190.50",     sub: "−3% vs yesterday",     up: false },
  ];

  const recent = [
    { id: "TRX-1002", time: "14:24", items: 3, total: 302.40, status: "Completed" },
    { id: "TRX-1001", time: "11:15", items: 2, total: 196.00, status: "Refunded"  },
    { id: "TRX-1000", time: "09:32", items: 3, total: 453.60, status: "Voided"    },
  ];

  const statusColors: Record<string, string> = {
    Completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Refunded:  "bg-amber-50  text-amber-700  ring-amber-200",
    Voided:    "bg-rose-50   text-rose-700   ring-rose-200",
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      {/* Header */}
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Overview of today&apos;s performance.</p>
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{s.value}</p>
              <p className={`text-xs font-medium mt-1 ${s.up ? "text-emerald-600" : "text-rose-500"}`}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-900">Recent Transactions</p>
            <a href="/orders" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Order ID</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Time</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Items</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-right">Total</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide text-center">Status</span>
          </div>
          {recent.map((r) => (
            <div
              key={r.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-gray-50 last:border-none hover:bg-gray-50/60 transition-colors items-center"
            >
              <span className="font-mono text-sm font-semibold text-gray-800">{r.id}</span>
              <span className="text-sm text-gray-500">{r.time}</span>
              <span className="text-sm text-gray-600 text-center">{r.items}</span>
              <span className="text-sm font-semibold text-gray-900 text-right">₱{r.total.toFixed(2)}</span>
              <div className="flex justify-center">
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ring-1 ${statusColors[r.status]}`}>
                  {r.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
