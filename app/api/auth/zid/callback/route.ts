import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ZID_TOKEN_URL = "https://oauth.zid.sa/oauth/token";
const ZID_API_URL = "https://api.zid.sa/v1";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/settings?error=missing_params", request.url)
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== state) {
      return NextResponse.redirect(
        new URL("/settings?error=unauthorized", request.url)
      );
    }

    const clientId = process.env.ZID_CLIENT_ID;
    const clientSecret = process.env.ZID_CLIENT_SECRET;
    const redirectUri = process.env.ZID_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return NextResponse.redirect(
        new URL("/settings?error=not_configured", request.url)
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(ZID_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    // Get store info from Zid API
    const storeResponse = await fetch(`${ZID_API_URL}/stores/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!storeResponse.ok) {
      throw new Error("Failed to fetch store info");
    }

    const storeData = await storeResponse.json();
    const storeName = storeData.name || "My Store";
    const storeDomain = storeData.domain || null;

    // Check if store already exists for this user
    const { data: existingStore, error: storeCheckError } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", "zid")
      .maybeSingle();

    if (storeCheckError) {
      console.error("Store check error:", storeCheckError);
    }

    let storeResult;
    if (existingStore) {
      // Update existing store
      storeResult = await supabase
        .from("stores")
        .update({
          access_token: accessToken,
          refresh_token: refreshToken,
          store_name: storeName,
          store_domain: storeDomain,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingStore.id)
        .select()
        .single();
    } else {
      // Create new store
      storeResult = await supabase.from("stores").insert({
        user_id: user.id,
        platform: "zid",
        access_token: accessToken,
        refresh_token: refreshToken,
        store_name: storeName,
        store_domain: storeDomain,
      }).select().single();
    }

    if (storeResult.error) {
      console.error("Store save error:", storeResult.error);
      return NextResponse.redirect(
        new URL("/settings?error=save_failed", request.url)
      );
    }

    console.log("Store saved successfully:", storeResult.data);

    // Redirect to setup page with store connected
    return NextResponse.redirect(
      new URL("/setup?success=connected", request.url)
    );
  } catch (error) {
    console.error("Zid callback error:", error);
    return NextResponse.redirect(
      new URL("/settings?error=connection_failed", request.url)
    );
  }
}
