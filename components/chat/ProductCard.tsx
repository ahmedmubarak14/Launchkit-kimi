"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Edit2, ShoppingBag, Package } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";

interface ProductVariant {
  name: string;
  options: string[];
}

interface Product {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  variants?: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
  sessionId: string | null;
}

export function ProductCard({ product, sessionId }: ProductCardProps) {
  const [editableProduct, setEditableProduct] = useState(product);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const language = useAppStore((state) => state.language);
  const addProduct = useAppStore((state) => state.addProduct);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setCompletionPercentage = useAppStore(
    (state) => state.setCompletionPercentage
  );

  const isRTL = language === "ar";

  const handleSave = async () => {
    if (!sessionId) return;

    setSaving(true);
    const supabase = createClient();

    const { data: savedProduct } = await supabase
      .from("products")
      .insert({
        session_id: sessionId,
        name_ar: editableProduct.nameAr,
        name_en: editableProduct.nameEn,
        description_ar: editableProduct.descriptionAr,
        description_en: editableProduct.descriptionEn,
        price: editableProduct.price,
        compare_at_price: editableProduct.compareAtPrice || null,
        sku: editableProduct.sku || null,
        variants: editableProduct.variants || null,
        status: "draft",
      })
      .select()
      .single();

    if (savedProduct) {
      addProduct(savedProduct);
    }

    // Update progress
    setCurrentStep("marketing");
    setCompletionPercentage(75);

    await supabase
      .from("setup_sessions")
      .update({
        current_step: "marketing",
        completion_percentage: 75,
      })
      .eq("id", sessionId);

    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableProduct(product);
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
    }).format(price);
  };

  return (
    <Card className="mt-3 bg-emerald-50/50 border-emerald-200 max-w-3xl mx-auto">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-emerald-600" />
          <h4 className="font-semibold text-gray-900">
            {isRTL ? "معاينة المنتج" : "Product Preview"}
          </h4>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Name (English)</label>
                <input
                  type="text"
                  value={editableProduct.nameEn}
                  onChange={(e) =>
                    setEditableProduct({
                      ...editableProduct,
                      nameEn: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Name (Arabic)</label>
                <input
                  type="text"
                  value={editableProduct.nameAr}
                  onChange={(e) =>
                    setEditableProduct({
                      ...editableProduct,
                      nameAr: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Price</label>
                <input
                  type="number"
                  value={editableProduct.price}
                  onChange={(e) =>
                    setEditableProduct({
                      ...editableProduct,
                      price: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">SKU</label>
                <input
                  type="text"
                  value={editableProduct.sku || ""}
                  onChange={(e) =>
                    setEditableProduct({
                      ...editableProduct,
                      sku: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {saving ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {isRTL ? "حفظ" : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-sm">
            <div className="flex gap-4">
              {/* Product Image Placeholder */}
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="font-semibold text-gray-900">{editableProduct.nameEn}</h5>
                    <p className="text-sm text-gray-600" dir="rtl">
                      {editableProduct.nameAr}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-emerald-600 flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-lg font-bold text-emerald-600 mt-2">
                  {formatPrice(editableProduct.price)}
                </p>

                {editableProduct.sku && (
                  <p className="text-xs text-gray-500 mt-1">
                    SKU: {editableProduct.sku}
                  </p>
                )}

                {editableProduct.variants && editableProduct.variants.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {editableProduct.variants.map((variant, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
                      >
                        {variant.name}: {variant.options.slice(0, 3).join(", ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {isRTL ? "جاري الحفظ..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {isRTL ? "إضافة المنتج" : "Add Product"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
