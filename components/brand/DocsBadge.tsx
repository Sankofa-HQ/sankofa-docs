export function DocsBadge() {
  // Theme-aware colors come from CSS vars defined per [data-theme] so this
  // component is a pure server-renderable element with no client-only state —
  // avoids hydration mismatches when dark mode is active on first paint.
  return (
    <span
      style={{
        font: "500 10px/14px var(--font-mono)",
        letterSpacing: "0.06em",
        padding: "2px 6px",
        borderRadius: 4,
        background: "var(--nav-border)",
        color: "var(--page-fg-soft)",
        marginLeft: 4,
      }}
    >
      DOCS
    </span>
  );
}
