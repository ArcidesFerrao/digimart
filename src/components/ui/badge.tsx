import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "teal" | "warn" | "danger" | "green";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium font-mono uppercase tracking-wider",
          {
            "bg-teal/10 text-teal border border-teal/25": variant === "teal",
            "bg-warn/10 text-warn border border-warn/25": variant === "warn",
            "bg-danger/10 text-danger border border-danger/25": variant === "danger",
            "bg-green/10 text-green border border-green/25": variant === "green",
            "bg-surface text-muted border border-border": variant === "default",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
