"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  LayoutDashboard,
  MessageSquare,
  Store,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Globe,
  Package,
  Tag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAppStore } from "@/lib/store";
import type { Tables } from "@/lib/database.types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: Tables<"profiles"> | null;
  stores: Tables<"stores">[];
}

export function DashboardLayout({ children, user, stores }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);
  const currentStore = useAppStore((state) => state.currentStore);
  const setCurrentStore = useAppStore((state) => state.setCurrentStore);

  const isRTL = language === "ar";

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    {
      label: isRTL ? "لوحة التحكم" : "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: isRTL ? "إعداد المتجر" : "Store Setup",
      href: "/setup",
      icon: MessageSquare,
    },
    {
      label: isRTL ? "الفئات" : "Categories",
      href: "/dashboard/categories",
      icon: Tag,
    },
    {
      label: isRTL ? "المنتجات" : "Products",
      href: "/dashboard/products",
      icon: Package,
    },
    {
      label: isRTL ? "الإعدادات" : "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="font-bold text-xl text-gray-900">LaunchKit</span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 ${
                !sidebarOpen && "hidden"
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Store Selector */}
          {sidebarOpen && stores.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {isRTL ? "المتجر الحالي" : "Current Store"}
              </label>
              <select
                value={currentStore?.id || ""}
                onChange={(e) => {
                  const store = stores.find((s) => s.id === e.target.value);
                  setCurrentStore(store || null);
                }}
                className="mt-2 w-full text-sm border-gray-200 rounded-lg focus:border-violet-500 focus:ring-violet-500"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.store_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? "bg-violet-50 text-violet-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } ${!sidebarOpen && "justify-center"}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {/* Language Toggle */}
            {sidebarOpen && (
              <button
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
              >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {language === "en" ? "العربية" : "English"}
                </span>
              </button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-gray-50 transition-all ${
                    !sidebarOpen && "justify-center"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || user?.email}
                      </p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {isRTL ? "الإعدادات" : "Settings"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isRTL ? "تسجيل الخروج" : "Sign Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
