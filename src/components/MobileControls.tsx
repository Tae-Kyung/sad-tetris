"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  RotateCw,
  ChevronsDown,
  Pause,
  Archive,
} from "lucide-react";

interface Props {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  onPause: () => void;
}

function Btn({
  children,
  onPress,
  className = "",
}: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
}) {
  return (
    <button
      onTouchStart={(e) => {
        e.preventDefault();
        onPress();
      }}
      onMouseDown={onPress}
      className={`active:scale-90 active:brightness-125 transition-transform bg-gray-800/80 border border-neon-cyan/40 rounded-xl flex items-center justify-center text-neon-cyan ${className}`}
      style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}
    >
      {children}
    </button>
  );
}

export default function MobileControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotateCW,
  onRotateCCW,
  onHardDrop,
  onHold,
  onPause,
}: Props) {
  return (
    <div className="md:hidden w-full max-w-md mx-auto mt-3 select-none px-2">
      <div className="flex justify-between items-center gap-2">
        {/* Left side: D-pad */}
        <div className="grid grid-cols-3 grid-rows-2 gap-1">
          <Btn onPress={onRotateCCW} className="w-12 h-12">
            <RotateCcw size={20} />
          </Btn>
          <Btn onPress={onHold} className="w-12 h-12">
            <Archive size={20} />
          </Btn>
          <Btn onPress={onRotateCW} className="w-12 h-12">
            <RotateCw size={20} />
          </Btn>
          <Btn onPress={onMoveLeft} className="w-12 h-12">
            <ArrowLeft size={20} />
          </Btn>
          <Btn onPress={onMoveDown} className="w-12 h-12">
            <ArrowDown size={20} />
          </Btn>
          <Btn onPress={onMoveRight} className="w-12 h-12">
            <ArrowRight size={20} />
          </Btn>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex flex-col gap-2">
          <Btn onPress={onPause} className="w-14 h-10">
            <Pause size={18} />
          </Btn>
          <Btn onPress={onHardDrop} className="w-14 h-16 text-neon-yellow border-neon-yellow/40">
            <ChevronsDown size={28} />
          </Btn>
        </div>
      </div>
    </div>
  );
}
