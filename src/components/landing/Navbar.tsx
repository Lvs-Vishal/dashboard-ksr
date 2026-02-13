"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Github, Menu, X, ChevronRight } from "lucide-react";
import clsx from "clsx";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Architecture", href: "#architecture" },
    { name: "Enterprise", href: "#enterprise" },
    { name: "Docs", href: "/docs" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-[#050505]/80 backdrop-blur-md border-white/10 py-4"
          : "bg-transparent border-transparent py-6",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[var(--color-neon-cyan)] to-[var(--color-neon-blue)] flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm group-hover:scale-90 transition-transform" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            AEGIS
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-[var(--color-neon-cyan)] transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com/aegis-core"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <Link
            href="/dashboard"
            className="group relative px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Deploy Now{" "}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-neon-blue)]/20 to-[var(--color-neon-cyan)]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden bg-[#050505] border-b border-white/10"
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-gray-400 hover:text-[var(--color-neon-cyan)]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link
              href="/dashboard"
              className="w-full py-3 bg-[var(--color-neon-blue)] text-white font-bold text-center rounded-lg"
            >
              Deploy Now
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
