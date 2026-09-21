"use client";

import { useState } from "react";
import { saveGameRecord } from "@/lib/supabase";

interface Props {
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
  onClose: () => void;
}

export default function GameOverModal({ score, level, lines, onRestart, onClose }: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await saveGameRecord({
        player_name: name.trim(),
        score,
        level,
        lines_cleared: lines,
      });
      setSaved(true);
    } catch {
      alert("Failed to save score. Check Supabase config.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="neon-border rounded-xl bg-gray-950 p-6 max-w-sm w-full text-center space-y-4">
        <h2 className="text-xl text-neon-red neon-text">GAME OVER</h2>
        <div className="space-y-1 text-xs">
          <p>
            SCORE: <span className="text-neon-yellow">{score.toLocaleString()}</span>
          </p>
          <p>
            LEVEL: <span className="text-neon-green">{level}</span>
          </p>
          <p>
            LINES: <span className="text-neon-pink">{lines}</span>
          </p>
        </div>

        {!saved ? (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full bg-gray-900 border border-neon-cyan/30 rounded px-3 py-2 text-xs text-center focus:outline-none focus:border-neon-cyan"
            />
            <button
              onClick={handleSave}
              disabled={!name.trim() || saving}
              className="w-full bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded py-2 text-xs hover:bg-neon-cyan/30 disabled:opacity-40 transition"
            >
              {saving ? "SAVING..." : "SAVE SCORE"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-neon-green">Score saved!</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={onRestart}
            className="flex-1 bg-neon-green/20 border border-neon-green text-neon-green rounded py-2 text-xs hover:bg-neon-green/30 transition"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 border border-gray-600 text-gray-400 rounded py-2 text-xs hover:bg-gray-700 transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
