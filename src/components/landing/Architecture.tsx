"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Server, Globe, ShieldCheck } from "lucide-react";
import clsx from "clsx";

const layers = [
  {
    id: "nodes",
    title: "Distributed Nodes",
    icon: Globe,
    desc: "Global edge network handling interactions.",
    color: "var(--color-neon-blue)",
  },
  {
    id: "core",
    title: "Core Engine",
    icon: Server,
    desc: "High-throughput transaction processing.",
    color: "var(--color-neon-cyan)",
  },
  {
    id: "intel",
    title: "Intelligence Layer",
    icon: Cpu,
    desc: "Real-time AI optimization and analytics.",
    color: "var(--color-neon-purple)",
  },
  {
    id: "security",
    title: "Control Interface",
    icon: ShieldCheck,
    desc: "Governance, policy, and compliance.",
    color: "var(--color-neon-green)",
  },
];

export default function Architecture() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <section
      id="architecture"
      className="py-24 bg-[var(--color-dark-surface)] relative"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            System Architecture
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A modular, layered approach to autonomous infrastructure. Designed
            for fault tolerance and horizontal scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Interactive Graphic */}
          <div className="relative flex flex-col gap-4 items-center justify-center py-8">
            {layers.map((layer, index) => (
              <React.Fragment key={layer.id}>
                <motion.div
                  onMouseEnter={() => setActiveLayer(layer.id)}
                  onMouseLeave={() => setActiveLayer(null)}
                  className={clsx(
                    "w-64 p-4 rounded-xl border transition-all duration-300 cursor-pointer relative z-10",
                    activeLayer === layer.id
                      ? "bg-white/10 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-105"
                      : "bg-[#0A0A0A] border-white/10 hover:border-white/20",
                  )}
                  style={{
                    // 3D Tilt effect
                    transform: `perspective(1000px) rotateX(${activeLayer === layer.id ? 0 : 5}deg) scale(${activeLayer === layer.id ? 1.05 : 1})`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${layer.color}20` }}
                    >
                      <layer.icon
                        className="w-5 h-5"
                        style={{ color: layer.color }}
                      />
                    </div>
                    <span className="font-bold text-white">{layer.title}</span>
                  </div>
                </motion.div>

                {index < layers.length - 1 && (
                  <div className="h-8 w-px bg-gradient-to-b from-white/20 to-white/5" />
                )}
              </React.Fragment>
            ))}

            {/* Connecting lines background effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-neon-blue)]/30 to-transparent" />
            </div>
          </div>

          {/* Details Panel */}
          <div className="h-[300px] relative">
            <AnimatePresence mode="wait">
              {activeLayer ? (
                (() => {
                  const layer = layers.find((l) => l.id === activeLayer)!;
                  return (
                    <motion.div
                      key={activeLayer}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md h-full flex flex-col justify-center"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${layer.color}20` }}
                      >
                        <layer.icon
                          className="w-8 h-8"
                          style={{ color: layer.color }}
                        />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">
                        {layer.title}
                      </h3>
                      <p className="text-xl text-gray-300 mb-6">{layer.desc}</p>

                      <div className="flex gap-2">
                        <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-gray-400">
                          RUST
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-gray-400">
                          gRPC
                        </div>
                        <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-mono text-gray-400">
                          WASM
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center text-gray-500 font-mono text-sm border border-white/5 rounded-2xl border-dashed"
                >
                  HOVER OVER A LAYER TO INSPECT
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
