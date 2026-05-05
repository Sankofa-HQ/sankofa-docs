"use client";

import {
  Children,
  isValidElement,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

type TabProps = { value: string; label: string; children: ReactNode };

export function Tab(_props: TabProps) {
  // Rendered by parent <Tabs>.
  return null;
}

function isTab(node: ReactNode): node is ReactElement<TabProps> {
  return (
    isValidElement(node) &&
    typeof (node as ReactElement<TabProps>).props.value === "string"
  );
}

export function Tabs({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue?: string;
}) {
  const tabs = useMemo(() => {
    const out: TabProps[] = [];
    Children.forEach(children, (child) => {
      if (isTab(child)) out.push(child.props);
    });
    return out;
  }, [children]);

  const [active, setActive] = useState(defaultValue ?? tabs[0]?.value ?? "");

  return (
    <div className="docs-tabs">
      <div role="tablist" className="docs-tabs-list">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={active === t.value}
            className={`docs-tabs-trigger${active === t.value ? " is-active" : ""}`}
            onClick={() => setActive(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.value}
          role="tabpanel"
          hidden={active !== t.value}
          className={`docs-tabs-panel${active === t.value ? " is-active" : ""}`}
        >
          {t.children}
        </div>
      ))}
    </div>
  );
}
