"use client";

import * as React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

interface ButtonAsButtonProps
  extends ButtonBaseProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-600 text-white hover:bg-accent-500 border border-accent-600 hover:border-accent-500 shadow-sm shadow-accent-900/50 hover:shadow-accent-800/50",
  secondary:
    "bg-transparent text-navy-100 hover:text-white border border-navy-600 hover:border-navy-400 hover:bg-navy-800/50",
  ghost:
    "bg-transparent text-navy-300 hover:text-white border border-transparent hover:border-navy-700 hover:bg-navy-800/30",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-7 py-3.5 text-base gap-2.5",
};

const baseClasses =
  "inline-flex items-center justify-center font-display font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  { variant = "primary", size = "md", className = "", children, ...props },
  ref
) {
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  if ("href" in props && props.href !== undefined) {
    const { href, target, rel, ...rest } = props as ButtonAsLinkProps;
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className={classes}
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...(rest as Record<string, unknown>)}
      >
        {children}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonAsButtonProps;
  return (
    <button
      className={classes}
      ref={ref as React.Ref<HTMLButtonElement>}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
