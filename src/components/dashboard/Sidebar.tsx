"use client";

import React from "react";
import { useMqtt } from "@/context/MqttContext";
import {
  LayoutDashboard,
  Radio,
  Skull,
  Terminal,
  RefreshCw,
  Map,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "CONTROL CENTER", icon: LayoutDashboard, path: "/" },
  { name: "TACTICAL MAP", icon: Map, path: "/tactical" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { resetSimulation, publish } = useMqtt();

  const handleAttack = (type: string) => {
    // Simulate an attack by publishing to a special topic or just updating local state for demo
    // In a real scenario, this might trigger a test attack script
    console.log(`Simulating ${type}`);
    // For demo purposes, we can publish a fake alert packet to our own topic to trigger the UI
    publish(
      "aegis/stats",
      JSON.stringify({
        packet_rate: 500,
        prob_attack: 0.95,
        type,
      }),
    );
  };

  return (
    <aside className="w-64 border-r border-white/10 bg-black/80 backdrop-blur-md h-[calc(100vh-64px)] fixed bottom-0 left-0 flex flex-col justify-between p-4">
      {/* Navigation */}
      <nav className="space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group border border-transparent",
                isActive
                  ? "bg-green-500/10 text-green-500 border-green-500/30"
                  : "text-neutral-400 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-bold tracking-wider">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Controls */}
      <div className="space-y-6 mb-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5">
          <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-widest">
            Simulation Controls
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => handleAttack("FLOOD")}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 py-2 rounded text-xs font-bold transition-colors"
            >
              <Skull className="w-4 h-4" />
              SIMULATE ATTACK
            </button>

            <button
              onClick={resetSimulation}
              className="w-full flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 py-2 rounded text-xs font-bold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              RESET SYSTEM
            </button>
          </div>
        </div>

        <div className="text-[10px] text-neutral-600 font-mono text-center">
          AEGIS FIRMWARE v2.0.4
          <br />
          GUARDIAN NODE: ONLINE
        </div>
      </div>
    </aside>
  );
}
