# LaunchKit - AI-Powered E-commerce Store Setup

LaunchKit helps merchants set up their online stores through natural conversation with AI. Instead of filling forms, users describe their business and the AI creates categories, products, and marketing configuration automatically.

## Features

- **AI Chat Interface**: Natural conversation to set up your store
- **Smart Categories**: AI-suggested category structures in Arabic and English
- **Product Generation**: AI-generated product listings with descriptions, prices, and variants
- **Marketing Setup**: Automatic SEO optimization and meta tags
- **Multi-language**: Full Arabic/English support with RTL layout
- **Zid Integration**: Connect and sync with Zid e-commerce platform

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui components
- Supabase for database and auth
- Zustand for state management
- Anthropic Claude API for AI chat

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account
- Zid Partner account (for store integration)
- Anthropic API key (for AI features)

### Installation

1. Clone the repository and navigate to the project:
```bash
cd my-app
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials.

3. Set up the database in Supabase SQL Editor using `supabase/schema.sql`

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `ZID_CLIENT_ID` | Zid OAuth client ID |
| `ZID_CLIENT_SECRET` | Zid OAuth client secret |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

## Project Structure

```
app/
├── (auth)/           # Login, signup pages
├── (dashboard)/       # Protected dashboard
├── api/             # API routes
components/
├── chat/            # Chat components
├── layout/          # Layout components
lib/                 # Utilities, store, database types
```

## License

MIT License
