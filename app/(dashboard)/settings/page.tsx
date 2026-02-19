"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import {
  Store,
  Link2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  User,
  Mail,
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stores, setStores] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    preferred_language: "en" as "en" | "ar",
  });

  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const isRTL = language === "ar";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      const { data: storesData } = await supabase
        .from("stores")
        .select("*")
        .eq("user_id", user.id);

      setStores(storesData || []);
    }

    setLoading(false);
  };

  const handleConnectZid = () => {
    window.location.href = "/api/auth/zid/authorize";
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          preferred_language: profile.preferred_language,
        })
        .eq("id", user.id);

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setLanguage(profile.preferred_language);
        setMessage({ type: "success", text: isRTL ? "تم حفظ الإعدادات" : "Settings saved" });
      }
    }

    setSaving(false);
  };

  const content = {
    en: {
      title: "Settings",
      profile: "Profile",
      profileDesc: "Manage your account settings",
      name: "Full Name",
      email: "Email",
      language: "Preferred Language",
      save: "Save Changes",
      stores: "Connected Stores",
      storesDesc: "Manage your connected e-commerce stores",
      connectZid: "Connect Zid Store",
      connected: "Connected",
      notConnected: "Not connected",
      disconnect: "Disconnect",
    },
    ar: {
      title: "الإعدادات",
      profile: "الملف الشخصي",
      profileDesc: "إدارة إعدادات حسابك",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      language: "اللغة المفضلة",
      save: "حفظ التغييرات",
      stores: "المتاجر المتصلة",
      storesDesc: "إدارة متاجرك المتصلة",
      connectZid: "توصيل متجر زد",
      connected: "متصل",
      notConnected: "غير متصل",
      disconnect: "فصل الاتصال",
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
    <div className="p-8 max-w-4xl" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.title}</h1>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-violet-600" />
            {t.profile}
          </CardTitle>
          <CardDescription>{t.profileDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t.name}
              </label>
              <Input
                value={profile.name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t.email}
              </label>
              <Input
                value={profile.email}
                disabled
                className="h-12 rounded-xl bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t.language}
            </label>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setProfile({ ...profile, preferred_language: "en" })
                }
                className={`flex-1 h-12 rounded-xl border transition-all ${
                  profile.preferred_language === "en"
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                English
              </button>
              <button
                onClick={() =>
                  setProfile({ ...profile, preferred_language: "ar" })
                }
                className={`flex-1 h-12 rounded-xl border transition-all font-medium ${
                  profile.preferred_language === "ar"
                    ? "border-violet-500 bg-violet-50 text-violet-700"
                    : "border-gray-200 hover:border-violet-300"
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          <Button
            onClick={handleUpdateProfile}
            disabled={saving}
            className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isRTL ? "جاري الحفظ..." : "Saving..."}
              </>
            ) : (
              t.save
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Store Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5 text-violet-600" />
            {t.stores}
          </CardTitle>
          <CardDescription>{t.storesDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Zid Store */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Zid</p>
                  {stores.find((s) => s.platform === "zid") ? (
                    <div className="flex items-center gap-1 text-emerald-600 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      {stores.find((s) => s.platform === "zid")?.store_name}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">{t.notConnected}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={handleConnectZid}
                variant={stores.find((s) => s.platform === "zid") ? "outline" : "default"}
                className={
                  stores.find((s) => s.platform === "zid")
                    ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                }
              >
                <Link2 className="w-4 h-4 mr-2" />
                {stores.find((s) => s.platform === "zid")
                  ? t.connected
                  : t.connectZid}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
