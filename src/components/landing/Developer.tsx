"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";

const codeSnippet = `
// 1. Install the CLI
$ curl -sL https://get.aegis.dev | bash

// 2. Initialize your node
$ aegis init --role=controller

// 3. Deploy your first mesh
$ aegis deploy mesh.config.yaml

> Mesh deployed successfully!
> Active Nodes: 12
> Latency: 4ms
`;

export default function Developer() {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(codeSnippet.slice(0, i));
      i++;
      if (i > codeSnippet.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="py-32 bg-[#050505] relative">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Developer First.{" "}
            <span className="text-[var(--color-neon-blue)]">Always.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Built by engineers, for engineers. comprehensive CLI, fully typed
            SDKs, and documentation that actually makes sense.
          </p>
        </div>

        {/* Terminal Window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-3xl rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl shadow-[var(--color-neon-blue)]/10"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
              <Terminal className="w-3 h-3" />
              <span>bash — 80x24</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-white transition-colors"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono text-sm md:text-base overflow-x-auto">
            <pre className="text-gray-300">
              {displayedCode}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 H-4 bg-[var(--color-neon-cyan)] align-middle ml-1"
              >
                &nbsp;
              </motion.span>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
