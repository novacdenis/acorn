"use server";

import type { CreateCategoryBody, CreateTransactionBody } from "../types";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getAllCategories() {
  const supabase = createClient();
  const response = await supabase.from("categories").select("*");

  if (response.error) {
    throw new Error(response.error.message);
  }

  revalidatePath("/data-hub", "page");

  return response.data;
}

export async function createCategory(data: CreateCategoryBody) {
  const supabase = createClient();

  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const response = await supabase
    .from("categories")
    .insert({
      name: data.name,
      color: data.color,
      aliases: data.aliases,
      user_id: user.data.user.id,
    })
    .select()
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function createTransaction(data: CreateTransactionBody) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const response = await supabase
    .from("transactions")
    .insert({
      description: data.description,
      category_id: data.category_id,
      user_id: user.data.user.id,
      amount: data.amount,
      timestamp: data.timestamp.toISOString(),
    })
    .select()
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
