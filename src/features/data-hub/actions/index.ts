"use server";

import type { ExtractedTransaction } from "../types";

import { createClient } from "@/lib/supabase/server";

export async function createTransaction(transaction: ExtractedTransaction) {
  const supabase = createClient();
  const category = await supabase
    .from("categories")
    .select()
    .contains("aliases", transaction.data.category);

  if (category.error) {
    return { status: "error", error: "" };
  }
}
