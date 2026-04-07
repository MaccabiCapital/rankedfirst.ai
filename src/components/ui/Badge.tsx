import * as React from "react";

type BadgeVariant = "default" | "active" | "beta" | "new" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-navy-800 text-navy-200 border-navy-700",
  active: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
  beta: "bg-accent-950/40 text-accent-400 border-accent-800/40",
  new: "bg-purple-950/40 text-purple-400 border-purple-800/40",
  muted: "bg-navy-900 text-navy-400 border-navy-800",
};

const dotClasses: Record<BadgeVariant, string> = {
  default: "bg-navy-400",
  active: "bg-emerald-400",
  beta: "bg-accent-400",
  new: "bg-purple-400",
  muted: "bg-navy-500",
};

export function Badge({
  variant = "default",
  dot = false,
  pulse = false,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {dot && (
        <span className="relative inline-flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={[
                "absolute inline-flex h-full w-full rounded-full opacity-75",
                dotClasses[variant],
                "animate-ping",
              ].join(" ")}
            />
          )}
          <span
            className={[
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              dotClasses[variant],
            ].join(" ")}
          />
        </span>
      )}
      {children}
    </span>
  );
}
