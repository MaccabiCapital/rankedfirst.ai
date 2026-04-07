import * as React from "react";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  centered = true,
  className = "",
  titleClassName = "",
}: SectionHeaderProps) {
  return (
    <div
      className={[
        "max-w-3xl",
        centered ? "mx-auto text-center" : "",
        className,
      ].join(" ")}
    >
      {label && (
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="h-px w-6 bg-accent-500 inline-block" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
            {label}
          </span>
          <span className="h-px w-6 bg-accent-500 inline-block" />
        </div>
      )}
      <h2
        className={[
          "font-display font-bold text-3xl sm:text-4xl md:text-[2.75rem] leading-tight text-white",
          titleClassName,
        ].join(" ")}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-navy-300 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
