"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Zap,
  Globe,
  MessageSquare,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [language, setLanguage] = useState<"en" | "ar">("en");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = language === "ar";

  const content = {
    en: {
      nav: {
        features: "Features",
        pricing: "Pricing",
        login: "Login",
        getStarted: "Get Started Free",
      },
      hero: {
        badge: "AI-Powered Store Setup",
        headline: "Setup Your Store in Minutes with AI",
        subheadline:
          "LaunchKit helps merchants set up their online stores through natural conversation with AI. No forms, no complexity - just describe your business and let AI handle the rest.",
        cta: "Get Started Free",
        ctaSecondary: "Watch Demo",
      },
      features: {
        title: "Everything You Need to Launch",
        subtitle: "AI-powered tools that transform how you set up your e-commerce store",
        cards: [
          {
            icon: Sparkles,
            title: "AI Categories",
            description:
              "Smart category suggestions based on your business type. AI analyzes your products and creates the perfect category structure automatically.",
          },
          {
            icon: ShoppingBag,
            title: "Smart Products",
            description:
              "Generate complete product listings with descriptions, prices, and variants. AI creates professional content in both Arabic and English.",
          },
          {
            icon: Zap,
            title: "Marketing Setup",
            description:
              "Automatic SEO optimization, meta tags, and marketing configuration. Your store is ready to rank and convert from day one.",
          },
        ],
      },
      cta: {
        title: "Ready to Launch Your Store?",
        subtitle:
          "Join merchants who are setting up their stores faster than ever with AI",
        button: "Start Building Free",
      },
      footer: {
        rights: "All rights reserved.",
      },
    },
    ar: {
      nav: {
        features: "المميزات",
        pricing: "الأسعار",
        login: "تسجيل الدخول",
        getStarted: "ابدأ مجاناً",
      },
      hero: {
        badge: "إعداد المتجر بالذكاء الاصطناعي",
        headline: "أنشئ متجرك في دقائق بالذكاء الاصطناعي",
        subheadline:
          "يساعد LaunchKit التجار في إعداد متاجرهم عبر محادثة طبيعية مع الذكاء الاصطناعي. بدون نماذج معقدة - فقط صف عملك ودع الذكاء الاصطناعي يتولى الباقي.",
        cta: "ابدأ مجاناً",
        ctaSecondary: "شاهد العرض",
      },
      features: {
        title: "كل ما تحتاجه للإطلاق",
        subtitle: "أدوات مدعومة بالذكاء الاصطناعي تحول طريقة إعداد متجرك",
        cards: [
          {
            icon: Sparkles,
            title: "فئات ذكية",
            description:
              "اقتراحات فئات ذكية بناءً على نوع عملك. يحلل الذكاء الاصطناعي منتجاتك وينشئ هيكل الفئات المثالي تلقائياً.",
          },
          {
            icon: ShoppingBag,
            title: "منتجات ذكية",
            description:
              "أنشئ قوائم منتجات كاملة مع أوصاف وأسعار ومتغيرات. يخلق الذكاء الاصطناعي محتوى احترافي بالعربية والإنجليزية.",
          },
          {
            icon: Zap,
            title: "إعداد التسويق",
            description:
              "تحسين SEO تلقائي، علامات ميتا، وإعداد التسويق. متجرك جاهز للتصنيف والتحويل من اليوم الأول.",
          },
        ],
      },
      cta: {
        title: "مستعد لإطلاق متجرك؟",
        subtitle: "انضم للتجار الذين يُعدون متاجرهم أسرع من أي وقت مضى بالذكاء الاصطناعي",
        button: "ابدأ البناء مجاناً",
      },
      footer: {
        rights: "جميع الحقوق محفوظة.",
      },
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">LaunchKit</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-violet-600 transition-colors"
              >
                {t.nav.features}
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-violet-600 transition-colors"
              >
                {t.nav.pricing}
              </a>
              <Link
                href="/login"
                className="text-gray-600 hover:text-violet-600 transition-colors"
              >
                {t.nav.login}
              </Link>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {language === "en" ? "العربية" : "English"}
                </span>
              </button>

              <Link href="/signup">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6">
                  {t.nav.getStarted}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-3">
              <a
                href="#features"
                className="block py-2 text-gray-600 hover:text-violet-600"
              >
                {t.nav.features}
              </a>
              <a
                href="#pricing"
                className="block py-2 text-gray-600 hover:text-violet-600"
              >
                {t.nav.pricing}
              </a>
              <Link
                href="/login"
                className="block py-2 text-gray-600 hover:text-violet-600"
              >
                {t.nav.login}
              </Link>
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                  className="flex items-center gap-2 w-full py-2"
                >
                  <Globe className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">
                    {language === "en" ? "العربية" : "English"}
                  </span>
                </button>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl">
                    {t.nav.getStarted}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 px-4 py-1.5 bg-violet-100 text-violet-700 border-violet-200 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              {t.hero.badge}
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {t.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-xl shadow-violet-200 transition-all hover:scale-105">
                  {t.hero.cta}
                  <ArrowRight
                    className={`w-5 h-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
                  />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-2xl px-8 py-6 text-lg font-semibold border-gray-300 hover:border-violet-300 hover:bg-violet-50"
              >
                {t.hero.ctaSecondary}
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span>Connects to Zid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {t.features.cards.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-3xl bg-gray-50 hover:bg-violet-50 border border-gray-100 hover:border-violet-200 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <MessageSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-lg sm:text-xl text-violet-100 mb-10 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>
          <Link href="/signup">
            <Button className="bg-white text-violet-600 hover:bg-gray-100 rounded-2xl px-10 py-7 text-lg font-semibold shadow-xl transition-all hover:scale-105">
              {t.cta.button}
              <ArrowRight
                className={`w-5 h-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`}
              />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">LaunchKit</span>
            </div>
            <p className="text-sm">
              {new Date().getFullYear()} LaunchKit. {t.footer.rights}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
