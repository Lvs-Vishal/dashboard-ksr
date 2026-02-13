"use client";

import { useState } from "react";
import { Lightbulb, Loader2, Power } from "lucide-react";
import { useMqtt } from "@/context/MqttContext";

interface LightControlProps {
  nodeId: string;
  label: string;
  onToggle?: (newState: boolean) => Promise<void>;
}

export default function LightControl({
  nodeId,
  label,
  onToggle,
}: LightControlProps) {
  const { nodes, publish } = useMqtt();
  const node = nodes[nodeId];

  // Local state for optimistic updates and loading
  const [isPending, setIsPending] = useState(false);

  if (!node || node.type !== "LIGHT") return null;

  const isOn = node.data.state as boolean;

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();

    // We want the UI to be responsive even if a previous request is in flight
    // But we still track pending state for the spinner

    const newState = !isOn;
    setIsPending(true);

    try {
      // First update via MQTT if no specific action provided, or do both
      publish(`aegis/node/${nodeId}/set`, JSON.stringify({ state: newState }));

      // If custom action provided (API call), execute it
      if (onToggle) {
        await onToggle(newState);
      }
    } catch (error) {
      console.error("Failed to toggle light:", error);
      // Revert optimistic update handling if we were managing state here
      // But since we rely on MQTT or parent, we just stop loading
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`cursor-pointer group relative overflow-hidden p-6 rounded-xl border transition-all duration-200 active:scale-[0.98] select-none ${
        isOn
          ? "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_30px_-5px_rgba(234,179,8,0.3)]"
          : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50"
      }`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div
          className={`p-3 rounded-full transition-all duration-300 ${
            isOn
              ? "bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]"
              : "bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700"
          }`}
        >
          {isPending ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Lightbulb
              className={`w-6 h-6 transition-transform duration-300 ${isOn ? "scale-110" : "scale-100"}`}
            />
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-end gap-1">
          <div
            className={`w-2 h-2 rounded-full ${node.status === "ONLINE" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}
          />
          {isOn && (
            <div className="text-[10px] font-mono text-yellow-500 font-bold tracking-wider">
              ON
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 relative z-10">
        <h3 className="text-lg font-medium text-white mb-1 group-hover:text-yellow-100 transition-colors">
          {label}
        </h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 ${isOn ? "bg-yellow-500" : "bg-zinc-700"}`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${isOn ? "translate-x-4" : "translate-x-0"}`}
            />
          </div>
          <span
            className={`text-sm font-mono ${isOn ? "text-yellow-500" : "text-zinc-500"}`}
          >
            {isOn ? "ACTIVE" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Background glow effect when on */}
      <div
        className={`absolute -right-12 -bottom-12 w-40 h-40 bg-yellow-500/20 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 ${isOn ? "opacity-100" : "opacity-0"}`}
      />

      {/* Hover effect for off state */}
      {!isOn && (
        <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
    </div>
  );
}
