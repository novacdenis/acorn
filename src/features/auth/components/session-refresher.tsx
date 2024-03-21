"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";

export const SessionRefresher: React.FC = () => {
  const supabase = createClient();

  React.useEffect(() => {
    supabase.auth.startAutoRefresh();
    return () => {
      supabase.auth.stopAutoRefresh();
    };
  }, [supabase.auth]);

  return null;
};
