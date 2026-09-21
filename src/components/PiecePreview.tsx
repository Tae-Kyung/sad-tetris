"use client";

import { createPiece } from "@/lib/tetris";

interface Props {
  type: string | null;
  label: string;
}

export default function PiecePreview({ type, label }: Props) {
  const piece = type ? createPiece(type) : null;

  return (
    <div className="neon-border rounded-lg p-3 theme-panel">
      <div className="text-[8px] sm:text-[10px] text-neon-cyan mb-2 neon-text text-center">
        {label}
      </div>
      <div className="flex justify-center items-center min-h-[48px]">
        {piece ? (
          <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}>
            {piece.shape.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className="rounded-sm"
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: cell ? piece.color : "transparent",
                    border: cell ? "1px solid var(--cell-filled-border)" : "none",
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <div className="text-[8px] theme-text-muted">EMPTY</div>
        )}
      </div>
    </div>
  );
}
