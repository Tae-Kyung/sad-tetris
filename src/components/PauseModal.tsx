"use client";

interface Props {
  onResume: () => void;
}

export default function PauseModal({ onResume }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="neon-border rounded-xl theme-panel p-8 text-center space-y-4">
        <h2 className="text-xl text-neon-yellow neon-text animate-pulse-neon">PAUSED</h2>
        <p className="text-[10px] text-gray-400">Press ESC or P to resume</p>
        <button
          onClick={onResume}
          className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded px-6 py-2 text-xs hover:bg-neon-cyan/30 transition"
        >
          RESUME
        </button>
      </div>
    </div>
  );
}
