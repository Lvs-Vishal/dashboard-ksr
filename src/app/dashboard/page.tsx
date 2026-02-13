"use client";

import { toggleDeskLight } from "@/app/actions/iot";
import Thermostat from "@/components/iot/Thermostat";
import LightControl from "@/components/iot/LightControl";
import WelcomeMessageControl from "@/components/iot/WelcomeMessageControl";

export default function Home() {
  return (
    <div className="h-full flex flex-col gap-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          IoT Control Center
        </h1>
        <p className="text-zinc-500">Manage your connected devices</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Thermostat */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2">
          <h2 className="text-lg font-medium text-white mb-4">
            Climate Control
          </h2>
          <Thermostat nodeId="node-a" />
        </div>

        {/* 2. Welcome Message */}
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-lg font-medium text-white mb-4">
            Display System
          </h2>
          <WelcomeMessageControl nodeId="node-b" />
        </div>

        {/* 4. 2nd Light */}
        <div className="col-span-1">
          <h2 className="text-lg font-medium text-white mb-4">Workspace</h2>
          <LightControl
            nodeId="node-d"
            label="Desk Light"
            onToggle={async (state) => {
              await toggleDeskLight(state);
            }}
          />
        </div>
      </div>

      {/* System Status Summary */}
      <div className="mt-8 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-zinc-400">All systems operational</span>
        </div>
      </div>
    </div>
  );
}
