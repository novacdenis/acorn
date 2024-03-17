import React from "react";
import { cn } from "@/utils";

const Transactions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("overflow-hidden rounded-2xl border border-primary/10", className)}
      {...props}
    />
  )
);
Transactions.displayName = "Transactions";

const TransactionsHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "transaction-template-area hidden h-12 gap-x-2.5 border-b border-primary/10 bg-primary/5 px-2 md:grid",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none invisible h-8 w-8"
        style={{ gridArea: "icon" }}
      />
      <p className="text-sm font-medium" style={{ gridArea: "description" }}>
        Description
      </p>
      <p className="text-sm font-medium" style={{ gridArea: "category" }}>
        Category
      </p>
      <p className="text-sm font-medium" style={{ gridArea: "amount" }}>
        Amount
      </p>
      <p className="text-sm font-medium" style={{ gridArea: "timestamp" }}>
        Timestamp
      </p>
    </div>
  )
);
TransactionsHeader.displayName = "TransactionsHeader";

const TransactionsList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("divide-y-primary/10 list-none divide-y", className)} {...props} />
  )
);
TransactionsList.displayName = "TransactionsList";

const TransactionItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        "transaction-template-area grid gap-x-2.5 gap-y-0.5 p-2.5 transition-colors active:bg-primary/10 md:p-2 md:hover:bg-primary/10",
        className
      )}
      {...props}
    />
  )
);
TransactionItem.displayName = "TransactionItem";

const TransactionItemIcon = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/10 bg-primary/5 md:h-8 md:w-8 md:rounded-xl",
        className
      )}
      style={{ gridArea: "icon", ...style }}
      {...props}
    />
  )
);
TransactionItemIcon.displayName = "TransactionItemIcon";

const TransactionItemDescription = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & { color: string }
>(({ color, className, style, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("flex items-center overflow-hidden text-sm", className)}
    style={{ gridArea: "description", ...style }}
    {...props}
  >
    <span
      className="block h-2.5 w-2.5 shrink-0 rounded-full bg-neutral-500"
      style={{ backgroundColor: color }}
    />
    <span className="ml-1 block truncate">{children}</span>
  </h3>
));
TransactionItemDescription.displayName = "TransactionItemDescription";

const TransactionItemAmount = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("justify-self-end text-sm md:justify-self-start", className)}
    style={{ gridArea: "amount", ...style }}
    {...props}
  />
));
TransactionItemAmount.displayName = "TransactionItemAmount";

const TransactionItemCategory = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, style, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground md:text-primary", className)}
    style={{ gridArea: "category", ...style }}
    {...props}
  />
));
TransactionItemCategory.displayName = "TransactionItemCategory";

const TransactionItemTimestamp = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, style, ...props }, ref) => (
  <time
    ref={ref}
    className={cn(
      "justify-self-end text-sm text-muted-foreground md:justify-self-start md:text-primary",
      className
    )}
    style={{ gridArea: "timestamp", ...style }}
    {...props}
  />
));
TransactionItemTimestamp.displayName = "TransactionItemTimestamp";

const TransactionsPagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-2.5", className)} {...props} />
));
TransactionsPagination.displayName = "TransactionsPagination";

export {
  Transactions,
  TransactionsHeader,
  TransactionsList,
  TransactionItem,
  TransactionItemIcon,
  TransactionItemDescription,
  TransactionItemAmount,
  TransactionItemCategory,
  TransactionItemTimestamp,
  TransactionsPagination,
};
