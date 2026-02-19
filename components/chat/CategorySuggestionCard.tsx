"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, X, Plus, Edit2, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id?: string;
  nameAr: string;
  nameEn: string;
}

interface CategorySuggestionCardProps {
  categories: Category[];
  sessionId: string | null;
}

export function CategorySuggestionCard({ categories, sessionId }: CategorySuggestionCardProps) {
  const [editableCategories, setEditableCategories] = useState<Category[]>(categories);
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [saving, setSaving] = useState(false);

  const language = useAppStore((state) => state.language);
  const addCategory = useAppStore((state) => state.addCategory);
  const setCurrentStep = useAppStore((state) => state.setCurrentStep);
  const setCompletionPercentage = useAppStore((state) => state.setCompletionPercentage);

  const isRTL = language === "ar";

  const handleRemove = (index: number) => {
    setEditableCategories(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!newCategoryName.trim()) return;
    
    const newCategory: Category = {
      nameAr: isRTL ? newCategoryName : `${newCategoryName} (AR)`,
      nameEn: isRTL ? `${newCategoryName} (EN)` : newCategoryName,
    };
    
    setEditableCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    setShowAddInput(false);
  };

  const handleCreate = async () => {
    if (!sessionId || editableCategories.length === 0) return;

    setSaving(true);
    const supabase = createClient();

    for (const category of editableCategories) {
      const { data: savedCategory } = await supabase
        .from("categories")
        .insert({
          session_id: sessionId,
          name_ar: category.nameAr,
          name_en: category.nameEn,
          status: "draft",
        })
        .select()
        .single();

      if (savedCategory) {
        addCategory(savedCategory);
      }
    }

    setCurrentStep("products");
    setCompletionPercentage(50);

    await supabase
      .from("setup_sessions")
      .update({ current_step: "products", completion_percentage: 50 })
      .eq("id", sessionId);

    setSaving(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const updateCategory = (index: number, field: keyof Category, value: string) => {
    setEditableCategories(prev => 
      prev.map((cat, i) => i === index ? { ...cat, [field]: value } : cat)
    );
  };

  return (
    <div className="mt-4 max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-violet-50/90 to-purple-50/90 backdrop-blur-sm border border-violet-200/60 rounded-2xl p-6 shadow-lg shadow-violet-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">
              {isRTL ? "الفئات المقترحة" : "Suggested Categories"}
            </h4>
            <p className="text-sm text-slate-500">
              {isRTL 
                ? `${editableCategories.length} فئات جاهزة للإنشاء`
                : `${editableCategories.length} categories ready to create`}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5" dir={isRTL ? "rtl" : "ltr"}>
          {editableCategories.map((category, index) => (
            <div
              key={index}
              className="group relative bg-white border border-violet-200 rounded-xl px-4 py-2.5 shadow-sm hover:shadow-md transition-all"
            >
              {isEditing ? (
                <div className="space-y-2 min-w-[200px]">
                  <Input
                    value={category.nameEn}
                    onChange={(e) => updateCategory(index, "nameEn", e.target.value)}
                    placeholder="Name (EN)"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={category.nameAr}
                    onChange={(e) => updateCategory(index, "nameAr", e.target.value)}
                    placeholder="Name (AR)"
                    className="h-8 text-sm"
                    dir="rtl"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{category.nameEn}</span>
                  <span className="text-slate-400 text-sm" dir="rtl">{category.nameAr}</span>
                </div>
              )}
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Button */}
          {showAddInput ? (
            <div className="flex items-center gap-2">
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder={isRTL ? "اسم الفئة..." : "Category name..."}
                className="h-10 w-40"
                autoFocus
              />
              <Button size="sm" onClick={handleAdd} className="h-10 bg-violet-600">
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddInput(false)} className="h-10">
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddInput(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-violet-100/50 hover:bg-violet-100 text-violet-600 rounded-xl border border-dashed border-violet-300 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">{isRTL ? "إضافة" : "Add"}</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3" dir={isRTL ? "rtl" : "ltr"}>
          <Button
            onClick={handleCreate}
            disabled={saving || editableCategories.length === 0}
            className="flex-1 h-12 bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white font-medium shadow-lg shadow-violet-200"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRTL ? "جاري الإنشاء..." : "Creating..."}
              </span>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                {isRTL ? "إنشاء الفئات" : "Create Categories"}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleEditToggle}
            className="h-12 px-6 border-slate-200 hover:bg-slate-50"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? (isRTL ? "تم" : "Done") : (isRTL ? "تعديل" : "Edit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
