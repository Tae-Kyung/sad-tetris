"use client";

import { useState, useEffect } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import { getTopScores, GameRecord, isSupabaseConfigured } from "@/lib/supabase";

export default function Leaderboard() {
  const [scores, setScores] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const data = await getTopScores();
      setScores(data);
    } catch {
      console.error("Failed to fetch scores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) fetchScores();
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="neon-border rounded-lg p-4 theme-panel">
        <div className="text-[10px] text-neon-yellow text-center">
          Supabase not configured.
          <br />
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
        </div>
      </div>
    );
  }

  return (
    <div className="neon-border rounded-lg p-4 theme-panel">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy size={14} className="text-neon-yellow" />
          <span className="text-[10px] sm:text-xs text-neon-cyan neon-text">TOP 10</span>
        </div>
        <button
          onClick={fetchScores}
          disabled={loading}
          className="text-neon-cyan hover:text-white transition"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {scores.length === 0 ? (
        <p className="text-[9px] text-gray-500 text-center py-4">No scores yet</p>
      ) : (
        <div className="space-y-1 max-h-[300px] overflow-y-auto">
          {scores.map((s, i) => (
            <div
              key={s.id}
              className="flex items-center text-[8px] sm:text-[9px] py-1 border-b border-gray-800/50"
            >
              <span
                className={`w-5 font-bold ${
                  i === 0
                    ? "text-neon-yellow"
                    : i === 1
                    ? "text-gray-300"
                    : i === 2
                    ? "text-orange-400"
                    : "text-gray-500"
                }`}
              >
                {i + 1}
              </span>
              <span className="flex-1 truncate text-gray-300 ml-1">{s.player_name}</span>
              <span className="text-neon-yellow ml-2">{s.score.toLocaleString()}</span>
              <span className="text-gray-600 ml-2">Lv{s.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
