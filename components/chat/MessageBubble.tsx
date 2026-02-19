"use client";

import { useAppStore } from "@/lib/store";
import { getRelativeTime } from "@/lib/time";
import { Sparkles, User } from "lucide-react";
import type { Json } from "@/lib/database.types";

interface MessageBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  metadata: Json | null;
  createdAt?: string;
}

export function MessageBubble({ role, content, createdAt }: MessageBubbleProps) {
  const language = useAppStore((state) => state.language);
  const isRTL = language === "ar";

  const isUser = role === "user";
  const timestamp = createdAt ? getRelativeTime(createdAt, language) : "";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-${isUser ? "right" : "left"}-3 duration-500`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
            isUser
              ? "bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500"
              : "bg-gradient-to-br from-slate-100 to-slate-200"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Sparkles className="w-5 h-5 text-violet-500" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col gap-1.5">
          <div
            className={`px-6 py-4 text-sm leading-relaxed shadow-sm ${
              isUser
                ? "bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 text-white rounded-2xl rounded-br-md"
                : "bg-white/90 backdrop-blur-sm border border-slate-200/60 text-slate-700 rounded-2xl rounded-bl-md shadow-sm"
            }`}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <p className="font-normal">{content}</p>
          </div>
          {/* Timestamp */}
          <span className={`text-xs text-slate-400 font-medium ${isUser ? "text-right" : "text-left"}`}>
            {timestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
