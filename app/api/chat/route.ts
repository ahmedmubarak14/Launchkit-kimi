import { NextRequest, NextResponse } from "next/server";

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, language } = await request.json();

    const systemPrompt = `You are LaunchKit AI, helping merchants set up their e-commerce stores.

RULES:
1. Detect user's language (Arabic or English) and respond in same language
2. Be concise - max 3 sentences
3. Always suggest the next step
4. For store content, generate BOTH Arabic and English versions
5. Confirm before creating anything

RESPONSE FORMAT (JSON):
{
  "message": "Your response text",
  "action": {
    "type": "none" | "suggest_categories" | "preview_product",
    "data": { ... }
  }
}

When suggesting categories, include:
{ "type": "suggest_categories", "data": { "categories": [{ "nameAr": "...", "nameEn": "...", "descriptionAr": "...", "descriptionEn": "..." }] }}

When previewing product, include:
{ "type": "preview_product", "data": { "nameAr": "...", "nameEn": "...", "descriptionAr": "...", "descriptionEn": "...", "price": 0, "sku": "...", "variants": [{ "name": "Size", "options": ["S", "M", "L"] }] }}`;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      // Fallback response if no API key
      return NextResponse.json({
        response:
          language === "ar"
            ? `شكراً لرسالتك: "${message}". أنا هنا لمساعدتك في إعداد متجرك!`
            : `Thanks for your message: "${message}". I'm here to help you set up your store!`,
        action: { type: "none" },
      });
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.content[0].text;

    // Try to parse JSON response
    let parsedResponse;
    try {
      // Extract JSON from the response (it might be wrapped in markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = {
          message: aiResponse,
          action: { type: "none" },
        };
      }
    } catch {
      parsedResponse = {
        message: aiResponse,
        action: { type: "none" },
      };
    }

    return NextResponse.json({
      response: parsedResponse.message,
      action: parsedResponse.action,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
