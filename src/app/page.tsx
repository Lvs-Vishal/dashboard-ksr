import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Metrics from "@/components/landing/Metrics";
import Architecture from "@/components/landing/Architecture";
import Enterprise from "@/components/landing/Enterprise";
import OpenSource from "@/components/landing/OpenSource";
import Developer from "@/components/landing/Developer";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen text-white overflow-x-hidden selection:bg-[var(--color-neon-blue)] selection:text-white">
      <Navbar />
      <Hero />
      <Metrics />
      <Architecture />
      <Enterprise />
      <OpenSource />
      <Developer />
      <CTA />
      <Footer />
    </main>
  );
}
