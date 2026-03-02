import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg" | "xl";
}

const paddingMap = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
  xl: "p-16",
};

export default function GlassCard({
  children,
  className = "",
  padding = "lg",
}: GlassCardProps) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl ${paddingMap[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
