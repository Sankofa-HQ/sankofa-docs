"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        width: 56,
        height: 28,
        borderRadius: 999,
        padding: 3,
        border: "none",
        cursor: "pointer",
        background: dark ? "#2B303B" : "#EBEBEB",
        position: "relative",
        transition: "background 240ms ease-out",
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: dark ? "#0E1014" : "#FFFFFF",
          boxShadow: dark
            ? "0 1px 3px rgba(0,0,0,0.4)"
            : "0 1px 3px rgba(0,0,0,0.15)",
          transform: dark ? "translateX(28px)" : "translateX(0)",
          transition: "transform 240ms cubic-bezier(0.16,1,0.3,1)",
          display: "grid",
          placeItems: "center",
          color: dark ? "#FFD268" : "#FA7319",
          fontSize: 12,
        }}
      >
        {dark ? "☾" : "☀"}
      </div>
    </button>
  );
}
