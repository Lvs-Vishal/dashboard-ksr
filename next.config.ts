import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/guardian/status",
        destination: "http://192.168.4.1/status",
      },
      {
        source: "/api/guardian/events",
        destination: "http://192.168.4.1/events",
      },

      {
        source: "/api/guardian/report",
        destination: "http://192.168.4.1/report",
      },
      {
        source: "/api/guardian/stats",
        destination: "http://192.168.4.1/stats",
      },
      {
        source: "/api/thermostat/state",
        destination: "http://192.168.4.160/",
      },
      {
        source: "/api/thermostat/set",
        destination: "http://192.168.4.160/set",
      },
    ];
  },
};

export default nextConfig;
