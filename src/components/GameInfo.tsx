"use client";

interface Props {
  score: number;
  level: number;
  lines: number;
}

export default function GameInfo({ score, level, lines }: Props) {
  return (
    <div className="neon-border rounded-lg p-3 bg-gray-950/80 space-y-3">
      <div>
        <div className="text-[8px] sm:text-[10px] text-neon-cyan neon-text">SCORE</div>
        <div className="text-sm sm:text-lg text-neon-yellow neon-text font-bold">
          {score.toLocaleString()}
        </div>
      </div>
      <div>
        <div className="text-[8px] sm:text-[10px] text-neon-cyan neon-text">LEVEL</div>
        <div className="text-sm sm:text-lg text-neon-green neon-text font-bold">{level}</div>
      </div>
      <div>
        <div className="text-[8px] sm:text-[10px] text-neon-cyan neon-text">LINES</div>
        <div className="text-sm sm:text-lg text-neon-pink neon-text font-bold">{lines}</div>
      </div>
    </div>
  );
}
