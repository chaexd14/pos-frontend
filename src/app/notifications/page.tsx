"use client";

import { useState } from "react";
import { Bell, Check, X } from "lucide-react";

type Notif = {
  id: number;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

const seed: Notif[] = [
  { id: 1, title: "Low stock alert",      body: "Coffee Beans inventory below 500g threshold.",  time: "10 min ago",  read: false },
  { id: 2, title: "Order voided",         body: "TRX-1000 was voided by the cashier.",           time: "2 hrs ago",   read: false },
  { id: 3, title: "Refund processed",     body: "TRX-1001 refund of ₱196.00 completed.",         time: "3 hrs ago",   read: true  },
  { id: 4, title: "Daily report ready",   body: "Your daily sales report for Jun 4 is ready.",   time: "Yesterday",   read: true  },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>(seed);

  const markRead  = (id: number) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss   = (id: number) => setNotifs((p) => p.filter((n) => n.id !== id));
  const markAll   = ()           => setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  const unreadCnt = notifs.filter((n) => !n.read).length;

  return (
    <div className="flex-1 flex flex-col min-h-0 w-full overflow-hidden bg-zinc-50/30">
      <div className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {unreadCnt > 0 ? `${unreadCnt} unread` : "All caught up"}
          </p>
        </div>
        {unreadCnt > 0 && (
          <button
            onClick={markAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <Check className="size-3.5" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex-grow min-h-0 overflow-y-auto p-6">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-50">
          {notifs.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">
              <Bell className="size-6 mx-auto mb-2 text-gray-300" />
              No notifications.
            </div>
          )}
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors ${!n.read ? "bg-gray-50/40" : ""}`}
            >
              <div className={`mt-1 size-2 rounded-full shrink-0 ${!n.read ? "bg-gray-800" : "bg-gray-200"}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${!n.read ? "text-gray-900" : "text-gray-600"}`}>{n.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="text-gray-400 hover:text-gray-700 transition-colors" title="Mark read">
                    <Check className="size-3.5" />
                  </button>
                )}
                <button onClick={() => dismiss(n.id)} className="text-gray-300 hover:text-rose-400 transition-colors" title="Dismiss">
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
