import type { ReactNode } from "react";

type Tone = "note" | "tip" | "warning" | "danger" | "success";

const ICONS: Record<Tone, string> = {
  note: "i",
  tip: "✓",
  warning: "!",
  danger: "✕",
  success: "✓",
};

export function Callout({
  tone = "note",
  title,
  children,
}: {
  tone?: Tone | "info";
  title?: string;
  children: ReactNode;
}) {
  // Map legacy "info" to "note"
  const normalized: Tone = tone === "info" ? "note" : tone;
  return (
    <aside className="docs-callout" data-tone={normalized}>
      <div className="docs-callout-icon" aria-hidden>
        {ICONS[normalized]}
      </div>
      <div className="docs-callout-body">
        {title ? <p className="docs-callout-title">{title}</p> : null}
        <div className="docs-callout-content">{children}</div>
      </div>
    </aside>
  );
}
