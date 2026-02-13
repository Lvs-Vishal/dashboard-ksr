"use client";

import { useState } from "react";
import { Thermometer, Plus, Minus } from "lucide-react";
import { useMqtt } from "@/context/MqttContext";

import { setThermostat } from "@/app/actions/iot";

interface ThermostatProps {
  nodeId: string;
}

export default function Thermostat({ nodeId }: ThermostatProps) {
  const { nodes, publish } = useMqtt();
  const node = nodes[nodeId];

  // Local state for immediate UI feedback while waiting for MQTT update
  const [localTarget, setLocalTarget] = useState<number | null>(null);

  if (!node || node.type !== "THERMOSTAT") return null;

  const currentTemp = (node.data.temp as number) || 20;
  const targetTemp =
    localTarget !== null ? localTarget : (node.data.target as number) || 20;

  const updateTarget = async (newTarget: number) => {
    setLocalTarget(newTarget);
    publish(`aegis/node/${nodeId}/set`, JSON.stringify({ target: newTarget }));
    await setThermostat(newTarget);

    // Clear local override after a delay to sync with server
    setTimeout(() => setLocalTarget(null), 2000);
  };

  const isCompromised =
    node?.status === "COMPROMISED" || (targetTemp as number) > 45;

  return (
    <div
      className={`border rounded-xl p-6 backdrop-blur-sm transition-all duration-300 ${isCompromised ? "bg-red-900/20 border-red-500 animate-pulse" : "bg-zinc-900/50 border-zinc-800"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Thermometer
            className={`w-5 h-5 ${isCompromised ? "text-red-500" : ""}`}
          />
          <span
            className={`font-mono text-sm uppercase tracking-wider ${isCompromised ? "text-red-500 font-bold" : ""}`}
          >
            {node.name}
          </span>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${node.status === "ONLINE" && !isCompromised ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"}`}
        />
      </div>

      {isCompromised && (
        <div className="mb-4 text-center">
          <span className="text-red-500 font-bold tracking-widest animate-pulse border-b-2 border-red-500">
            ⚠ SYSTEM COMPROMISED ⚠
          </span>
        </div>
      )}

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Ring UI */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              className={
                isCompromised ? "stroke-red-900/50" : "stroke-zinc-800"
              }
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              className={isCompromised ? "stroke-red-500" : "stroke-blue-500"}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * (currentTemp - 10)) / 30}
              strokeLinecap="round"
            />
          </svg>

          <div className="flex flex-col items-center z-10">
            <span
              className={`text-4xl font-bold ${isCompromised ? "text-red-500" : "text-white"}`}
            >
              {currentTemp}°
            </span>
            <span
              className={`text-sm mt-1 ${isCompromised ? "text-red-400 font-bold" : "text-zinc-500"}`}
            >
              Target: {targetTemp}°
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={() => updateTarget(targetTemp - 1)}
            className={`p-3 rounded-full transition-colors text-white ${isCompromised ? "bg-red-900/50 hover:bg-red-800" : "bg-zinc-800 hover:bg-zinc-700"}`}
          >
            <Minus className="w-6 h-6" />
          </button>
          <button
            onClick={() => updateTarget(targetTemp + 1)}
            className={`p-3 rounded-full transition-colors text-white ${isCompromised ? "bg-red-900/50 hover:bg-red-800" : "bg-zinc-800 hover:bg-zinc-700"}`}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
