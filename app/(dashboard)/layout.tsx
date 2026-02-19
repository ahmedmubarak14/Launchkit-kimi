import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user's stores
  const { data: stores } = await supabase
    .from("stores")
    .select("*")
    .eq("user_id", user.id);

  return (
    <DashboardLayout user={profile} stores={stores || []}>
      {children}
    </DashboardLayout>
  );
}
