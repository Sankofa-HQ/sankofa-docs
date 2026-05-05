"use client";

import {
  Children,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type CodeGroupItemProps = {
  /** Stable identifier — should match a value the user persists across pages, e.g. "web", "flutter". */
  tab: string;
  /** Display label for this tab. */
  label: string;
  children: ReactNode;
};

export function CodeGroupItem({ children }: CodeGroupItemProps) {
  // Wrapper exists so authors can write <CodeGroupItem tab="web" label="Web">...</CodeGroupItem>.
  // Rendered by parent CodeGroup; this component returns the children directly when invoked
  // outside a group (defensive — should not happen in practice).
  return <>{children}</>;
}

type CodeGroupItemElement = ReactElement<CodeGroupItemProps>;

const STORAGE_KEY = "sankofa-docs-pref-lang";

function isCodeGroupItem(node: ReactNode): node is CodeGroupItemElement {
  return (
    typeof node === "object" &&
    node !== null &&
    "props" in node &&
    typeof (node as { props?: { tab?: unknown } }).props?.tab === "string"
  );
}

export function CodeGroup({ children }: { children: ReactNode }) {
  const items = useMemo(() => {
    const out: { tab: string; label: string; node: ReactNode }[] = [];
    Children.forEach(children, (child) => {
      if (isCodeGroupItem(child)) {
        out.push({
          tab: child.props.tab,
          label: child.props.label,
          node: child.props.children,
        });
      }
    });
    return out;
  }, [children]);

  const [active, setActive] = useState<string>(() => items[0]?.tab ?? "");

  // Restore persisted preference on mount.
  useEffect(() => {
    if (items.length === 0) return;
    let preferred: string | null = null;
    try {
      preferred = localStorage.getItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    if (preferred && items.some((i) => i.tab === preferred)) {
      setActive(preferred);
    } else if (!active && items[0]) {
      setActive(items[0].tab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  function handleSelect(tab: string) {
    setActive(tab);
    try {
      localStorage.setItem(STORAGE_KEY, tab);
    } catch {
      // ignore
    }
  }

  if (items.length === 0) {
    return <div className="docs-codegroup-empty">No code samples available.</div>;
  }

  return (
    <div className="docs-codegroup">
      <div role="tablist" aria-label="Code language" className="docs-codegroup-tabs">
        {items.map((item) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            aria-selected={active === item.tab}
            className={`docs-codegroup-tab${active === item.tab ? " is-active" : ""}`}
            onClick={() => handleSelect(item.tab)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="docs-codegroup-panels">
        {items.map((item) => (
          <div
            key={item.tab}
            role="tabpanel"
            hidden={active !== item.tab}
            className={`docs-codegroup-panel${active === item.tab ? " is-active" : ""}`}
          >
            {item.node}
          </div>
        ))}
      </div>
    </div>
  );
}
