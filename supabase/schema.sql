-- LaunchKit Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'ar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table (connected stores)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('zid', 'salla', 'other')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  store_name TEXT NOT NULL,
  store_domain TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Setup sessions table (chat sessions)
CREATE TABLE IF NOT EXISTS setup_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  current_step TEXT DEFAULT 'business' CHECK (current_step IN ('business', 'categories', 'products', 'marketing')),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (chat history)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES setup_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table (created categories)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES setup_sessions(id) ON DELETE CASCADE,
  platform_id TEXT,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  parent_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'synced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table (created products)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES setup_sessions(id) ON DELETE CASCADE,
  platform_id TEXT,
  category_id UUID REFERENCES categories(id),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  sku TEXT,
  barcode TEXT,
  weight DECIMAL(10,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'synced')),
  images TEXT[],
  variants JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_setup_sessions_store_id ON setup_sessions(store_id);
CREATE INDEX IF NOT EXISTS idx_messages_session_id ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_categories_session_id ON categories(session_id);
CREATE INDEX IF NOT EXISTS idx_products_session_id ON products(session_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't block user creation
  RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow service role and triggers to access all profiles
CREATE POLICY "Service role can access all profiles"
  ON profiles FOR ALL
  TO service_role, postgres
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to insert their own profile (for manual creation if needed)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Stores policies
CREATE POLICY "Users can view own stores"
  ON stores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stores"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stores"
  ON stores FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stores"
  ON stores FOR DELETE
  USING (auth.uid() = user_id);

-- Setup sessions policies
CREATE POLICY "Users can view own sessions"
  ON setup_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = setup_sessions.store_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own sessions"
  ON setup_sessions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = setup_sessions.store_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own sessions"
  ON setup_sessions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM stores
      WHERE stores.id = setup_sessions.store_id
      AND stores.user_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = messages.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = messages.session_id
      AND stores.user_id = auth.uid()
    )
  );

-- Categories policies
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = categories.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = categories.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = categories.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = categories.session_id
      AND stores.user_id = auth.uid()
    )
  );

-- Products policies
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = products.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = products.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = products.session_id
      AND stores.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM setup_sessions
      JOIN stores ON stores.id = setup_sessions.store_id
      WHERE setup_sessions.id = products.session_id
      AND stores.user_id = auth.uid()
    )
  );
