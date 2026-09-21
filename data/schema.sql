-- Tetris DB: Supabase SQL Schema
-- Supabase SQL Editor에서 실행하세요.

-- game_records: 게임 기록 저장
CREATE TABLE tetris_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  lines_cleared INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- game_reviews: 게임 평가/리뷰
CREATE TABLE tetris_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 리더보드 조회 성능을 위한 인덱스
CREATE INDEX idx_tetris_records_score ON tetris_records(score DESC);
CREATE INDEX idx_tetris_reviews_created ON tetris_reviews(created_at DESC);

-- RLS 정책 (공개 읽기/쓰기)
ALTER TABLE tetris_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tetris_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read tetris_records" ON tetris_records FOR SELECT USING (true);
CREATE POLICY "Allow public insert tetris_records" ON tetris_records FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read tetris_reviews" ON tetris_reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert tetris_reviews" ON tetris_reviews FOR INSERT WITH CHECK (true);
