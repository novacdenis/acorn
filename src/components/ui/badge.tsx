import React from "react";
import { cn } from "@/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "flex min-h-5 w-fit min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-medium shadow-md",
  {
    variants: {
      color: {
        blue: "bg-blue-600 text-white",
        green: "bg-green-600 text-white",
        red: "bg-red-600 text-white",
        yellow: "bg-yellow-600 text-white",
      },
    },
    defaultVariants: {
      color: "blue",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color, className, ...props }, ref) => {
    return <span ref={ref} className={cn(badgeVariants({ color, className }))} {...props} />;
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
