"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProgressTracker } from "@/components/layout/ProgressTracker";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { PreviewPanel } from "@/components/chat/PreviewPanel";
import { Confetti } from "@/components/Confetti";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Loader2, Globe, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const currentStore = useAppStore((state) => state.currentStore);
  const setCurrentStore = useAppStore((state) => state.setCurrentStore);
  const setCurrentSession = useAppStore((state) => state.setCurrentSession);
  const setMessages = useAppStore((state) => state.setMessages);
  const setCategories = useAppStore((state) => state.setCategories);
  const setProducts = useAppStore((state) => state.setProducts);
  const completionPercentage = useAppStore((state) => state.completionPercentage);

  const isRTL = language === "ar";

  useEffect(() => {
    // If no current store, try to fetch from Supabase
    if (!currentStore) {
      fetchUserStore();
    } else {
      initializeSession();
    }
  }, [currentStore]);

  const fetchUserStore = async () => {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch user's store
    const { data: store } = await supabase
      .from("stores")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", "zid")
      .maybeSingle();

    if (store) {
      setCurrentStore(store);
    }
    
    setLoading(false);
  };

  const initializeSession = async () => {
    if (!currentStore) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Check for existing active session
    const { data: existingSession } = await supabase
      .from("setup_sessions")
      .select("*")
      .eq("store_id", currentStore.id)
      .eq("status", "active")
      .single();

    if (existingSession) {
      setSessionId(existingSession.id);
      setCurrentSession(existingSession);

      // Load messages
      const { data: messages } = await supabase
        .from("messages")
        .select("*")
        .eq("session_id", existingSession.id)
        .order("created_at", { ascending: true });
      setMessages(messages || []);

      // Load categories
      const { data: categories } = await supabase
        .from("categories")
        .select("*")
        .eq("session_id", existingSession.id);
      setCategories(categories || []);

      // Load products
      const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("session_id", existingSession.id);
      setProducts(products || []);
    } else {
      // Create new session
      const { data: newSession } = await supabase
        .from("setup_sessions")
        .insert({
          store_id: currentStore.id,
          status: "active",
          current_step: "business",
          completion_percentage: 0,
        })
        .select()
        .single();

      if (newSession) {
        setSessionId(newSession.id);
        setCurrentSession(newSession);

        // Add welcome message
        const welcomeContent = isRTL
          ? "مرحباً! أنا هنا لمساعدتك في إعداد متجرك. دعني أعرف المزيد عن عملك - ما هو نوع المنتجات التي تبيعها؟"
          : "Hi! I'm here to help you set up your store. Tell me about your business - what kind of products do you sell?";

        await supabase.from("messages").insert({
          session_id: newSession.id,
          role: "assistant",
          content: welcomeContent,
          metadata: { type: "welcome" },
        });

        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .eq("session_id", newSession.id)
          .order("created_at", { ascending: true });
        setMessages(messages || []);
      }
    }

    setLoading(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!currentStore) {
    return (
      <div className="flex items-center justify-center h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-violet-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRTL ? "لم يتم توصيل متجر" : "No Store Connected"}
          </h2>
          <p className="text-gray-600 mb-6">
            {isRTL
              ? "يرجى توصيل متجرك أولاً لبدء إعداد المتجر"
              : "Please connect your store first to start the setup"}
          </p>
          <Link href="/api/auth/zid/authorize">
            <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
              {isRTL ? "توصيل المتجر" : "Connect Store"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* Confetti Animation */}
      <Confetti active={completionPercentage === 100} />

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900 text-lg">
                {isRTL ? "إعداد المتجر" : "Store Setup"}
              </h1>
              <p className="text-sm text-slate-500">{currentStore.store_name}</p>
            </div>
          </div>

          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-full px-4"
          >
            <Globe className="w-4 h-4 text-slate-600" />
            <span className="font-medium text-slate-700">
              {language === "en" ? "العربية" : "English"}
            </span>
          </Button>
        </div>
      </header>

      {/* Main Content - Centered Card Layout */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Progress Tracker */}
          <div className="col-span-3">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 p-6">
              <ProgressTracker />
            </div>
          </div>

          {/* Center - Chat Interface */}
          <div className="col-span-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 min-h-[calc(100vh-200px)]">
              <ChatContainer sessionId={sessionId} />
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="col-span-3">
            <div className="sticky top-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/50 max-h-[calc(100vh-120px)] overflow-hidden">
              <PreviewPanel />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
