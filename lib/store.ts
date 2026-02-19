import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tables } from "@/lib/database.types";

type Profile = Tables<"profiles">;
type Store = Tables<"stores">;
type SetupSession = Tables<"setup_sessions">;
type Message = Tables<"messages">;
type Category = Tables<"categories">;
type Product = Tables<"products">;

interface AppState {
  // User & Auth
  user: Profile | null;
  setUser: (user: Profile | null) => void;

  // Language
  language: "en" | "ar";
  setLanguage: (language: "en" | "ar") => void;

  // Store
  currentStore: Store | null;
  setCurrentStore: (store: Store | null) => void;

  // Setup Session
  currentSession: SetupSession | null;
  setCurrentSession: (session: SetupSession | null) => void;

  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  setCategories: (categories: Category[]) => void;

  // Products
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  setProducts: (products: Product[]) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Progress
  currentStep: "business" | "categories" | "products" | "marketing";
  setCurrentStep: (step: "business" | "categories" | "products" | "marketing") => void;
  completionPercentage: number;
  setCompletionPercentage: (percentage: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User & Auth
      user: null,
      setUser: (user) => set({ user }),

      // Language
      language: "en",
      setLanguage: (language) => set({ language }),

      // Store
      currentStore: null,
      setCurrentStore: (store) => set({ currentStore: store }),

      // Setup Session
      currentSession: null,
      setCurrentSession: (session) => set({ currentSession: session }),

      // Messages
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setMessages: (messages) => set({ messages }),

      // Categories
      categories: [],
      addCategory: (category) =>
        set((state) => ({ categories: [...state.categories, category] })),
      updateCategory: (id, updates) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      setCategories: (categories) => set({ categories }),

      // Products
      products: [],
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      setProducts: (products) => set({ products }),

      // UI State
      sidebarOpen: true,
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Progress
      currentStep: "business",
      setCurrentStep: (step) => set({ currentStep: step }),
      completionPercentage: 0,
      setCompletionPercentage: (percentage) =>
        set({ completionPercentage: percentage }),
    }),
    {
      name: "launchkit-storage",
      partialize: (state) => ({
        language: state.language,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
