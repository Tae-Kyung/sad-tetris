import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export interface GameRecord {
  id?: string;
  player_name: string;
  score: number;
  level: number;
  lines_cleared: number;
  created_at?: string;
}

export interface GameReview {
  id?: string;
  rating: number;
  comment: string;
  author_name: string;
  created_at?: string;
}

export async function saveGameRecord(record: Omit<GameRecord, "id" | "created_at">) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("tetris_records").insert(record).select().single();
  if (error) throw error;
  return data;
}

export async function getTopScores(limit = 10): Promise<GameRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tetris_records")
    .select("*")
    .order("score", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function saveReview(review: Omit<GameReview, "id" | "created_at">) {
  if (!supabase) return null;
  const { data, error } = await supabase.from("tetris_reviews").insert(review).select().single();
  if (error) throw error;
  return data;
}

export async function getReviews(limit = 20): Promise<GameReview[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tetris_reviews")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getAverageRating(): Promise<number> {
  if (!supabase) return 0;
  const { data, error } = await supabase.from("tetris_reviews").select("rating");
  if (error) throw error;
  if (!data || data.length === 0) return 0;
  const sum = data.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / data.length) * 10) / 10;
}
