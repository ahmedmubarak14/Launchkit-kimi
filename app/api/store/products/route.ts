import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ZID_API_URL = "https://api.zid.sa/v1";

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

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

    for (const product of products) {
      try {
        const response = await fetch(`${ZID_API_URL}/products`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${store.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: {
              ar: product.nameAr,
              en: product.nameEn,
            },
            description: {
              ar: product.descriptionAr || "",
              en: product.descriptionEn || "",
            },
            price: product.price,
            compare_at_price: product.compareAtPrice || null,
            sku: product.sku || null,
            options: product.variants?.map((v: any) => ({
              name: v.name,
              values: v.options,
            })) || [],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          results.push({
            success: true,
            productId: data.id,
            name: product.nameEn,
          });
        } else {
          results.push({
            success: false,
            name: product.nameEn,
            error: `HTTP ${response.status}`,
          });
        }
      } catch (error) {
        results.push({
          success: false,
          name: product.nameEn,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Create products error:", error);
    return NextResponse.json(
      { error: "Failed to create products" },
      { status: 500 }
    );
  }
}
