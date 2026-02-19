"use client";

import { createClient } from "./client";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  preferredLanguage?: "en" | "ar";
}

export interface LoginData {
  email: string;
  password: string;
}

// Sign up with email and password
export async function signUp({ email, password, name, preferredLanguage = "en" }: SignUpData) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        preferred_language: preferredLanguage,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
}

// Login with email and password
export async function login({ email, password }: LoginData) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

// Get current user
export async function getCurrentUser() {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

// Get current session
export async function getCurrentSession() {
  const supabase = createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return session;
}

// Sign out
export async function signOut() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// Reset password
export async function resetPassword(email: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    throw error;
  }

  return data;
}

// Update password
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }

  return data;
}
