"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { CategorySuggestionCard } from "./CategorySuggestionCard";
import { ProductPreviewCard } from "./ProductPreviewCard";
import { CouponCard } from "./CouponCard";
import { useAppStore } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { Send, Image as ImageIcon, Loader2, X, Sparkles } from "lucide-react";

interface ChatContainerProps {
  sessionId: string | null;
}

const quickActions = {
  en: [
    { label: "I sell fashion", value: "I sell fashion and clothing items" },
    { label: "I sell electronics", value: "I sell electronics and gadgets" },
    { label: "I sell home goods", value: "I sell home and kitchen products" },
  ],
  ar: [
    { label: "أبيع منتجات غذائية", value: "أبيع منتجات غذائية" },
    { label: "أبيع ملابس", value: "أبيع ملابس وأزياء" },
    { label: "أبيع إلكترونيات", value: "أبيع إلكترونيات وأجهزة" },
  ],
};

export function ChatContainer({ sessionId }: ChatContainerProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = useAppStore((state) => state.messages);
  const addMessage = useAppStore((state) => state.addMessage);
  const language = useAppStore((state) => state.language);
  const categories = useAppStore((state) => state.categories);
  const products = useAppStore((state) => state.products);

  const isRTL = language === "ar";
  const actions = quickActions[language];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend || !sessionId || sending) return;

    setInput("");
    setImageFile(null);
    setImagePreview(null);
    setSending(true);

    const supabase = createClient();

    // Save user message
    const metadata: Record<string, any> = { language };
    if (imagePreview) {
      metadata.image = imagePreview;
    }

    const { data: userMessage } = await supabase
      .from("messages")
      .insert({
        session_id: sessionId,
        role: "user",
        content: textToSend,
        metadata: Object.keys(metadata).length > 0 ? metadata : null,
      })
      .select()
      .single();

    if (userMessage) {
      addMessage(userMessage);
    }

    // Call AI API
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          sessionId,
          language,
        }),
      });

      const data = await response.json();

      if (data.response) {
        const { data: assistantMessage } = await supabase
          .from("messages")
          .insert({
            session_id: sessionId,
            role: "assistant",
            content: data.response,
            metadata: data.action || { type: "none" },
          })
          .select()
          .single();

        if (assistantMessage) {
          addMessage(assistantMessage);
        }
      }
    } catch (error) {
      console.error("Error calling AI:", error);
    }

    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickAction = (value: string) => {
    handleSend(value);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const placeholderText = isRTL
    ? "اكتب رسالتك هنا..."
    : "Type your message here...";

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50/50 to-white">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-8">
        <div className="space-y-8 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-200">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {isRTL ? "مرحباً! كيف يمكنني مساعدتك؟" : "Hi there! How can I help?"}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                {isRTL 
                  ? "أخبرني عن متجرك وسأساعدك في إعداد الفئات والمنتجات بذكاء"
                  : "Tell me about your store and I'll help you set up categories and products intelligently"}
              </p>
            </div>
          )}
          {messages.map((message) => (
            <div key={message.id} className="animate-in fade-in duration-500">
              <MessageBubble
                role={message.role}
                content={message.content}
                metadata={message.metadata}
                createdAt={message.created_at}
              />
              {message.metadata && 
               typeof message.metadata === 'object' && 
               !Array.isArray(message.metadata) &&
               message.metadata.type === "suggest_categories" && (
                <CategorySuggestionCard
                  categories={(message.metadata.data as { categories: any[] }).categories}
                  sessionId={sessionId}
                />
              )}
              {message.metadata && 
               typeof message.metadata === 'object' && 
               !Array.isArray(message.metadata) &&
               message.metadata.type === "preview_product" && (
                <ProductPreviewCard
                  product={message.metadata.data as any}
                  sessionId={sessionId}
                />
              )}
              {message.metadata && 
               typeof message.metadata === 'object' && 
               !Array.isArray(message.metadata) &&
               message.metadata.type === "coupon" && (
                <CouponCard
                  coupon={message.metadata.data as any}
                  sessionId={sessionId}
                />
              )}
            </div>
          ))}
          {sending && <TypingIndicator isTyping={true} />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto">
          {/* Quick Action Chips */}
          {messages.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center" dir={isRTL ? "rtl" : "ltr"}>
              {actions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.value)}
                  disabled={sending}
                  className="px-4 py-2 bg-white hover:bg-gradient-to-r hover:from-violet-50 hover:to-blue-50 text-slate-600 hover:text-violet-700 text-sm rounded-full transition-all border border-slate-200 hover:border-violet-200 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-24 w-auto rounded-xl object-cover border-2 border-slate-200 shadow-sm"
              />
              <button
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            {/* Image Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={sending}
              variant="outline"
              className="h-14 w-14 rounded-2xl border-slate-200 hover:bg-slate-50 flex-shrink-0 p-0 shadow-sm"
            >
              <ImageIcon className="w-5 h-5 text-slate-500" />
            </Button>

            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholderText}
                className="min-h-[100px] max-h-[200px] rounded-2xl border-slate-200 focus:border-violet-400 focus:ring-violet-400/20 resize-none pr-12 py-4 px-5 shadow-sm text-slate-700 placeholder:text-slate-400"
                dir={isRTL ? "rtl" : "ltr"}
              />
              <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
                {input.length > 0 && `${input.length}`}
              </div>
            </div>
            <Button
              onClick={() => handleSend()}
              disabled={(!input.trim() && !imagePreview) || sending || !sessionId}
              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 hover:from-violet-600 hover:via-purple-600 hover:to-blue-600 text-white p-0 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200 transition-all hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-3 text-center font-medium">
            {isRTL
              ? "اضغط Enter للإرسال، Shift+Enter للسطر الجديد"
              : "Press Enter to send, Shift+Enter for new line"}
          </p>
        </div>
      </div>
    </div>
  );
}
