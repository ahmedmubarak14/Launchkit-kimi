"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Copy, Check, Calendar, Percent, Tag } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface Coupon {
  code: string;
  discount: string;
  discountValue: number;
  discountType: "percentage" | "fixed";
  expiryDate?: string;
  minOrder?: number;
  maxDiscount?: number;
}

interface CouponCardProps {
  coupon: Coupon;
  sessionId?: string | null;
}

export function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  const language = useAppStore((state) => state.language);
  const isRTL = language === "ar";

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreate = async () => {
    setCreating(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCreating(false);
    setCreated(true);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return isRTL ? "لا تاريخ انتهاء" : "No expiry";
    const date = new Date(dateStr);
    return date.toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDiscountDisplay = () => {
    if (coupon.discountType === "percentage") {
      return `${coupon.discountValue}%`;
    }
    return new Intl.NumberFormat(isRTL ? "ar-SA" : "en-US", {
      style: "currency",
      currency: "SAR",
    }).format(coupon.discountValue);
  };

  return (
    <div className="mt-4 max-w-xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-orange-200/60 rounded-2xl p-6 shadow-lg shadow-orange-100">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-rose-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-200/30 to-orange-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-md">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-lg">
                {isRTL ? "كوبون خصم" : "Discount Coupon"}
              </h4>
              <p className="text-sm text-slate-500">
                {isRTL ? "أنشئ كوبوناً لجذب العملاء" : "Create a coupon to attract customers"}
              </p>
            </div>
          </div>

          {/* Coupon Code Display */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 mb-5 border border-orange-100 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500 font-medium">
                {isRTL ? "رمز الكوبون" : "Coupon Code"}
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    {isRTL ? "تم النسخ!" : "Copied!"}
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    {isRTL ? "نسخ" : "Copy"}
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <code className="text-3xl font-bold tracking-wider text-slate-800 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                {coupon.code}
              </code>
            </div>
          </div>

          {/* Discount Info */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-white/60 rounded-xl p-4 text-center border border-orange-100">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Percent className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-slate-500">
                  {isRTL ? "الخصم" : "Discount"}
                </span>
              </div>
              <span className="text-2xl font-bold text-slate-800">
                {getDiscountDisplay()}
              </span>
              <span className="text-sm text-slate-500 ml-1">
                {coupon.discountType === "percentage" 
                  ? (isRTL ? "خصم" : "OFF")
                  : (isRTL ? "خصم ثابت" : "Fixed discount")
                }
              </span>
            </div>

            <div className="bg-white/60 rounded-xl p-4 text-center border border-orange-100">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-slate-500">
                  {isRTL ? "تاريخ الانتهاء" : "Expires"}
                </span>
              </div>
              <span className="text-lg font-semibold text-slate-800">
                {formatDate(coupon.expiryDate)}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          {(coupon.minOrder || coupon.maxDiscount) && (
            <div className="flex flex-wrap gap-2 mb-5" dir={isRTL ? "rtl" : "ltr"}>
              {coupon.minOrder && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100/50 rounded-lg text-sm text-orange-700">
                  <Tag className="w-3.5 h-3.5" />
                  {isRTL 
                    ? `الحد الأدنى للطلب: ${new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(coupon.minOrder)}`
                    : `Min order: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "SAR" }).format(coupon.minOrder)}`
                  }
                </div>
              )}
              {coupon.maxDiscount && coupon.discountType === "percentage" && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100/50 rounded-lg text-sm text-rose-700">
                  <Percent className="w-3.5 h-3.5" />
                  {isRTL 
                    ? `الحد الأقصى: ${new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(coupon.maxDiscount)}`
                    : `Max discount: ${new Intl.NumberFormat("en-US", { style: "currency", currency: "SAR" }).format(coupon.maxDiscount)}`
                  }
                </div>
              )}
            </div>
          )}

          {/* Create Button */}
          <Button
            onClick={handleCreate}
            disabled={creating || created}
            className={`w-full h-12 font-medium shadow-lg transition-all ${
              created 
                ? "bg-emerald-500 hover:bg-emerald-500" 
                : "bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-600 hover:via-rose-600 hover:to-pink-600 shadow-orange-200"
            }`}
          >
            {creating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRTL ? "جاري الإنشاء..." : "Creating..."}
              </span>
            ) : created ? (
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                {isRTL ? "تم إنشاء الكوبون!" : "Coupon Created!"}
              </span>
            ) : (
              <>
                <Ticket className="w-4 h-4 mr-2" />
                {isRTL ? "إنشاء الكوبون" : "Create Coupon"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
