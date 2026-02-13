"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-32 relative overflow-hidden flex items-center justify-center min-h-[60vh]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-neon-blue)]/20 via-transparent to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[var(--color-neon-cyan)]/10 to-transparent" />

        {/* Animated Grid Floor */}
        <div className="absolute bottom-0 inset-x-0 h-[400px] bg-[linear-gradient(transparent_1px,rgba(0,243,255,0.1)_2px),linear-gradient(90deg,transparent_1px,rgba(0,243,255,0.1)_2px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)_translateY(100px)] opacity-50 origin-bottom" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter"
        >
          Build Secure.
          <br />
          Deploy Fast.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-purple)]">
            Scale Without Limits.
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105 duration-200"
          >
            Start Building Now <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
