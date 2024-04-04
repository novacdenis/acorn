import React from "react";
import { cn } from "@/utils";

const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => (
    <section ref={ref} {...props}>
      {children}
    </section>
  )
);
Section.displayName = "Section";

const SectionHeader = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ children, ...props }, ref) => (
    <header ref={ref} {...props}>
      {children}
    </header>
  )
);
SectionHeader.displayName = "SectionHeader";

const SectionTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold md:text-xl", className)} {...props}>
      {children}
    </h2>
  )
);
SectionTitle.displayName = "SectionTitle";

const SectionDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-0.5 text-sm text-muted-foreground md:text-base", className)}
    {...props}
  >
    {children}
  </p>
));
SectionDescription.displayName = "SectionDescription";

const SectionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mt-5", className)} {...props}>
      {children}
    </div>
  )
);
SectionContent.displayName = "SectionContent";

const SectionFooter = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => (
    <footer ref={ref} className={cn("mt-5", className)} {...props}>
      {children}
    </footer>
  )
);
SectionFooter.displayName = "SectionFooter";

export { Section, SectionHeader, SectionTitle, SectionDescription, SectionContent, SectionFooter };
