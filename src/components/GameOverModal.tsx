"use client";

interface Props {
  playerName: string;
  score: number;
  level: number;
  lines: number;
  onRestart: () => void;
  onClose: () => void;
}

export default function GameOverModal({ playerName, score, level, lines, onRestart, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="neon-border rounded-xl theme-panel p-6 max-w-sm w-full text-center space-y-4">
        <h2 className="text-xl text-neon-red neon-text">GAME OVER</h2>
        <p className="text-xs text-gray-400">{playerName}</p>
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

        <p className="text-[9px] text-neon-green">Score saved automatically!</p>

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
