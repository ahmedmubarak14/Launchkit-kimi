"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredLanguage, setPreferredLanguage] = useState<"en" | "ar">("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          preferred_language: preferredLanguage,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Profile is created automatically by database trigger
    // No need to manually insert

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-gray-900">LaunchKit</span>
        </div>

        <Card className="border-0 shadow-2xl shadow-violet-100">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-bold text-center">Create account</CardTitle>
            <CardDescription className="text-center">
              Get started with LaunchKit today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="h-12 rounded-xl border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Preferred Language</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferredLanguage("en")}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border transition-all ${
                      preferredLanguage === "en"
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 hover:border-violet-300"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredLanguage("ar")}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border transition-all font-medium ${
                      preferredLanguage === "ar"
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-gray-200 hover:border-violet-300"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    العربية
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
