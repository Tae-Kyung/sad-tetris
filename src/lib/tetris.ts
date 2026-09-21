export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export type CellColor = string | null;
export type Board = CellColor[][];

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: string;
  shape: number[][];
  color: string;
  position: Position;
}

const PIECES: Record<string, { shape: number[][]; color: string }> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#00fff5",
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#0080ff",
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#ff6600",
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#ffff00",
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#39ff14",
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#ff00ff",
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#ff0040",
  },
};

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateBag(): string[] {
  return shuffleArray(Object.keys(PIECES));
}

export function createPiece(type: string): Piece {
  const def = PIECES[type];
  return {
    type,
    shape: def.shape.map((row) => [...row]),
    color: def.color,
    position: {
      x: Math.floor((BOARD_WIDTH - def.shape[0].length) / 2),
      y: 0,
    },
  };
}

export function rotatePiece(piece: Piece, direction: 1 | -1 = 1): Piece {
  if (piece.type === "O") return piece;
  const n = piece.shape.length;
  const rotated: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (direction === 1) {
        rotated[c][n - 1 - r] = piece.shape[r][c];
      } else {
        rotated[n - 1 - c][r] = piece.shape[r][c];
      }
    }
  }
  return { ...piece, shape: rotated };
}

export function isValidPosition(board: Board, piece: Piece): boolean {
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const x = piece.position.x + c;
      const y = piece.position.y + r;
      if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return false;
      if (y < 0) continue;
      if (board[y][x] !== null) return false;
    }
  }
  return true;
}

export function placePiece(board: Board, piece: Piece): Board {
  const newBoard = board.map((row) => [...row]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const x = piece.position.x + c;
      const y = piece.position.y + r;
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        newBoard[y][x] = piece.color;
      }
    }
  }
  return newBoard;
}

export function clearLines(board: Board): { board: Board; linesCleared: number } {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = BOARD_HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: linesCleared }, () =>
    Array(BOARD_WIDTH).fill(null)
  );
  return { board: [...emptyRows, ...remaining], linesCleared };
}

export function getGhostPosition(board: Board, piece: Piece): Position {
  let ghostY = piece.position.y;
  while (
    isValidPosition(board, {
      ...piece,
      position: { ...piece.position, y: ghostY + 1 },
    })
  ) {
    ghostY++;
  }
  return { x: piece.position.x, y: ghostY };
}

export function calculateScore(linesCleared: number, level: number, combo: number): number {
  const baseScores: Record<number, number> = { 1: 100, 2: 300, 3: 500, 4: 800 };
  const base = baseScores[linesCleared] || 0;
  return base * level + combo * 50 * level;
}

export function getDropInterval(level: number): number {
  return Math.max(100, 1000 - (level - 1) * 80);
}

export function tryWallKick(board: Board, piece: Piece, rotated: Piece): Piece | null {
  const kicks = [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ];
  for (const kick of kicks) {
    const kicked = {
      ...rotated,
      position: {
        x: piece.position.x + kick.x,
        y: piece.position.y + kick.y,
      },
    };
    if (isValidPosition(board, kicked)) return kicked;
  }
  return null;
}
