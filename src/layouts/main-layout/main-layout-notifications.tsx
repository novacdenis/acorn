"use client";

import { BellIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

export const MainLayoutNotifications: React.FC = () => {
  return (
    <Button variant="outline" size="icon" className="relative h-8 w-8 rounded-full">
      <BellIcon className="h-5 w-5" />
      <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full bg-red-500">
        <span className="sr-only">Notifications</span>
      </span>
    </Button>
  );
};
