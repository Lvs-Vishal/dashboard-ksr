"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { useMqtt } from "@/context/MqttContext";
import { setWelcomeMessage } from "@/app/actions/iot";

interface WelcomeMessageControlProps {
  nodeId: string;
}

export default function WelcomeMessageControl({
  nodeId,
}: WelcomeMessageControlProps) {
  const { nodes, publish } = useMqtt();
  const node = nodes[nodeId];
  const [inputMsg, setInputMsg] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!node || node.type !== "DISPLAY") return null;

  const currentMsg = node.data.msg as string;
  const isVisible = currentMsg.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedMsg = inputMsg.trim();

    if (!trimmedMsg) {
      setError("Please enter a message");
      return;
    }

    if (trimmedMsg.includes(" ") || trimmedMsg.split(/\s+/).length > 1) {
      setError("Only one word allowed");
      return;
    }

    setIsUpdating(true);
    try {
      // Optimistic update via MQTT
      publish(`aegis/node/${nodeId}/set`, JSON.stringify({ msg: trimmedMsg }));
      // Server action
      await setWelcomeMessage(trimmedMsg);
      setInputMsg(""); // Clear input on success
    } catch (err) {
      console.error("Failed to update message", err);
      setError("Failed to update message");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-medium">Welcome Message</h3>
            <p className="text-zinc-500 text-sm">Office Display</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => {
              setError(null);
              setInputMsg(e.target.value);
            }}
            placeholder="Enter single word..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isUpdating || !inputMsg}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[40px]"
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>
        {error && <p className="text-red-400 text-xs mt-2 ml-1">{error}</p>}
      </div>

      <div className="relative overflow-hidden rounded-lg bg-black border border-zinc-800 h-24 flex items-center justify-center">
        {/* Simulated LED Display */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-size-[100%_4px,6px_100%]" />

        {isVisible ? (
          <span className="text-2xl font-mono text-blue-400 animate-pulse tracking-widest uppercase text-glow-blue break-all px-4 text-center">
            {currentMsg}
          </span>
        ) : (
          <span className="text-zinc-700 font-mono text-sm uppercase tracking-widest">
            Display Off
          </span>
        )}
      </div>
    </div>
  );
}
