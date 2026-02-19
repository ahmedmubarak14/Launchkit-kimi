"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Tag, Package, CheckCircle2, Edit2, Store, Check, X, Loader2 } from "lucide-react";

export function PreviewPanel() {
  const categories = useAppStore((state) => state.categories);
  const products = useAppStore((state) => state.products);
  const language = useAppStore((state) => state.language);
  const currentStep = useAppStore((state) => state.currentStep);
  const currentStore = useAppStore((state) => state.currentStore);
  const updateProduct = useAppStore((state) => state.updateProduct);

  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [publishing, setPublishing] = useState(false);

  const isRTL = language === "ar";

  const startEditing = (product: any) => {
    setEditingProduct(product.id);
    setEditForm({
      nameAr: product.name_ar,
      nameEn: product.name_en,
      price: product.price,
      sku: product.sku || "",
    });
  };

  const saveEdit = async (productId: string) => {
    const supabase = createClient();
    const { data: updated } = await supabase
      .from("products")
      .update({
        name_ar: editForm.nameAr,
        name_en: editForm.nameEn,
        price: editForm.price,
        sku: editForm.sku || null,
      })
      .eq("id", productId)
      .select()
      .single();

    if (updated) {
      updateProduct(productId, updated);
    }
    setEditingProduct(null);
  };

  const handlePublishAll = async () => {
    if (!currentStore || (categories.length === 0 && products.length === 0)) return;

    setPublishing(true);
    
    // First publish categories
    if (categories.length > 0) {
      await fetch("/api/store/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
    }

    // Then publish products
    if (products.length > 0) {
      await fetch("/api/store/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });
    }

    // Update status to published
    const supabase = createClient();
    for (const cat of categories) {
      await supabase.from("categories").update({ status: "published" }).eq("id", cat.id);
    }
    for (const prod of products) {
      await supabase.from("products").update({ status: "published" }).eq("id", prod.id);
    }

    setPublishing(false);
  };

  const draftCategories = categories.filter((c) => c.status === "draft");
  const draftProducts = products.filter((p) => p.status === "draft");
  const hasDrafts = draftCategories.length > 0 || draftProducts.length > 0;

  return (
    <div className="h-full flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          {isRTL ? "المحتوى المنشأ" : "Generated Content"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {isRTL
            ? "معاينة ما تم إنشاؤه لمتجرك"
            : "Preview what has been created for your store"}
        </p>
      </div>

      {/* Publish All Button */}
      {hasDrafts && (
        <div className="px-4 py-3 border-b border-gray-200 bg-violet-50">
          <Button
            onClick={handlePublishAll}
            disabled={publishing}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {publishing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isRTL ? "جاري النشر..." : "Publishing..."}
              </>
            ) : (
              <>
                <Store className="w-4 h-4 mr-2" />
                {isRTL ? "نشر الكل للمتجر" : "Publish All to Store"}
              </>
            )}
          </Button>
          <p className="text-xs text-violet-600 mt-2 text-center">
            {isRTL 
              ? `${draftCategories.length} فئات و ${draftProducts.length} منتجات جاهزة للنشر`
              : `${draftCategories.length} categories & ${draftProducts.length} products ready to publish`}
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Categories Section */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-violet-600" />
                <h4 className="font-medium text-sm text-gray-700">
                  {isRTL ? "الفئات" : "Categories"}
                  <span className="ml-2 text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                    {categories.length}
                  </span>
                </h4>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`rounded-lg p-3 border ${
                      category.status === "published"
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-violet-50 border-violet-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                        category.status === "published" ? "text-emerald-500" : "text-violet-500"
                      }`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {isRTL ? category.name_ar : category.name_en}
                          </p>
                          {category.status === "published" && (
                            <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {isRTL ? "منشور" : "Published"}
                            </span>
                          )}
                        </div>
                        <p
                          className="text-xs text-gray-500 truncate"
                          dir={isRTL ? "ltr" : "rtl"}
                        >
                          {isRTL ? category.name_en : category.name_ar}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-emerald-600" />
                <h4 className="font-medium text-sm text-gray-700">
                  {isRTL ? "المنتجات" : "Products"}
                  <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                </h4>
              </div>
              <div className="space-y-2">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className={`rounded-lg p-3 border ${
                      product.status === "published"
                        ? "bg-emerald-50 border-emerald-100"
                        : "bg-emerald-50/50 border-emerald-100"
                    }`}
                  >
                    {editingProduct === product.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editForm.nameEn}
                          onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                          placeholder="Name (EN)"
                        />
                        <input
                          type="text"
                          value={editForm.nameAr}
                          onChange={(e) => setEditForm({ ...editForm, nameAr: e.target.value })}
                          className="w-full px-2 py-1 text-sm border rounded"
                          placeholder="Name (AR)"
                          dir="rtl"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) })}
                            className="flex-1 px-2 py-1 text-sm border rounded"
                            placeholder="Price"
                          />
                          <Button size="sm" onClick={() => saveEdit(product.id)} className="bg-emerald-600">
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingProduct(null)}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${
                          product.status === "published" ? "text-emerald-500" : "text-emerald-400"
                        }`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {isRTL ? product.name_ar : product.name_en}
                            </p>
                            <div className="flex items-center gap-1">
                              {product.status === "published" && (
                                <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {isRTL ? "منشور" : "Published"}
                                </span>
                              )}
                              {product.status !== "published" && (
                                <button
                                  onClick={() => startEditing(product)}
                                  className="text-gray-400 hover:text-emerald-600 p-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p
                              className="text-xs text-gray-500 truncate max-w-[60%]"
                              dir={isRTL ? "ltr" : "rtl"}
                            >
                              {isRTL ? product.name_en : product.name_ar}
                            </p>
                            <p className="text-xs font-semibold text-emerald-600">
                              {new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
                                style: "currency",
                                currency: "SAR",
                              }).format(product.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {categories.length === 0 && products.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm">
                {isRTL
                  ? "ابدأ المحادثة لإنشاء المحتوى"
                  : "Start chatting to generate content"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Summary Footer */}
      {(categories.length > 0 || products.length > 0) && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {isRTL ? "الفئات:" : "Categories:"}
              </span>
              <span className="font-semibold text-violet-600">
                {categories.length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {isRTL ? "المنتجات:" : "Products:"}
              </span>
              <span className="font-semibold text-emerald-600">
                {products.length}
              </span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-700">
                {isRTL ? "الخطوة الحالية:" : "Current Step:"}
              </span>
              <span className="text-gray-900 capitalize">{currentStep}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
