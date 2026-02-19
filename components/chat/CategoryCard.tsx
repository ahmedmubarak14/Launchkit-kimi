"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Edit2, Tag, Sparkles, Store } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";

interface Category {
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  willCreate?: boolean;
}

interface CategoryCardProps {
  categories: Category[];
  sessionId: string | null;
}

export function CategoryCard({ categories, sessionId }: CategoryCardProps) {
  const [editableCategories, setEditableCategories] = useState(
    categories.map((c, i) => ({ ...c, willCreate: i < 3, selected: i < 3 }))
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const language = useAppStore((state) => state.language);
  const addCategory = useAppStore((state) => state.addCategory);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setCompletionPercentage = useAppStore(
    (state) => state.setCompletionPercentage
  );

  const isRTL = language === "ar";

  const selectedCount = editableCategories.filter((c) => c.selected).length;

  const handleEdit = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index: number, field: keyof Category, value: string) => {
    const updated = [...editableCategories];
    updated[index] = { ...updated[index], [field]: value };
    setEditableCategories(updated);
  };

  const toggleSelection = (index: number) => {
    const updated = [...editableCategories];
    updated[index] = { ...updated[index], selected: !updated[index].selected };
    setEditableCategories(updated);
  };

  const handleConfirmAll = async () => {
    if (!sessionId) return;

    setSaving(true);
    const supabase = createClient();

    const selectedCategories = editableCategories.filter((c) => c.selected);

    for (const category of selectedCategories) {
      const { data: savedCategory } = await supabase
        .from("categories")
        .insert({
          session_id: sessionId,
          name_ar: category.nameAr,
          name_en: category.nameEn,
          description_ar: category.descriptionAr || null,
          description_en: category.descriptionEn || null,
          status: "draft",
        })
        .select()
        .single();

      if (savedCategory) {
        addCategory(savedCategory);
      }
    }

    // Update progress
    setCurrentStep("products");
    setCompletionPercentage(50);

    // Update session
    await supabase
      .from("setup_sessions")
      .update({
        current_step: "products",
        completion_percentage: 50,
      })
      .eq("id", sessionId);

    setSaving(false);
  };

  const handleCancel = () => {
    setEditableCategories(categories.map((c, i) => ({ ...c, willCreate: i < 3, selected: i < 3 })));
    setEditingIndex(null);
  };

  return (
    <Card className="mt-3 bg-violet-50/50 border-violet-200 max-w-3xl mx-auto">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-violet-600" />
          <h4 className="font-semibold text-gray-900">
            {isRTL ? "الفئات المقترحة" : "Suggested Categories"}
          </h4>
          <span className="ml-auto text-xs bg-violet-100 text-violet-700 px-2 py-1 rounded-full">
            {selectedCount} {isRTL ? "محدد" : "selected"}
          </span>
        </div>

        <div className="space-y-3 mb-5">
          {editableCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => toggleSelection(index)}
              className={`bg-white rounded-xl p-4 border shadow-sm cursor-pointer transition-all ${
                category.selected
                  ? "border-violet-500 ring-1 ring-violet-500"
                  : "border-violet-100 opacity-70"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Selection Checkbox */}
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    category.selected
                      ? "bg-violet-500 border-violet-500"
                      : "border-gray-300"
                  }`}
                >
                  {category.selected && <Check className="w-3 h-3 text-white" />}
                </div>

                <div className="flex-1 min-w-0">
                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Name (English)</label>
                        <input
                          type="text"
                          value={category.nameEn}
                          onChange={(e) =>
                            handleSaveEdit(index, "nameEn", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Name (Arabic)</label>
                        <input
                          type="text"
                          value={category.nameAr}
                          onChange={(e) =>
                            handleSaveEdit(index, "nameAr", e.target.value)
                          }
                          className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingIndex(null);
                          }}
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{category.nameEn}</p>
                          {category.selected && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Store className="w-3 h-3" />
                              {isRTL ? "سيتم الإنشاء" : "Will create"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600" dir="rtl">
                          {category.nameAr}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(index);
                        }}
                        className="text-gray-500 hover:text-violet-600 flex-shrink-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleConfirmAll}
            disabled={saving || selectedCount === 0}
            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRTL ? "جاري الحفظ..." : "Saving..."}
              </span>
            ) : (
              <>
                <Store className="w-4 h-4 mr-2" />
                {isRTL ? `إنشاء ${selectedCount} في المتجر` : `Create ${selectedCount} in Store`}
              </>
            )}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            <X className="w-4 h-4 mr-2" />
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
