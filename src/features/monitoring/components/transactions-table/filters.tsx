"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useDebouncedCallback } from "@/hooks";
import { cn } from "@/utils";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Filters: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const onSearch = useDebouncedCallback((search: string) => {
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  return (
    <div className="flex items-center space-x-2">
      <fieldset className="relative flex flex-1 items-center">
        <Input
          type="text"
          inputMode="search"
          placeholder="Search..."
          autoComplete="off"
          className="pl-10"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => onSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-muted-foreground" />
      </fieldset>
      <Button size="icon" className="relative">
        <FunnelIcon className="h-5 w-5" />
        <span
          className={cn(
            "pointer-events-none absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full",
            "-translate-y-1.5 translate-x-1.5 bg-blue-600 text-xs font-medium text-white shadow-md"
          )}
        >
          3
        </span>
      </Button>
    </div>
  );
};
