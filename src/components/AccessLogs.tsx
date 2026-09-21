"use client";

import { useState, useEffect } from "react";
import { Monitor, RefreshCw } from "lucide-react";
import { getAccessLogs, AccessLog, isSupabaseConfigured } from "@/lib/supabase";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shortenUA(ua: string) {
  if (!ua) return "Unknown";
  if (ua.includes("Mobile")) {
    const match = ua.match(/(iPhone|Android[\s\d.]*)/);
    return match ? match[1] : "Mobile";
  }
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Browser";
}

export default function AccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAccessLogs();
      setLogs(data);
    } catch {
      console.error("Failed to fetch access logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) fetchLogs();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="neon-border rounded-lg p-4 bg-gray-950/80">
        <div className="text-[10px] text-neon-yellow text-center">
          Supabase not configured.
        </div>
      </div>
    );
  }

  return (
    <div className="neon-border rounded-lg p-4 bg-gray-950/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Monitor size={14} className="text-neon-green" />
          <span className="text-[10px] sm:text-xs text-neon-cyan neon-text">
            VISITORS ({logs.length})
          </span>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="text-neon-cyan hover:text-white transition"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="text-[9px] text-gray-500 text-center py-4">No visitors yet</p>
      ) : (
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className="text-[8px] sm:text-[9px] py-1.5 border-b border-gray-800/50 space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-neon-cyan">{log.ip_address}</span>
                <span className="text-gray-600">{formatDate(log.created_at)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>{shortenUA(log.user_agent)}</span>
                <span>
                  {log.screen_width}x{log.screen_height}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
