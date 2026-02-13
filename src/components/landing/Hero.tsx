"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Box, Shield, Zap } from "lucide-react";
import Link from "next/link";

function FloatingParticle({
  delay,
  x,
  y,
}: {
  delay: number;
  x: string;
  y: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.5, 1],
        x: [0, 20, 0],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{ left: x, top: y }}
      className="absolute w-2 h-2 rounded-full bg-[var(--color-neon-cyan)] blur-sm"
    />
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[var(--color-dark-bg)]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-neon-purple)] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-neon-blue)] rounded-full mix-blend-screen filter blur-[150px] opacity-20" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--color-neon-cyan)] rounded-full mix-blend-screen filter blur-[180px] opacity-10" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <FloatingParticle delay={0} x="10%" y="20%" />
        <FloatingParticle delay={2} x="80%" y="15%" />
        <FloatingParticle delay={1} x="15%" y="80%" />
        <FloatingParticle delay={3} x="85%" y="75%" />
        <FloatingParticle delay={1.5} x="50%" y="50%" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 hover:bg-white/10 transition-colors cursor-pointer group"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-neon-green)] shadow-[0_0_10px_var(--color-neon-green)] animate-pulse" />
          <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">
            v2.0 Enterprise Edition is Live
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight"
        >
          Autonomous Infrastructure <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-blue)] relative">
            for Intelligent Systems
            <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-blue)] opacity-20 -z-10" />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Open source enterprise-grade infrastructure built for scale. Deploy
          mission-critical applications with built-in security, observability,
          and zero-downtime updates.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20"
        >
          <Link
            href="/dashboard"
            className="w-full md:w-auto px-8 py-4 bg-[var(--color-neon-blue)] hover:bg-[var(--color-neon-blue)]/90 text-white rounded-lg font-bold text-lg shadow-[0_0_20px_rgba(0,102,255,0.4)] hover:shadow-[0_0_30px_rgba(0,102,255,0.6)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Deploy Now <Zap className="w-5 h-5 fill-current" />
          </Link>
          <Link
            href="#architecture"
            className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white rounded-lg font-bold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            View Architecture <Box className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Shield,
              title: "Security First",
              desc: "Zero-trust architecture with automated policy enforcement.",
              color: "var(--color-neon-purple)",
            },
            {
              icon: Zap,
              title: "High Performance",
              desc: "<5ms latency processing for real-time edge workloads.",
              color: "var(--color-neon-cyan)",
            },
            {
              icon: Box,
              title: "Modular Core",
              desc: "Composable infrastructure that adapts to your stack.",
              color: "var(--color-neon-blue)",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors backdrop-blur-sm group"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon
                  className="w-6 h-6"
                  style={{ color: feature.color }}
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
