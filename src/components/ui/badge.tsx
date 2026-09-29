import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "teal" | "warn" | "danger" | "green";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-md font-medium font-mono uppercase tracking-wider",
          {
            "px-2.5 py-0.5 text-xs": size === "md",
            "px-2 py-0.5 text-[10px]": size === "sm",
          },
          {
            "bg-teal/10 text-teal border border-teal/25": variant === "teal",
            // ...restantes variantes iguais
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
