"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import mqtt from "mqtt";

export type ThreatLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface NodeStatus {
  id: string;
  name: string;
  type: "THERMOSTAT" | "DISPLAY" | "LIGHT";
  status: "ONLINE" | "OFFLINE" | "COMPROMISED";
  ip: string;
  lastSeen: number;
  data: Record<string, unknown>;
}

export interface GuardianStatus {
  requests_per_sec: number;
  total_attacks: number;
  last_event: string;
  uptime_sec: number;
  blocked_clients: string[];
}

interface MqttContextType {
  status: "CONNECTING" | "CONNECTED" | "DISCONNECTED" | "RECONNECTING";
  threatLevel: ThreatLevel;
  nodes: Record<string, NodeStatus>;
  trafficData: { time: string; packets: number; type: string }[];
  publish: (topic: string, message: string) => void;
  updateNodeIp: (id: string, ip: string) => void;
  resetSimulation: () => void;
  isGuardianNetwork: boolean;
  guardianStatus: GuardianStatus | null;
}

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const clientRef = useRef<mqtt.MqttClient | null>(null);
  const [status, setStatus] = useState<MqttContextType["status"]>("CONNECTING");
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>("LOW");
  const [guardianStatus, setGuardianStatus] = useState<GuardianStatus | null>(
    null,
  );

  const [nodes, setNodes] = useState<Record<string, NodeStatus>>({
    "node-a": {
      id: "node-a",
      name: "Smart Thermostat",
      type: "THERMOSTAT",
      status: "ONLINE",
      ip: "192.168.0.204",
      lastSeen: 0,
      data: { temp: 24, target: 24 },
    },
    "node-b": {
      id: "node-b",
      name: "Office Display",
      type: "DISPLAY",
      status: "ONLINE",
      ip: "192.168.0.119",
      lastSeen: 0,
      data: { msg: "Welcome" },
    },

    "node-d": {
      id: "node-d",
      name: "Desk Light",
      type: "LIGHT",
      status: "ONLINE",
      ip: "192.168.0.109",
      lastSeen: 0,
      data: { state: false },
    },
  });

  const [trafficData, setTrafficData] = useState<
    { time: string; packets: number; type: string }[]
  >([]);
  const [isGuardianNetwork, setIsGuardianNetwork] = useState(false);

  // Check if we are connected to the local Guardian network
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        // Try to fetch the welcome message device or gateway
        // Using no-cors opaque response check to avoid CORS errors but confirm reachability
        // 192.168.4.1 is the gateway
        await fetch("http://192.168.4.1", {
          mode: "no-cors",
          method: "HEAD",
          signal: AbortSignal.timeout(2000),
        });
        setIsGuardianNetwork(true);
      } catch (e) {
        setIsGuardianNetwork(false);
      }
    };

    // Check immediately and then every 10 seconds
    checkNetwork();
    const interval = setInterval(checkNetwork, 10000);
    return () => clearInterval(interval);
  }, []);

  // Poll for Guardian Status and setup SSE
  useEffect(() => {
    if (!isGuardianNetwork) return;

    // Polling for status snapshot
    const fetchStatus = async () => {
      try {
        // Use local proxy to avoid CORS issues
        const res = await fetch("/api/guardian/status");
        if (res.ok) {
          const data = await res.json();
          setGuardianStatus((prev) => ({ ...prev, ...data }));
        }
      } catch (e) {
        // Silent failure for polling
      }
    };

    // Poll for stats (traffic graph)
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/guardian/stats");
        if (res.ok) {
          const data = await res.json();
          // Calculate total packets per sec from all clients
          const totalPackets =
            data.clients?.reduce(
              (acc: number, client: any) => acc + (client.packetsPerSec || 0),
              0,
            ) || 0;

          // Find blocked clients
          const blockedClients = data.clients
            ?.filter((c: any) => c.blocked)
            .map((c: any) => c.ip);

          // Update Traffic Graph
          setTrafficData((prev) => {
            const timeStr = new Date().toLocaleTimeString();
            const newData = [
              ...prev,
              {
                time: timeStr,
                packets: totalPackets,
                type: "normal",
              },
            ];
            return newData.slice(-50);
          });

          // Update Guardian Status derived from stats
          setGuardianStatus((prev) => {
            const currentStatus = prev || {
              requests_per_sec: 0,
              total_attacks: 0,
              last_event: "Initializing...",
              uptime_sec: 0,
              blocked_clients: [],
            };

            const blocked = blockedClients || [];

            return {
              ...currentStatus,
              requests_per_sec: totalPackets,
              blocked_clients: blocked,
            };
          });

          // Update Threat Level
          if (blockedClients && blockedClients.length > 0) {
            setThreatLevel("CRITICAL");
          } else if (totalPackets > 100) {
            setThreatLevel("HIGH");
          } else if (totalPackets > 50) {
            setThreatLevel("MEDIUM");
          } else {
            setThreatLevel("LOW");
          }
        }
      } catch (e) {
        // Silent failure
      }
    };

    fetchStatus();
    fetchStats();

    // Status polling
    const statusInterval = setInterval(fetchStatus, 2000);
    // Stats polling (faster for graph smoothness)
    const statsInterval = setInterval(fetchStats, 1000);

    // Server-Sent Events for real-time events (attacks/blocks)
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout;

    const connectSSE = () => {
      try {
        // Use local proxy
        eventSource = new EventSource("/api/guardian/events");

        eventSource.onopen = () => {
          console.log("Connected to Guardian Event Stream");
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            // If SSE sends status updates, we can update status
            if (data.requests_per_sec !== undefined) {
              setGuardianStatus((prev) => ({ ...prev, ...data }));
            }

            if (
              data.total_attacks > 0 ||
              (data.blocked_clients && data.blocked_clients.length > 0)
            ) {
              setThreatLevel("HIGH");
            }
            if (data.total_attacks > 10) {
              setThreatLevel("CRITICAL");
            }
          } catch (e) {
            // Ignore parse errors from heartbeat or improper json
          }
        };

        eventSource.onerror = (e) => {
          // Silent retry on error
          console.log("SSE Reconnecting...");
          eventSource?.close();
          retryTimeout = setTimeout(connectSSE, 5000);
        };
      } catch (e) {
        console.error("Failed to establish SSE connection", e);
      }
    };

    connectSSE();

    return () => {
      clearInterval(statusInterval);
      clearInterval(statsInterval);
      eventSource?.close();
      clearTimeout(retryTimeout);
    };
  }, [isGuardianNetwork]);

  const handleMessage = useCallback((topic: string, payload: string) => {
    try {
      const data = JSON.parse(payload);

      if (topic === "aegis/stats") {
        setTrafficData((prev) => {
          const timeStr = new Date().toLocaleTimeString();
          const newData = [
            ...prev,
            { time: timeStr, packets: data.packet_rate, type: "normal" },
          ];
          return newData.slice(-50);
        });

        if (data.prob_attack > 0.8) {
          setThreatLevel("CRITICAL");
        } else if (data.prob_attack > 0.5) {
          setThreatLevel("HIGH");
        } else {
          setThreatLevel("LOW");
        }
      } else if (topic === "aegis/alerts") {
        setThreatLevel("CRITICAL");
      } else if (topic.startsWith("aegis/node/")) {
        // Handle node updates: aegis/node/<node-id>/set
        const parts = topic.split("/");
        if (parts.length >= 4 && parts[3] === "set") {
          const nodeId = parts[2];
          setNodes((prev) => {
            const node = prev[nodeId];
            if (!node) return prev;

            // Merge the new data into the existing data
            return {
              ...prev,
              [nodeId]: {
                ...node,
                data: { ...node.data, ...data },
              },
            };
          });
        }
      }
    } catch (e) {
      console.error("Failed to parse MQTT message", e);
    }
  }, []);

  useEffect(() => {
    console.log("Connecting to MQTT Broker...");
    const mqttClient = mqtt.connect("wss://broker.hivemq.com:8000/mqtt", {
      clientId: `aegis_dashboard_${Math.random().toString(16).substr(2, 8)}`,
      keepalive: 60,
    });

    mqttClient.on("connect", () => {
      console.log("Connected to MQTT Broker");
      setStatus("CONNECTED");
      mqttClient.subscribe("aegis/#", (err) => {
        if (!err) {
          console.log("Subscribed to aegis/#");
        }
      });
    });

    mqttClient.on("message", (topic, message) => {
      const payload = message.toString();
      handleMessage(topic, payload);
    });

    mqttClient.on("reconnect", () => {
      setStatus("RECONNECTING");
    });

    mqttClient.on("close", () => {
      setStatus("DISCONNECTED");
    });

    clientRef.current = mqttClient;

    return () => {
      mqttClient.end();
    };
  }, [handleMessage]);

  const publish = (topic: string, message: string) => {
    if (clientRef.current) {
      clientRef.current.publish(topic, message);
      // Optimistically update local state immediately
      // This ensures the UI reflects the change instantly, even before the broker round-trip
      // preventing "double-on" issues when toggling rapidly
      handleMessage(topic, message);
    }
  };

  const updateNodeIp = (id: string, ip: string) => {
    setNodes((prev) => ({
      ...prev,
      [id]: { ...prev[id], ip },
    }));
  };

  const resetSimulation = () => {
    publish("aegis/commands", JSON.stringify({ action: "RESET_ALL" }));
    setThreatLevel("LOW");
    setNodes((prev) => ({
      ...prev,
      "node-a": {
        ...prev["node-a"],
        status: "ONLINE",
        data: { temp: 24, target: 24 },
      },
      "node-b": {
        ...prev["node-b"],
        status: "ONLINE",
        data: { msg: "Welcome" },
      },
    }));
  };

  return (
    <MqttContext.Provider
      value={{
        status,
        threatLevel,
        nodes,
        trafficData,
        publish,
        updateNodeIp,
        resetSimulation,
        isGuardianNetwork,
        guardianStatus,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (context === undefined) {
    throw new Error("useMqtt must be used within a MqttProvider");
  }
  return context;
};
