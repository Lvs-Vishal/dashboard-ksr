"use client";

import React from "react";
import { NodeStatus, useMqtt } from "@/context/MqttContext";
import { clsx } from "clsx";
import {
  Thermometer,
  Monitor,
  Lightbulb,
  Wifi,
  AlertTriangle,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  THERMOSTAT: Thermometer,
  DISPLAY: Monitor,
  LIGHT: Lightbulb,
};

export default function NodeCard({ node }: { node: NodeStatus }) {
  const { updateNodeIp } = useMqtt();
  const Icon = iconMap[node.type];
  const isCompromised = node.status === "COMPROMISED";
  const [isEditing, setIsEditing] = React.useState(false);
  const [ip, setIp] = React.useState(node.ip);

  const handleSave = () => {
    updateNodeIp(node.id, ip);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIp(node.ip);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={clsx(
        "relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-300",
        isCompromised
          ? "bg-red-900/20 border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] animate-pulse"
          : "bg-white/5 border-green-500/20 hover:border-green-500/50 hover:bg-white/10",
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "p-2 rounded-lg",
              isCompromised
                ? "bg-red-500/20 text-red-500"
                : "bg-green-500/20 text-green-500",
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wide text-white">
              {node.name}
            </h3>
            {isEditing ? (
              <div className="flex items-center gap-1 mt-1">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="bg-black/50 border border-white/20 rounded px-1 py-0.5 text-[10px] w-24 text-white focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleSave}
                  className="text-green-500 hover:text-green-400"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={handleCancel}
                  className="text-red-500 hover:text-red-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 group/ip cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                <div className="text-[10px] font-mono text-neutral-400 group-hover/ip:text-white transition-colors">
                  {node.ip}
                </div>
                <Edit2 className="w-3 h-3 text-neutral-600 opacity-0 group-hover/ip:opacity-100 transition-opacity" />
              </div>
            )}
          </div>
        </div>

        <div
          className={clsx(
            "text-[10px] font-bold px-2 py-0.5 rounded border",
            isCompromised
              ? "border-red-500 text-red-500 bg-red-500/10"
              : "border-green-500 text-green-500 bg-green-500/10",
          )}
        >
          {node.status}
        </div>
      </div>

      {/* Data Display */}
      <div className="space-y-2 font-mono text-xs">
        {node.type === "THERMOSTAT" && (
          <div className="flex flex-col gap-2 border-t border-white/10 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Real Temp</span>
              <span className="text-white font-bold text-lg">
                {node.data.temp as number}°C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400">Set Point</span>
              <span
                className={clsx(
                  "font-mono font-bold",
                  (node.data.target as number) > 45
                    ? "text-red-500 animate-pulse"
                    : "text-blue-400",
                )}
              >
                {node.data.target as number}°C
              </span>
            </div>
            {isCompromised && (
              <div className="bg-red-500/20 text-red-500 text-[10px] uppercase font-bold text-center py-1 rounded animate-pulse border border-red-500/50">
                ⚠ CRITICAL OVERHEAT
              </div>
            )}
          </div>
        )}
        {node.type === "DISPLAY" && (
          <div className="border-t border-white/10 pt-2">
            <span className="text-neutral-400 block mb-1">Message</span>
            <div className="bg-black/50 p-2 rounded text-green-400 truncate">
              {node.data.msg as string}
            </div>
          </div>
        )}
        {node.type === "LIGHT" && (
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span className="text-neutral-400">State</span>
            <span
              className={clsx(
                node.data.state ? "text-yellow-400" : "text-neutral-600",
              )}
            >
              {node.data.state ? "ON" : "OFF"}
            </span>
          </div>
        )}
      </div>

      {/* Visual Indicator of Connection */}
      <div className="absolute top-0 right-0 p-2 opacity-50">
        {isCompromised ? (
          <AlertTriangle className="w-12 h-12 text-red-500/10" />
        ) : (
          <Wifi className="w-12 h-12 text-green-500/10" />
        )}
      </div>
    </motion.div>
  );
}
