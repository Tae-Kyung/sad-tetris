"use client";

import { useState } from "react";
import { useTetris } from "@/hooks/useTetris";
import TetrisBoard from "@/components/TetrisBoard";
import PiecePreview from "@/components/PiecePreview";
import GameInfo from "@/components/GameInfo";
import MobileControls from "@/components/MobileControls";
import GameOverModal from "@/components/GameOverModal";
import PauseModal from "@/components/PauseModal";
import Leaderboard from "@/components/Leaderboard";
import Reviews from "@/components/Reviews";
import { Gamepad2 } from "lucide-react";

export default function Home() {
  const game = useTetris();
  const [showGameOver, setShowGameOver] = useState(false);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "reviews">("leaderboard");

  const isGameOver = game.gameState === "gameover";
  const showGameOverModal = isGameOver && !showGameOver;

  return (
    <main className="min-h-screen flex flex-col items-center py-4 px-2 sm:px-4">
      {/* Title */}
      <h1 className="text-xl sm:text-3xl text-neon-cyan neon-text mb-4 tracking-wider">
        TETRIS
      </h1>

      <div className="flex flex-col md:flex-row gap-4 items-start justify-center w-full max-w-5xl">
        {/* Left: Game area with sidebars */}
        <div className="flex gap-3 justify-center">
          {/* Left sidebar - Hold & Game Info */}
          <div className="hidden md:flex flex-col gap-3 w-28 shrink-0">
            <PiecePreview type={game.holdPiece} label="HOLD" />
            <GameInfo score={game.score} level={game.level} lines={game.lines} />
          </div>

          {/* Center - Game Board */}
          <div className="flex flex-col items-center">
            {/* Mobile: Hold & Next & Info inline */}
            <div className="flex md:hidden gap-2 mb-2 w-full justify-between px-2">
              <PiecePreview type={game.holdPiece} label="HOLD" />
              <GameInfo score={game.score} level={game.level} lines={game.lines} />
              <PiecePreview type={game.nextPieces[0] || null} label="NEXT" />
            </div>

            {game.gameState === "idle" ? (
              <div
                className="neon-border rounded-lg bg-gray-950/80 flex flex-col items-center justify-center gap-8"
                style={{
                  width: "clamp(180px, 37vw, 300px)",
                  height: "clamp(360px, 74vw, 600px)",
                }}
              >
                <Gamepad2 size={64} className="text-neon-cyan animate-pulse-neon" />
                <h2 className="text-lg sm:text-2xl text-neon-cyan neon-text">TETRIS</h2>
                <div className="text-center space-y-2">
                  <p className="text-[10px] sm:text-xs text-gray-400">Controls:</p>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 space-y-1.5">
                    <p>Arrow Keys - Move & Rotate</p>
                    <p>Space - Hard Drop</p>
                    <p>C / Shift - Hold</p>
                    <p>ESC / P - Pause</p>
                  </div>
                </div>
                <button
                  onClick={game.startGame}
                  className="bg-neon-cyan/20 border-2 border-neon-cyan text-neon-cyan rounded-lg px-10 py-4 text-sm sm:text-base hover:bg-neon-cyan/30 transition neon-text"
                >
                  START GAME
                </button>
              </div>
            ) : (
              <TetrisBoard
                board={game.board}
                currentPiece={game.currentPiece}
              />
            )}

            {/* Mobile controls */}
            {game.gameState === "playing" && (
              <MobileControls
                onMoveLeft={game.moveLeft}
                onMoveRight={game.moveRight}
                onMoveDown={game.moveDown}
                onRotateCW={() => game.rotate(1)}
                onRotateCCW={() => game.rotate(-1)}
                onHardDrop={game.hardDrop}
                onHold={game.hold}
                onPause={game.togglePause}
              />
            )}
          </div>

          {/* Right sidebar - Next pieces */}
          <div className="hidden md:flex flex-col gap-3 w-28 shrink-0">
            {game.nextPieces.slice(0, 3).map((type, i) => (
              <PiecePreview key={i} type={type} label={i === 0 ? "NEXT" : ""} />
            ))}
          </div>
        </div>

        {/* Right: Leaderboard & Reviews - always visible */}
        <div className="w-full md:w-64 shrink-0 space-y-3">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex-1 text-[9px] py-1.5 rounded-t border transition ${
                activeTab === "leaderboard"
                  ? "border-neon-cyan text-neon-cyan bg-gray-950"
                  : "border-gray-700 text-gray-500 bg-gray-900"
              }`}
            >
              RANKING
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 text-[9px] py-1.5 rounded-t border transition ${
                activeTab === "reviews"
                  ? "border-neon-cyan text-neon-cyan bg-gray-950"
                  : "border-gray-700 text-gray-500 bg-gray-900"
              }`}
            >
              REVIEWS
            </button>
          </div>
          {activeTab === "leaderboard" ? <Leaderboard /> : <Reviews />}
        </div>
      </div>

      {/* Modals */}
      {showGameOverModal && (
        <GameOverModal
          score={game.score}
          level={game.level}
          lines={game.lines}
          onRestart={game.startGame}
          onClose={() => setShowGameOver(true)}
        />
      )}
      {game.gameState === "paused" && <PauseModal onResume={game.togglePause} />}
    </main>
  );
}
