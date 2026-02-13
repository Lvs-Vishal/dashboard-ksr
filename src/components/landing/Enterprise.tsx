"use client";

import React from "react";
import { motion } from "framer-motion";
import { Lock, Scale, Activity, Layers, Code, Globe } from "lucide-react";

const features = [
  {
    title: "Security & Compliance",
    description:
      "Enterprise-grade RBAC, audit logs, and SOC2 compliant architecture out of the box.",
    icon: Lock,
    gradient:
      "from-[var(--color-neon-purple)]/20 to-[var(--color-neon-blue)]/20",
    border: "group-hover:border-[var(--color-neon-purple)]/50",
  },
  {
    title: "Horizontal Scalability",
    description:
      "Auto-scaling groups that handle millions of concurrent connections with <10ms overhead.",
    icon: Scale,
    gradient: "from-[var(--color-neon-cyan)]/20 to-[var(--color-neon-blue)]/20",
    border: "group-hover:border-[var(--color-neon-cyan)]/50",
  },
  {
    title: "Deep Observability",
    description:
      "Real-time metrics, distributed tracing, and log aggregation built into the core.",
    icon: Activity,
    gradient:
      "from-[var(--color-neon-green)]/20 to-[var(--color-neon-cyan)]/20",
    border: "group-hover:border-[var(--color-neon-green)]/50",
  },
];

export default function Enterprise() {
  return (
    <section
      id="enterprise"
      className="py-32 bg-[#050505] relative overflow-hidden"
    >
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[var(--color-neon-blue)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[var(--color-neon-cyan)] font-mono text-sm tracking-wider uppercase mb-4 block"
          >
            Enterprise Ready
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Built for Mission-Critical Loads
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            The reliability of a monolith with the agility of microservices.
            Engineered for teams that cannot afford downtime.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className={`group relative p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 ${feature.border}`}
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
