"use client";

import { Board, Piece, Position, BOARD_WIDTH, BOARD_HEIGHT } from "@/lib/tetris";

interface Props {
  board: Board;
  currentPiece: Piece | null;
  ghostPosition: Position | null;
}

export default function TetrisBoard({ board, currentPiece, ghostPosition }: Props) {
  const getCellColor = (row: number, col: number): string | null => {
    if (board[row][col]) return board[row][col];

    if (currentPiece) {
      const pr = row - currentPiece.position.y;
      const pc = col - currentPiece.position.x;
      if (
        pr >= 0 &&
        pr < currentPiece.shape.length &&
        pc >= 0 &&
        pc < currentPiece.shape[0].length &&
        currentPiece.shape[pr][pc]
      ) {
        return currentPiece.color;
      }
    }
    return null;
  };

  const isGhost = (row: number, col: number): boolean => {
    if (!currentPiece || !ghostPosition) return false;
    if (ghostPosition.y === currentPiece.position.y) return false;
    const pr = row - ghostPosition.y;
    const pc = col - currentPiece.position.x;
    if (
      pr >= 0 &&
      pr < currentPiece.shape.length &&
      pc >= 0 &&
      pc < currentPiece.shape[0].length &&
      currentPiece.shape[pr][pc]
    ) {
      if (!getCellColor(row, col)) return true;
    }
    return false;
  };

  return (
    <div className="neon-border rounded-lg p-1 bg-gray-950/80">
      <div
        className="grid gap-[1px]"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        }}
      >
        {Array.from({ length: BOARD_HEIGHT }).map((_, row) =>
          Array.from({ length: BOARD_WIDTH }).map((_, col) => {
            const color = getCellColor(row, col);
            const ghost = isGhost(row, col);
            return (
              <div
                key={`${row}-${col}`}
                className="aspect-square rounded-sm cell-glow"
                style={{
                  width: "clamp(16px, 3.5vw, 28px)",
                  backgroundColor: color
                    ? color
                    : ghost
                    ? `${currentPiece?.color}30`
                    : "#111127",
                  border: ghost
                    ? `1px dashed ${currentPiece?.color}60`
                    : color
                    ? "1px solid rgba(255,255,255,0.15)"
                    : "1px solid #1a1a3a",
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
