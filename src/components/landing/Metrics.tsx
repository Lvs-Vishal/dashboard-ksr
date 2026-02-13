"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const MetricCard = ({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  color: string;
}) => {
  return (
    <div className="flex flex-col p-6 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
      <span className="text-gray-400 text-sm font-mono mb-2">{label}</span>
      <div className="flex items-baseline gap-2">
        <span
          className="text-3xl font-bold text-white tracking-tight"
          style={{ textShadow: `0 0 20px ${color}40` }}
        >
          {value}
        </span>
        <span className="text-[var(--color-neon-cyan)] text-sm">{unit}</span>
      </div>
    </div>
  );
};

export default function Metrics() {
  const [throughput, setThroughput] = useState(8420);
  const [latency, setLatency] = useState(14);
  const pathControls = useAnimation();

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setThroughput((prev) => prev + Math.floor(Math.random() * 100 - 50));
      setLatency((prev) =>
        Math.max(4, Math.min(25, prev + Math.floor(Math.random() * 4 - 2))),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-1/2">
            <MetricCard
              label="Active Nodes"
              value="12,408"
              unit="connected"
              color="var(--color-neon-blue)"
            />
            <MetricCard
              label="Throughput"
              value={throughput.toLocaleString()}
              unit="req/s"
              color="var(--color-neon-cyan)"
            />
            <MetricCard
              label="Global Latency"
              value={`${latency}ms`}
              unit="avg"
              color="var(--color-neon-purple)"
            />
            <MetricCard
              label="Uptime"
              value="99.999"
              unit="%"
              color="var(--color-neon-green)"
            />
          </div>

          {/* Live Graph Simulation */}
          <div className="w-full lg:w-1/2 bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono text-gray-400">
                  LIVE FEED
                </span>
              </div>
              <span className="text-xs font-mono text-[var(--color-neon-blue)]">
                ETH-MAINNET-04
              </span>
            </div>

            {/* Simulated Git Graph / Network Activity */}
            <div className="flex-1 flex items-end gap-1 relative z-10">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-[var(--color-neon-blue)]/50 to-[var(--color-neon-cyan)]"
                  animate={{
                    height: [
                      `${20 + Math.random() * 40}%`,
                      `${30 + Math.random() * 60}%`,
                      `${20 + Math.random() * 40}%`,
                    ],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    opacity: 0.3 + (i / 40) * 0.7, // Fade in from left
                    borderTopRightRadius: 2,
                    borderTopLeftRadius: 2,
                  }}
                />
              ))}
            </div>

            {/* Grid Background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(transparent_19px,rgba(255,255,255,0.05)_20px)] bg-[size:100%_20px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
