import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ZID_AUTH_URL = "https://oauth.zid.sa/oauth/authorize";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const clientId = process.env.ZID_CLIENT_ID;
    const redirectUri = process.env.ZID_REDIRECT_URI;
    const state = user.id;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Zid OAuth not configured" },
        { status: 500 }
      );
    }

    const authUrl = new URL(ZID_AUTH_URL);
    authUrl.searchParams.set("client_id", clientId);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("scope", "read");

    console.log("Zid OAuth URL:", authUrl.toString());
    console.log("Redirect URI:", redirectUri);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Zid authorize error:", error);
    return NextResponse.json(
      { error: "Failed to initiate OAuth flow" },
      { status: 500 }
    );
  }
}
