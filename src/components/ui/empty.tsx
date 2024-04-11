import React from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { cn } from "@/utils";

export const Empty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col items-center justify-center px-4 py-10", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Empty.displayName = "Empty";

export const EmptyIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <FolderPlusIcon
      ref={ref}
      className={cn("h-12 w-12 text-muted-foreground", className)}
      {...props}
    />
  )
);
EmptyIcon.displayName = "EmptyIcon";

export const EmptyTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn("mt-2 text-center text-sm font-medium", className)} {...props}>
    {children}
  </h3>
));
EmptyTitle.displayName = "EmptyTitle";

export const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-1 text-center text-sm text-muted-foreground", className)}
    {...props}
  />
));
EmptyDescription.displayName = "EmptyDescription";
