import type { Metadata } from "next";
import "./globals.css";
import { MqttProvider } from "@/context/MqttContext";
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "A.E.G.I.S. | Active Defense System",
  description: "Autonomous Edge Guard for IoT Security",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <MqttProvider>
          <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-black to-black pointer-events-none z-0" />
            <div className="scanline" />

            <Header />

            <div className="flex flex-1 relative z-10">
              <Sidebar />
              <main className="flex-1 ml-64 p-8 overflow-y-auto h-[calc(100vh-64px)]">
                {children}
              </main>
            </div>
          </div>
        </MqttProvider>
      </body>
    </html>
  );
}
