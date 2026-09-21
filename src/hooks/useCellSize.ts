"use client";

import { useState, useEffect } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT } from "@/lib/tetris";

export function useCellSize() {
  const [cellSize, setCellSize] = useState(24);

  useEffect(() => {
    function calc() {
      const isMobile = window.innerWidth < 768;
      // 헤더(60) + 여백(32) + 모바일 컨트롤(isMobile ? 160 : 0) + 모바일 상단 패널(isMobile ? 80 : 0)
      const reservedH = 92 + (isMobile ? 240 : 0);
      // 사이드바(md: 128*2 + gap) + 우측 패널(md: 256 + gap) + 여백
      const reservedW = isMobile ? 32 : 420;

      const availH = window.innerHeight - reservedH;
      const availW = window.innerWidth - reservedW;

      const fromH = Math.floor((availH - BOARD_HEIGHT) / BOARD_HEIGHT); // gap 보정
      const fromW = Math.floor((availW - BOARD_WIDTH) / BOARD_WIDTH);

      const size = Math.max(14, Math.min(32, fromH, fromW));
      setCellSize(size);
    }

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return cellSize;
}
