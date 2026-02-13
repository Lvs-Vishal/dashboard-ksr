"use client";

import React from "react";
import { useMqtt } from "@/context/MqttContext";
import { clsx } from "clsx";
import ThreatAlert from "./ThreatAlert";

export default function ThemedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { threatLevel } = useMqtt();
  const isCritical = threatLevel === "CRITICAL" || threatLevel === "HIGH";

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col relative overflow-hidden transition-colors duration-1000",
        isCritical
          ? "threat-critical shadow-[inset_0_0_100px_rgba(255,0,0,0.2)]"
          : "threat-low",
      )}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black pointer-events-none z-0 fixed-bg transition-colors duration-1000" />
      <div className="scanline" />

      <ThreatAlert />

      {children}
    </div>
  );
}
