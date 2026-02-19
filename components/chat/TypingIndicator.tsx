"use client";

import { useAppStore } from "@/lib/store";

interface TypingIndicatorProps {
  isTyping?: boolean;
}

export function TypingIndicator({ isTyping = true }: TypingIndicatorProps) {
  const language = useAppStore((state) => state.language);
  const isRTL = language === "ar";

  if (!isTyping) return null;

  return (
    <div className="flex items-center gap-3" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <div className="flex gap-0.5 items-end h-3">
          <span
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          <span
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
