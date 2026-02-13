import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[var(--color-neon-cyan)] to-[var(--color-neon-blue)]" />
            <span className="text-xl font-bold text-white tracking-tight">
              AEGIS
            </span>
          </div>

          <div className="flex gap-8 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              API
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Status
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Legal
            </Link>
          </div>

          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; 2026 Aegis Infrastructure. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
