import * as React from "react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/utils";

const Textarea = React.forwardRef<
  React.ElementRef<typeof TextareaAutosize>,
  React.ComponentPropsWithoutRef<typeof TextareaAutosize>
>(({ className, ...props }, ref) => {
  return (
    <TextareaAutosize
      className={cn(
        "flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
