"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Package, Edit2, Check, X, ShoppingBag } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

interface ProductVariant {
  name: string;
  options: string[];
}

interface Product {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  category?: string;
  variants?: ProductVariant[];
  sku?: string;
}

interface ProductPreviewCardProps {
  product: Product;
  sessionId: string | null;
}

export function ProductPreviewCard({ product, sessionId }: ProductPreviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableProduct, setEditableProduct] = useState<Product>(product);
  const [saving, setSaving] = useState(false);

  const language = useAppStore((state) => state.language);
  const addProduct = useAppStore((state) => state.addProduct);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setCompletionPercentage = useAppStore((state) => state.setCompletionPercentage);

  const isRTL = language === "ar";

  const handleAddToStore = async () => {
    if (!sessionId) return;

    setSaving(true);
    const supabase = createClient();

    const { data: savedProduct } = await supabase
      .from("products")
      .insert({
        session_id: sessionId,
        name_ar: editableProduct.nameAr,
        name_en: editableProduct.nameEn,
        description_ar: editableProduct.descriptionAr || null,
        description_en: editableProduct.descriptionEn || null,
        price: editableProduct.price,
        sku: editableProduct.sku || null,
        variants: editableProduct.variants || null,
        status: "draft",
      })
      .select()
      .single();

    if (savedProduct) {
      addProduct(savedProduct);
    }

    setCurrentStep("marketing");
    setCompletionPercentage(75);

    await supabase
      .from("setup_sessions")
      .update({ current_step: "marketing", completion_percentage: 75 })
      .eq("id", sessionId);

    setSaving(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
    }).format(price);
  };

  const description = isRTL 
    ? (editableProduct.descriptionAr || editableProduct.descriptionEn || "")
    : (editableProduct.descriptionEn || editableProduct.descriptionAr || "");

  if (isEditing) {
    return (
      <div className="mt-4 max-w-2xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-800">
              {isRTL ? "تعديل المنتج" : "Edit Product"}
            </h4>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={editableProduct.nameEn}
                onChange={(e) => setEditableProduct({ ...editableProduct, nameEn: e.target.value })}
                placeholder="Product Name (EN)"
                className="h-12"
              />
              <Input
                value={editableProduct.nameAr}
                onChange={(e) => setEditableProduct({ ...editableProduct, nameAr: e.target.value })}
                placeholder="اسم المنتج (AR)"
                className="h-12"
                dir="rtl"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                value={editableProduct.price}
                onChange={(e) => setEditableProduct({ ...editableProduct, price: parseFloat(e.target.value) || 0 })}
                placeholder="Price"
                className="h-12"
              />
              <Input
                value={editableProduct.sku || ""}
                onChange={(e) => setEditableProduct({ ...editableProduct, sku: e.target.value })}
                placeholder="SKU"
                className="h-12"
              />
            </div>

            <Input
              value={editableProduct.category || ""}
              onChange={(e) => setEditableProduct({ ...editableProduct, category: e.target.value })}
              placeholder={isRTL ? "الفئة" : "Category"}
              className="h-12"
            />
          </div>

          <div className="flex gap-3 mt-5" dir={isRTL ? "rtl" : "ltr"}>
            <Button
              onClick={() => setIsEditing(false)}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium"
            >
              <Check className="w-4 h-4 mr-2" />
              {isRTL ? "حفظ التغييرات" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="h-12 px-6"
            >
              <X className="w-4 h-4 mr-2" />
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg shadow-slate-100">
        <div className="flex">
          {/* Image Placeholder */}
          <div className="w-40 h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-12 h-12 text-slate-300" />
          </div>

          {/* Product Info */}
          <div className="flex-1 p-5">
            {/* Category Badge */}
            {editableProduct.category && (
              <Badge className="mb-3 bg-violet-100 text-violet-700 hover:bg-violet-100">
                {editableProduct.category}
              </Badge>
            )}

            {/* Product Names */}
            <h4 className="font-bold text-lg text-slate-900 mb-1" dir="rtl">
              {editableProduct.nameAr}
            </h4>
            <p className="text-slate-500 text-sm mb-3">
              {editableProduct.nameEn}
            </p>

            {/* Description */}
            {description && (
              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                {description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-slate-900">
                {formatPrice(editableProduct.price)}
              </span>
            </div>

            {/* Variants */}
            {editableProduct.variants && editableProduct.variants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4" dir={isRTL ? "rtl" : "ltr"}>
                {editableProduct.variants.map((variant, idx) => (
                  <div key={idx} className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">{variant.name}:</span>
                    {variant.options.map((opt, optIdx) => (
                      <span
                        key={optIdx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-medium"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-100" dir={isRTL ? "rtl" : "ltr"}>
          <Button
            onClick={handleAddToStore}
            disabled={saving}
            className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium shadow-lg shadow-emerald-200"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRTL ? "جاري الإضافة..." : "Adding..."}
              </span>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {isRTL ? "إضافة للمتجر" : "Add to Store"}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="h-12 px-6 border-slate-200 hover:bg-white"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isRTL ? "تعديل" : "Edit"}
          </Button>
        </div>
      </div>
    </div>
  );
}
