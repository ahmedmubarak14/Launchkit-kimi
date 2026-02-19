export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          preferred_language: "en" | "ar";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          preferred_language?: "en" | "ar";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          preferred_language?: "en" | "ar";
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          user_id: string;
          platform: "zid" | "salla" | "other";
          access_token: string;
          refresh_token: string | null;
          store_name: string;
          store_domain: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: "zid" | "salla" | "other";
          access_token: string;
          refresh_token?: string | null;
          store_name: string;
          store_domain?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: "zid" | "salla" | "other";
          access_token?: string;
          refresh_token?: string | null;
          store_name?: string;
          store_domain?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      setup_sessions: {
        Row: {
          id: string;
          store_id: string;
          status: "active" | "completed" | "abandoned";
          current_step: "business" | "categories" | "products" | "marketing";
          completion_percentage: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          status?: "active" | "completed" | "abandoned";
          current_step?: "business" | "categories" | "products" | "marketing";
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          status?: "active" | "completed" | "abandoned";
          current_step?: "business" | "categories" | "products" | "marketing";
          completion_percentage?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          role?: "user" | "assistant" | "system";
          content?: string;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          session_id: string;
          platform_id: string | null;
          name_ar: string;
          name_en: string;
          description_ar: string | null;
          description_en: string | null;
          parent_id: string | null;
          status: "draft" | "published" | "synced";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          platform_id?: string | null;
          name_ar: string;
          name_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          parent_id?: string | null;
          status?: "draft" | "published" | "synced";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          platform_id?: string | null;
          name_ar?: string;
          name_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
          parent_id?: string | null;
          status?: "draft" | "published" | "synced";
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          session_id: string;
          platform_id: string | null;
          category_id: string | null;
          name_ar: string;
          name_en: string;
          description_ar: string | null;
          description_en: string | null;
          price: number;
          compare_at_price: number | null;
          cost_price: number | null;
          sku: string | null;
          barcode: string | null;
          weight: number | null;
          status: "draft" | "published" | "synced";
          images: string[] | null;
          variants: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          platform_id?: string | null;
          category_id?: string | null;
          name_ar: string;
          name_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          price: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          weight?: number | null;
          status?: "draft" | "published" | "synced";
          images?: string[] | null;
          variants?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          platform_id?: string | null;
          category_id?: string | null;
          name_ar?: string;
          name_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
          price?: number;
          compare_at_price?: number | null;
          cost_price?: number | null;
          sku?: string | null;
          barcode?: string | null;
          weight?: number | null;
          status?: "draft" | "published" | "synced";
          images?: string[] | null;
          variants?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
