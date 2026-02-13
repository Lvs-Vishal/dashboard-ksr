"use client";

import React, { useEffect, useState } from "react";
import { useMqtt } from "@/context/MqttContext";
import { Shield, ShieldAlert, Wifi, WifiOff, Activity } from "lucide-react";
import { clsx } from "clsx";

export default function Header() {
  const { status, threatLevel, isGuardianNetwork } = useMqtt();
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            "flex items-center gap-2 font-bold tracking-widest text-xl",
            threatLevel === "CRITICAL"
              ? "text-red-500 animate-pulse"
              : "text-green-500",
          )}
        >
          {threatLevel === "CRITICAL" ? (
            <ShieldAlert className="w-8 h-8" />
          ) : (
            <Shield className="w-8 h-8" />
          )}
          <span>A.E.G.I.S.</span>
        </div>
        <div className="h-6 w-px bg-white/20 mx-2" />
        <span className="text-xs text-neutral-400 tracking-wider">
          ACTIVE DEFENSE SYSTEM
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Threat Level Indicator */}
        <div className="flex items-center gap-3 bg-white/5 px-4 py-1 rounded-full border border-white/10">
          <Activity
            className={clsx(
              "w-4 h-4",
              threatLevel === "CRITICAL" ? "text-red-500" : "text-green-500",
            )}
          />
          <span
            className={clsx(
              "text-sm font-mono font-bold",
              threatLevel === "CRITICAL"
                ? "text-red-500"
                : threatLevel === "HIGH"
                  ? "text-orange-500"
                  : "text-green-500",
            )}
          >
            THREAT: {threatLevel}
          </span>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {isGuardianNetwork ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-green-500">Connected with Guardian</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-red-500">Disconnected with Guardian</span>
            </>
          )}
        </div>

        {/* Clock */}
        <div className="text-xl font-mono text-white/80 w-24 text-right">
          {time}
        </div>
      </div>
    </header>
  );
}
