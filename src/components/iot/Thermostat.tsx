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

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Thermometer className="w-5 h-5" />
          <span className="font-mono text-sm uppercase tracking-wider">
            {node.name}
          </span>
        </div>
        <div
          className={`w-2 h-2 rounded-full ${node.status === "ONLINE" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-red-500"}`}
        />
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Ring UI */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              className="stroke-zinc-800"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              className="stroke-blue-500"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * (currentTemp - 10)) / 30}
              strokeLinecap="round"
            />
          </svg>

          <div className="flex flex-col items-center z-10">
            <span className="text-4xl font-bold text-white">
              {currentTemp}°
            </span>
            <span className="text-sm text-zinc-500 mt-1">
              Target: {targetTemp}°
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={() => updateTarget(targetTemp - 0.5)}
            className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            <Minus className="w-6 h-6" />
          </button>
          <button
            onClick={() => updateTarget(targetTemp + 0.5)}
            className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
