"use client";

import React, { useMemo } from "react";
import { useMqtt, AuthEvent } from "@/context/MqttContext";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldBan,
  LockOpen,
  Terminal,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const AuthLogItem = ({ event }: { event: AuthEvent }) => {
  const getIcon = () => {
    switch (event.status) {
      case "success":
        return <ShieldCheck className="w-4 h-4 text-green-500" />;
      case "failed":
        return <ShieldAlert className="w-4 h-4 text-orange-500" />;
      case "brute_force":
        return <ShieldBan className="w-4 h-4 text-red-500 animate-pulse" />;
      case "unblocked":
        return <LockOpen className="w-4 h-4 text-blue-500" />;
      case "blocked":
        return <ShieldBan className="w-4 h-4 text-red-500" />;
    }
  };

  const getMessage = () => {
    switch (event.status) {
      case "success":
        return (
          <span className="text-green-400">
            Successful login from {event.ip}
          </span>
        );
      case "failed":
        return (
          <span className="text-orange-400">
            Failed login from {event.ip}{" "}
            {event.attempt && `| Attempt: ${event.attempt}`}
          </span>
        );
      case "brute_force":
        return (
          <span className="text-red-500 font-bold">
            🚨 BRUTE FORCE DETECTED from {event.ip}
          </span>
        );
      case "unblocked":
        return (
          <span className="text-blue-400">
            Client automatically unblocked: {event.ip}
          </span>
        );
      case "blocked":
        return (
          <span className="text-red-400 font-bold">
            🚨 DEVICE MANUALLY BLOCKED: {event.ip}
          </span>
        );
    }
  };

  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/5 font-mono text-xs">
      <span className="text-neutral-500 min-w-[70px]">
        {new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
      </span>
      <div className="flex items-center gap-2">
        {getIcon()}
        {getMessage()}
      </div>
    </div>
  );
};

export default function BruteForceMonitor() {
  const { authEvents } = useMqtt();

  // Calculate statistics for the chart
  const stats = useMemo(() => {
    const success = authEvents.filter((e) => e.status === "success").length;
    const failed = authEvents.filter((e) => e.status === "failed").length;
    const bruteForce = authEvents.filter(
      (e) => e.status === "brute_force",
    ).length;

    return [
      { name: "Success", value: success, color: "#22c55e" },
      { name: "Failed", value: failed, color: "#f97316" },
      { name: "Brute Force", value: bruteForce, color: "#ef4444" },
    ];
  }, [authEvents]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Chart Section */}
      <div className="col-span-1 bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col">
        <h3 className="text-sm font-bold text-neutral-400 tracking-wider mb-4 flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          AUTH ATTEMPTS SUMMARY
        </h3>

        <div className="flex-1 w-full min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats}>
              <XAxis
                dataKey="name"
                stroke="#666"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  backgroundColor: "#000",
                  border: "1px solid #333",
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {stats.map((s) => (
            <div key={s.name} className="bg-white/5 rounded p-2">
              <div className="text-xs text-neutral-500">
                {s.name.toUpperCase()}
              </div>
              <div className="text-lg font-bold" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs Section */}
      <div className="col-span-1 lg:col-span-2 bg-black/40 border border-white/10 rounded-xl p-6 relative overflow-hidden flex flex-col h-[300px] lg:h-auto">
        <h3 className="text-sm font-bold text-neutral-400 tracking-wider mb-4 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          REAL-TIME SECURITY LOGS
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {authEvents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-2">
              <Terminal className="w-8 h-8 opacity-50" />
              <span className="text-xs font-mono">
                NO SECURITY EVENTS DETECTED
              </span>
            </div>
          ) : (
            <div className="flex flex-col-reverse">
              {authEvents.map((event) => (
                <AuthLogItem key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
