"use client";

import { useTheme } from "@/components/layout/ThemeProvider";

export function DocsBadge() {
  const { theme } = useTheme();
  const dark = theme === "dark";
  return (
    <span
      style={{
        font: "500 10px/14px var(--font-mono)",
        letterSpacing: "0.06em",
        padding: "2px 6px",
        borderRadius: 4,
        background: dark ? "rgba(255,255,255,0.06)" : "rgba(23,23,23,0.06)",
        color: "var(--page-fg-soft)",
        marginLeft: 4,
      }}
    >
      DOCS
    </span>
  );
}
