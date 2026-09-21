"use client";

import { useState, useEffect } from "react";
import { Star, Send, RefreshCw } from "lucide-react";
import {
  getReviews,
  getAverageRating,
  saveReview,
  GameReview,
  isSupabaseConfigured,
} from "@/lib/supabase";

function Stars({ rating, onRate }: { rating: number; onRate?: (n: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={`${
            n <= rating ? "text-neon-yellow fill-neon-yellow" : "text-gray-600"
          } ${onRate ? "cursor-pointer hover:text-neon-yellow" : ""}`}
          onClick={() => onRate?.(n)}
        />
      ))}
    </div>
  );
}

export default function Reviews({ playerName }: { playerName: string }) {
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [avg, setAvg] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [r, a] = await Promise.all([getReviews(), getAverageRating()]);
      setReviews(r);
      setAvg(a);
    } catch {
      console.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!playerName.trim() || !rating || submitting) return;
    setSubmitting(true);
    try {
      await saveReview({
        author_name: playerName.trim(),
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setRating(0);
      fetchData();
    } catch {
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="neon-border rounded-lg p-4 theme-panel">
        <div className="text-[10px] text-neon-yellow text-center">
          Supabase not configured.
          <br />
          Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
        </div>
      </div>
    );
  }

  return (
    <div className="neon-border rounded-lg p-4 theme-panel">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star size={14} className="text-neon-yellow fill-neon-yellow" />
          <span className="text-[10px] sm:text-xs text-neon-cyan neon-text">REVIEWS</span>
          {avg > 0 && (
            <span className="text-[9px] text-neon-yellow">{avg}/5</span>
          )}
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="text-neon-cyan hover:text-white transition"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Submit form */}
      <div className="space-y-2 mb-4 pb-3 border-b border-gray-800">
        <Stars rating={rating} onRate={setRating} />
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Write a review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={100}
            className="flex-1 theme-input border rounded px-2 py-1.5 text-[9px] focus:outline-none focus:border-neon-cyan"
          />
          <button
            onClick={handleSubmit}
            disabled={!playerName.trim() || !rating || submitting}
            className="bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded px-2 hover:bg-neon-cyan/30 disabled:opacity-40 transition"
          >
            <Send size={10} />
          </button>
        </div>
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-[9px] text-gray-500 text-center py-2">No reviews yet</p>
      ) : (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-gray-800/50 pb-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] text-gray-300">{r.author_name}</span>
                <Stars rating={r.rating} />
              </div>
              {r.comment && (
                <p className="text-[8px] text-gray-500 mt-0.5">{r.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
