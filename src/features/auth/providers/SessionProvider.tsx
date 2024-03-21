"use client";

import React from "react";
import { createClient } from "@/lib/supabase/client";

export interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const supabase = createClient();

  React.useEffect(() => {
    supabase.auth.startAutoRefresh();
    return () => {
      supabase.auth.stopAutoRefresh();
    };
  }, [supabase.auth]);

  return <>{children}</>;
};
