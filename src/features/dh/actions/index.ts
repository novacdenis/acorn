"use server";

import type { CreateTransactionBody } from "../types";

import { createClient } from "@/lib/supabase/server";

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
