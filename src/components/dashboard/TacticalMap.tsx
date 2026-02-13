"use client";

import React from "react";
import { useMqtt } from "@/context/MqttContext";
import NodeCard from "@/components/widgets/NodeCard";
import TrafficGraph from "@/components/widgets/TrafficGraph";
import { Shield, Server, Activity } from "lucide-react";

export default function TacticalMap() {
  const { nodes, threatLevel, guardianStatus } = useMqtt();

  // Convert nodes record to array
  const nodeList = Object.values(nodes);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Top Section: Guardian Status & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-1/2">
        {/* Guardian Unit Status */}
        <div className="col-span-1 bg-black/40 border border-green-500/20 rounded-xl p-6 relative overflow-hidden group hover:border-green-500/40 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield className="w-32 h-32 text-green-500" />
          </div>

          <h2 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
            <Server className="w-5 h-5" />
            GUARDIAN NODE (ESP32-S3)
          </h2>

          <div className="space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-400">STATUS</span>
              <span className="text-green-500 font-bold">ACTIVE SCANNING</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-400">MODE</span>
              <span className="text-blue-400">Promiscuous (Silent)</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-400">UPTIME</span>
              <span className="text-white">
                {guardianStatus &&
                !isNaN(guardianStatus.uptime_sec) &&
                guardianStatus.uptime_sec >= 0
                  ? new Date(guardianStatus.uptime_sec * 1000)
                      .toISOString()
                      .substr(11, 8)
                  : "00:00:00"}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-neutral-400">TOTAL ATTACKS</span>
              <span className="text-purple-400">
                {guardianStatus?.total_attacks || 0}
              </span>
            </div>
            <div className="flex flex-col border-b border-white/10 pb-2">
              <span className="text-neutral-400 mb-1">LAST EVENT</span>
              <span className="text-xs text-yellow-500 break-all">
                {guardianStatus?.last_event || "No events detected"}
              </span>
            </div>

            <div className="pt-4">
              <div className="text-xs text-neutral-500 mb-1">
                REQUESTS / SEC
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {guardianStatus?.requests_per_sec || 0}
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${threatLevel === "CRITICAL" ? "bg-red-500" : "bg-green-500"}`}
                  style={{
                    width: `${Math.min((guardianStatus?.requests_per_sec || 0) / 2, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Analysis */}
        <div className="col-span-1 lg:col-span-2">
          <TrafficGraph />
        </div>
      </div>

      {/* Middle Section: Connected Victim Nodes */}
      <div className="flex-1">
        <h2 className="text-sm font-bold text-neutral-500 mb-4 tracking-widest flex items-center gap-2">
          <Activity className="w-4 h-4" />
          NETWORK TOPOLOGY / VICTIM SIMULATION
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nodeList.map((node) => (
            <NodeCard key={node.id} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
