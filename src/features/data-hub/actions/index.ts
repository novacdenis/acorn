"use server";

import type {
  CategoriesQuery,
  Category,
  CreateCategoryBody,
  CreateTransactionBody,
  Transaction,
  TransactionsQuery,
} from "../types";
import type { PaginatedResponse } from "@/types";

import { createClient } from "@/lib/supabase/server";

export async function getAllCategories(
  query?: CategoriesQuery
): Promise<PaginatedResponse<Category>> {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const request = supabase.from("categories").select().eq("user_id", user.data.user.id);
  const { filter, page = 1, take = 10, orderBy, orderDirection } = query ?? {};

  if (filter) {
    request.ilike("name", `%${filter}%`);
  }
  if (orderBy && orderDirection) {
    request.order(orderBy, { ascending: orderDirection === "asc" });
  }
  request.range((page - 1) * take, page * take - 1);

  const response = await request;

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    data: response.data,
    meta: {
      page,
      take,
      total: response.count ?? response.data.length,
    },
  };
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

export async function updateCategory(id: number, data: Partial<CreateCategoryBody>) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const response = await supabase
    .from("categories")
    .update({
      name: data.name,
      color: data.color,
      aliases: data.aliases,
    })
    .match({ id })
    .eq("user_id", user.data.user.id)
    .select()
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function deleteCategory(id: number) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const response = await supabase
    .from("categories")
    .delete()
    .match({ id })
    .eq("user_id", user.data.user.id)
    .select()
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function getAllTransactions(
  query?: TransactionsQuery
): Promise<PaginatedResponse<Transaction>> {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const request = supabase
    .from("transactions")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("user_id", user.data.user.id);
  const { filter, page = 1, take = 10, orderBy, orderDirection } = query ?? {};

  if (filter) {
    request.ilike("description", `%${filter}%`);
  }
  if (orderBy && orderDirection) {
    request.order(orderBy, { ascending: orderDirection === "asc" });
  }
  request.range((page - 1) * take, page * take - 1);

  const response = await request;

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    data: response.data,
    meta: {
      page,
      take,
      total: response.count ?? response.data.length,
    },
  };
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
    .select("*, category:categories(*)")
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function updateTransaction(id: number, data: Partial<CreateTransactionBody>) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const response = await supabase
    .from("transactions")
    .update({
      description: data.description,
      category_id: data.category_id,
      amount: data.amount,
      timestamp: data.timestamp?.toISOString(),
    })
    .match({ id })
    .eq("user_id", user.data.user.id)
    .select("*, category:categories(*)")
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function deleteTransaction(id: number) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();

  if (user.error) {
    throw new Error(user.error.message);
  }

  const response = await supabase
    .from("transactions")
    .delete()
    .match({ id })
    .eq("user_id", user.data.user.id)
    .select("*, category:categories(*)")
    .single();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
}
