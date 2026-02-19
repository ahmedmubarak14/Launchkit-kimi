import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ZID_API_URL = "https://api.zid.sa/v1";

export async function POST(request: NextRequest) {
  try {
    const { categories } = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Zid store
    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", "zid")
      .single();

    if (!store) {
      return NextResponse.json(
        { error: "No Zid store connected" },
        { status: 400 }
      );
    }

    const results = [];

    for (const category of categories) {
      try {
        const response = await fetch(`${ZID_API_URL}/categories`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: {
              ar: category.nameAr,
              en: category.nameEn,
            },
            description: {
              ar: category.descriptionAr || "",
              en: category.descriptionEn || "",
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            success: true,
            categoryId: data.id,
            name: category.nameEn,
          });
        } else {
          results.push({
            success: false,
            name: category.nameEn,
            error: `HTTP ${response.status}`,
          });
        }
      } catch (error) {
        results.push({
          success: false,
          name: category.nameEn,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Create categories error:", error);
    return NextResponse.json(
      { error: "Failed to create categories" },
      { status: 500 }
    );
  }
}
