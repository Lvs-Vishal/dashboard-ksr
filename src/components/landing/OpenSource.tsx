"use client";

import React from "react";
import { motion } from "framer-motion";
import { Circle, CheckCircle2 } from "lucide-react";

export default function OpenSource() {
  return (
    <section className="py-32 bg-[var(--color-dark-surface)] relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl leading-normal font-bold text-white mb-8"
            >
              Open Core.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                Community Driven.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-8 leading-relaxed"
            >
              You’re not just buying software. You’re adopting infrastructure
              that evolves with the industry. Audit the code, contribute to the
              core, and extend it to fit your needs.
            </motion.p>

            <div className="space-y-4">
              {[
                "MIT Licensed Core Engine",
                "Transparent Roadmap",
                "Vendor-Agnostic Integrations",
                "Self-Hosted or Managed Cloud",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-neon-green)]" />
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-purple)] rounded-full blur-[100px] opacity-20" />
            <div className="relative bg-[#050505] border border-white/10 rounded-2xl p-1">
              <div className="bg-[#0A0A0A] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-xs font-mono text-gray-500">
                    core/engine.rs
                  </div>
                </div>
                <div className="p-6 font-mono text-sm overflow-x-hidden">
                  <div className="text-gray-500 mb-2">
                    // The heart of the system. 100% Open Source.
                  </div>
                  <div className="text-[var(--color-neon-purple)]">
                    impl<span className="text-white"> CoreEngine</span> {"{"}
                  </div>
                  <div className="pl-4 text-white">
                    <span className="text-[var(--color-neon-blue)]">
                      pub fn
                    </span>{" "}
                    <span className="text-[var(--color-neon-cyan)]">init</span>
                    () {"{"}
                  </div>
                  <div className="pl-8 text-gray-400">
                    log::info!(
                    <span className="text-green-400">
                      "System initializing..."
                    </span>
                    );
                  </div>
                  <div className="pl-8 text-gray-400">
                    <span className="text-[var(--color-neon-blue)]">let</span>{" "}
                    registry = Registry::new();
                  </div>
                  <div className="pl-8 text-gray-400">
                    registry.load_modules().await?;
                  </div>
                  <div className="pl-4 text-white">{"}"}</div>
                  <div className="pl-4 text-white mt-2">
                    <span className="text-[var(--color-neon-blue)]">
                      pub async fn
                    </span>{" "}
                    <span className="text-[var(--color-neon-cyan)]">
                      process_stream
                    </span>
                    (stream: Stream) {"{"}
                  </div>
                  <div className="pl-8 text-gray-400">
                    <span className="text-gray-500">
                      // Optimized zero-copy processing
                    </span>
                  </div>
                  <div className="pl-8 text-gray-400">
                    stream.for_each_concurrent(None, |msg|{" "}
                    <span className="text-[var(--color-neon-blue)]">
                      async move
                    </span>{" "}
                    {"{"}
                  </div>
                  <div className="pl-12 text-gray-400">
                    self.router.dispatch(msg).await;
                  </div>
                  <div className="pl-8 text-gray-400">{"}"}).await;</div>
                  <div className="pl-4 text-white">{"}"}</div>
                  <div className="text-white">{"}"}</div>
                </div>
              </div>
            </div>

            {/* Github star badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-6 -right-6 bg-white text-black font-bold px-6 py-3 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-2"
            >
              <span>★ 12k+ Stars on GitHub</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
