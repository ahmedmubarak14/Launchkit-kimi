"use client";

import { useState } from "react";
import { Check, Store, Tag, Package, Megaphone, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { useAppStore } from "@/lib/store";

const steps = [
  { id: "business", labelEn: "Business", labelAr: "العمل", icon: Store },
  { id: "categories", labelEn: "Categories", labelAr: "الفئات", icon: Tag },
  { id: "products", labelEn: "Products", labelAr: "المنتجات", icon: Package },
  { id: "marketing", labelEn: "Marketing", labelAr: "التسويق", icon: Megaphone },
];

export function ProgressTracker() {
  const [isOpen, setIsOpen] = useState(false);
  const currentStep = useAppStore((state) => state.currentStep);
  const completionPercentage = useAppStore((state) => state.completionPercentage);
  const categories = useAppStore((state) => state.categories);
  const products = useAppStore((state) => state.products);
  const language = useAppStore((state) => state.language);

  const isRTL = language === "ar";
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const ProgressContent = () => (
    <>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500 font-medium">
            {isRTL ? "التقدم" : "Progress"}
          </span>
          <span className="font-bold text-violet-600">{completionPercentage}%</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 transition-all duration-700 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step.id} className="relative flex items-start gap-4 mb-6 last:mb-0">
              {/* Step Indicator */}
              <div className="relative z-10 flex-shrink-0">
                {isCompleted ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-20" />
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-400" />
                  </div>
                )}
                
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute top-10 left-1/2 -translate-x-1/2 w-0.5 h-6 ${
                      isCompleted ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              {/* Step Label */}
              <div className="flex-1 pt-2">
                <span
                  className={`text-sm font-medium ${
                    isCompleted
                      ? "text-emerald-600"
                      : isCurrent
                      ? "text-violet-700"
                      : "text-slate-400"
                  }`}
                >
                  {isRTL ? step.labelAr : step.labelEn}
                </span>
                {isCurrent && (
                  <p className="text-xs text-slate-400 mt-1">
                    {isRTL ? "قيد التنفيذ..." : "In progress..."}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h4 className="font-semibold text-slate-700 text-sm">
            {isRTL ? "الإحصائيات" : "Stats"}
          </h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-violet-50/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-violet-500" />
              <span className="text-sm text-slate-600">
                {isRTL ? "الفئات" : "Categories"}
              </span>
            </div>
            <span className="font-bold text-violet-700">{categories.length}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-600">
                {isRTL ? "المنتجات" : "Products"}
              </span>
            </div>
            <span className="font-bold text-emerald-700">{products.length}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-slate-600">
                {isRTL ? "الإكمال" : "Completion"}
              </span>
            </div>
            <span className="font-bold text-blue-700">{completionPercentage}%</span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Desktop View */}
      <div className="hidden lg:block">
        <div className="p-6">
          <h3 className="font-semibold text-slate-900 mb-6 text-lg">
            {isRTL ? "تقدم الإعداد" : "Setup Progress"}
          </h3>
          <ProgressContent />
        </div>
      </div>

      {/* Mobile View - Collapsible */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-slate-100"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-900">
                {isRTL ? "تقدم الإعداد" : "Setup Progress"}
              </h3>
              <p className="text-sm text-slate-500">
                {completionPercentage}% {isRTL ? "مكتمل" : "complete"}
              </p>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
        
        {isOpen && (
          <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-slate-100">
            <ProgressContent />
          </div>
        )}
      </div>
    </div>
  );
}
