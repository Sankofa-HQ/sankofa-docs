"use client";

import { useState, type ReactNode } from "react";

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="docs-accordion">{children}</div>;
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="docs-accordion-item">
      <button
        type="button"
        className="docs-accordion-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span aria-hidden style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {open ? "−" : "+"}
        </span>
      </button>
      <div className="docs-accordion-content" hidden={!open}>
        {children}
      </div>
    </div>
  );
}
