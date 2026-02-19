import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-static";

const ZID_AUTH_URL = "https://oauth.zid.sa/oauth/authorize";

export async function GET() {
  return new Response(null, { status: 200 });
}
