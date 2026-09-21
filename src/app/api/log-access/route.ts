import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(req: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {}

  await supabase.from("tetris_access_logs").insert({
    ip_address: ip,
    user_agent: body.user_agent || null,
    language: body.language || null,
    screen_width: body.screen_width || null,
    screen_height: body.screen_height || null,
    referrer: body.referrer || null,
  });

  return NextResponse.json({ ok: true });
}
