"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Store,
  Tag,
  Package,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    stores: 0,
  });
  const language = useAppStore((state) => state.language);
  const currentStore = useAppStore((state) => state.currentStore);
  const setCurrentStore = useAppStore((state) => state.setCurrentStore);

  const isRTL = language === "ar";

  useEffect(() => {
    loadStats();
  }, [currentStore]);

  const loadStats = async () => {
    const supabase = createClient();
    
    // Get user's stores
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: stores } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id);

    if (stores && stores.length > 0 && !currentStore) {
      setCurrentStore(stores[0]);
    }

    // Get stats for current store
    if (currentStore) {
      const { data: sessions } = await supabase
        .from("setup_sessions")
        .select("id")
        .eq("store_id", currentStore.id);

      if (sessions && sessions.length > 0) {
        const sessionIds = sessions.map((s) => s.id);

        const [{ count: categoriesCount }, { count: productsCount }] = await Promise.all([
          supabase.from("categories").select("*", { count: "exact", head: true }).in("session_id", sessionIds),
          supabase.from("products").select("*", { count: "exact", head: true }).in("session_id", sessionIds),
        ]);

        setStats({
          categories: categoriesCount || 0,
          products: productsCount || 0,
          stores: stores?.length || 0,
        });
      }
    }

    setLoading(false);
  };

  const content = {
    en: {
      title: "Dashboard",
      subtitle: "Welcome back! Here's what's happening with your store.",
      setupStore: "Setup Your Store",
      setupDescription: "Start a new setup session with AI to create categories and products for your store.",
      stats: {
        categories: "Categories Created",
        products: "Products Created",
        stores: "Connected Stores",
      },
      quickActions: "Quick Actions",
      actions: {
        setup: "Start Store Setup",
        viewCategories: "View Categories",
        viewProducts: "View Products",
      },
    },
    ar: {
      title: "لوحة التحكم",
      subtitle: "مرحباً بعودتك! إليك ما يحدث في متجرك.",
      setupStore: "إعداد المتجر",
      setupDescription: "ابدأ جلسة إعداد جديدة مع الذكاء الاصطناعي لإنشاء الفئات والمنتجات لمتجرك.",
      stats: {
        categories: "الفئات المنشأة",
        products: "المنتجات المنشأة",
        stores: "المتاجر المتصلة",
      },
      quickActions: "إجراءات سريعة",
      actions: {
        setup: "بدء إعداد المتجر",
        viewCategories: "عرض الفئات",
        viewProducts: "عرض المنتجات",
      },
    },
  };

  const t = content[language];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="p-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="text-gray-600 mt-1">{t.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.stats.categories}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.categories}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                <Tag className="w-6 h-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.stats.products}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.products}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t.stats.stores}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.stores}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Setup Card */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-violet-600 to-purple-700 text-white border-0">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{t.setupStore}</h2>
                  <p className="text-violet-100 mb-6">{t.setupDescription}</p>
                  <Link href="/setup">
                    <Button className="bg-white text-violet-600 hover:bg-gray-100 rounded-xl px-6">
                      {t.actions.setup}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t.quickActions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/setup">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <MessageSquare className="w-5 h-5 text-violet-600" />
                  {t.actions.setup}
                </Button>
              </Link>
              <Link href="/dashboard/categories">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <Tag className="w-5 h-5 text-violet-600" />
                  {t.actions.viewCategories}
                </Button>
              </Link>
              <Link href="/dashboard/products">
                <Button variant="outline" className="w-full justify-start gap-3 h-12">
                  <Package className="w-5 h-5 text-violet-600" />
                  {t.actions.viewProducts}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
