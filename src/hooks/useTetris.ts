"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Board,
  Piece,
  createEmptyBoard,
  generateBag,
  createPiece,
  rotatePiece,
  isValidPosition,
  placePiece,
  clearLines,
  getGhostPosition,
  calculateScore,
  getDropInterval,
  tryWallKick,
} from "@/lib/tetris";

export type GameState = "idle" | "playing" | "paused" | "gameover";

function nextFromBag(bag: string[]): { type: string; remaining: string[] } {
  let b = bag;
  if (b.length === 0) b = generateBag();
  return { type: b[0], remaining: b.slice(1) };
}

export function useTetris() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPieces, setNextPieces] = useState<string[]>([]);
  const [holdPiece, setHoldPiece] = useState<string | null>(null);
  const [canHold, setCanHold] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameState, setGameState] = useState<GameState>("idle");
  const dropTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const bagRef = useRef<string[]>([]);

  const clearTimer = useCallback(() => {
    if (dropTimer.current) {
      clearInterval(dropTimer.current);
      dropTimer.current = null;
    }
  }, []);

  const spawnPiece = useCallback(
    (boardState: Board): { piece: Piece; queue: string[] } | null => {
      let bag = bagRef.current;
      if (bag.length < 4) bag = [...bag, ...generateBag()];

      const type = bag[0];
      const remaining = bag.slice(1);
      const piece = createPiece(type);

      if (!isValidPosition(boardState, piece)) {
        bagRef.current = remaining;
        return null;
      }

      bagRef.current = remaining;
      return { piece, queue: remaining.slice(0, 3) };
    },
    []
  );

  const lockPiece = useCallback(() => {
    setCurrentPiece((prev) => {
      if (!prev) return null;

      setBoard((prevBoard) => {
        const newBoard = placePiece(prevBoard, prev);
        const { board: clearedBoard, linesCleared } = clearLines(newBoard);

        if (linesCleared > 0) {
          setCombo((c) => {
            const newCombo = c + 1;
            setScore((s) => s + calculateScore(linesCleared, level, newCombo));
            return newCombo;
          });
          setLines((l) => {
            const newLines = l + linesCleared;
            setLevel(Math.floor(newLines / 10) + 1);
            return newLines;
          });
        } else {
          setCombo(0);
        }

        const result = spawnPiece(clearedBoard);
        if (!result) {
          setGameState("gameover");
          clearTimer();
          setCurrentPiece(null);
        } else {
          setCurrentPiece(result.piece);
          setNextPieces(result.queue);
          setCanHold(true);
        }

        return clearedBoard;
      });

      return prev;
    });
  }, [level, spawnPiece, clearTimer]);

  const startGame = useCallback(() => {
    const emptyBoard = createEmptyBoard();
    bagRef.current = [...generateBag(), ...generateBag()];
    setBoard(emptyBoard);
    setScore(0);
    setLevel(1);
    setLines(0);
    setCombo(0);
    setHoldPiece(null);
    setCanHold(true);
    setGameState("playing");

    const result = spawnPiece(emptyBoard);
    if (result) {
      setCurrentPiece(result.piece);
      setNextPieces(result.queue);
    }
  }, [spawnPiece]);

  const moveLeft = useCallback(() => {
    setCurrentPiece((prev) => {
      if (!prev) return prev;
      const moved = { ...prev, position: { ...prev.position, x: prev.position.x - 1 } };
      return isValidPosition(board, moved) ? moved : prev;
    });
  }, [board]);

  const moveRight = useCallback(() => {
    setCurrentPiece((prev) => {
      if (!prev) return prev;
      const moved = { ...prev, position: { ...prev.position, x: prev.position.x + 1 } };
      return isValidPosition(board, moved) ? moved : prev;
    });
  }, [board]);

  const moveDown = useCallback((): boolean => {
    let locked = false;
    setCurrentPiece((prev) => {
      if (!prev) return prev;
      const moved = { ...prev, position: { ...prev.position, y: prev.position.y + 1 } };
      if (isValidPosition(board, moved)) return moved;
      locked = true;
      return prev;
    });
    if (locked) lockPiece();
    return !locked;
  }, [board, lockPiece]);

  const hardDrop = useCallback(() => {
    setCurrentPiece((prev) => {
      if (!prev) return prev;
      const ghost = getGhostPosition(board, prev);
      const dropDistance = ghost.y - prev.position.y;
      setScore((s) => s + dropDistance * 2);
      return { ...prev, position: ghost };
    });
    setTimeout(() => lockPiece(), 0);
  }, [board, lockPiece]);

  const rotate = useCallback(
    (dir: 1 | -1 = 1) => {
      setCurrentPiece((prev) => {
        if (!prev) return prev;
        const rotated = rotatePiece(prev, dir);
        if (isValidPosition(board, { ...rotated, position: prev.position })) {
          return { ...rotated, position: prev.position };
        }
        const kicked = tryWallKick(board, prev, rotated);
        return kicked || prev;
      });
    },
    [board]
  );

  const hold = useCallback(() => {
    if (!canHold || !currentPiece) return;
    setCanHold(false);
    const currentType = currentPiece.type;

    if (holdPiece) {
      const newPiece = createPiece(holdPiece);
      if (isValidPosition(board, newPiece)) {
        setCurrentPiece(newPiece);
        setHoldPiece(currentType);
      }
    } else {
      setHoldPiece(currentType);
      const result = spawnPiece(board);
      if (result) {
        setCurrentPiece(result.piece);
        setNextPieces(result.queue);
      }
    }
  }, [canHold, currentPiece, holdPiece, board, spawnPiece]);

  const togglePause = useCallback(() => {
    if (gameState === "playing") {
      setGameState("paused");
      clearTimer();
    } else if (gameState === "paused") {
      setGameState("playing");
    }
  }, [gameState, clearTimer]);

  // Drop timer
  useEffect(() => {
    clearTimer();
    if (gameState === "playing") {
      dropTimer.current = setInterval(() => {
        moveDown();
      }, getDropInterval(level));
    }
    return clearTimer;
  }, [gameState, level, moveDown, clearTimer]);

  // Keyboard input
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          moveLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          moveRight();
          break;
        case "ArrowDown":
          e.preventDefault();
          moveDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          rotate(1);
          break;
        case "z":
        case "Z":
          rotate(-1);
          break;
        case "x":
        case "X":
          rotate(1);
          break;
        case " ":
          e.preventDefault();
          hardDrop();
          break;
        case "c":
        case "C":
        case "Shift":
          e.preventDefault();
          hold();
          break;
        case "Escape":
        case "p":
        case "P":
          togglePause();
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, moveLeft, moveRight, moveDown, rotate, hardDrop, hold, togglePause]);

  // Pause key listener (works even when paused)
  useEffect(() => {
    if (gameState !== "paused") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        togglePause();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState, togglePause]);

  const ghostPosition = currentPiece ? getGhostPosition(board, currentPiece) : null;

  return {
    board,
    currentPiece,
    ghostPosition,
    nextPieces,
    holdPiece,
    score,
    level,
    lines,
    gameState,
    startGame,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotate,
    hold,
  };
}
