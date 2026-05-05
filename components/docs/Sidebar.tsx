"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SidebarSection } from "@/lib/content";

const STORAGE_KEY = "sankofa-docs-sidebar-collapsed";

/** Identifier for a collapsible group. Default-titled groups (no title) live under
 *  the section key; titled groups are keyed by `${sectionKey}::${title}`. */
function groupId(sectionKey: string, title: string | undefined): string {
  return title ? `${sectionKey}::${title}` : `${sectionKey}::__intro__`;
}

function normalize(p: string | null | undefined): string {
  if (!p) return "/";
  const stripped = p.split(/[?#]/)[0].replace(/\/$/, "");
  return stripped || "/";
}

export function Sidebar({ sidebar }: { sidebar: SidebarSection }) {
  const pathname = normalize(usePathname());

  // Auto-expand any group containing the current page.
  const initiallyExpanded = useMemo(() => {
    const ids = new Set<string>();
    for (const g of sidebar.groups) {
      // Always expand untitled "intro" groups so the section header isn't a wasted click.
      if (!g.title) ids.add(groupId(sidebar.key, g.title));
      if (g.items.some((it) => it.href === pathname)) {
        ids.add(groupId(sidebar.key, g.title));
      }
    }
    // If nothing matched (we landed on the section overview directly), expand
    // the first titled group too — gives the reader something to scan.
    if (ids.size === 0 && sidebar.groups[0]) {
      ids.add(groupId(sidebar.key, sidebar.groups[0].title));
    }
    return ids;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebar.key, pathname]);

  const [expanded, setExpanded] = useState<Set<string>>(initiallyExpanded);

  // Hydrate persisted state on mount, but always honor "current page is visible".
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const persisted = new Set<string>(JSON.parse(raw));
      // Force-expand the group containing the current page.
      for (const g of sidebar.groups) {
        if (g.items.some((it) => it.href === pathname)) {
          persisted.add(groupId(sidebar.key, g.title));
        }
        if (!g.title) persisted.add(groupId(sidebar.key, g.title));
      }
      setExpanded(persisted);
    } catch {
      // ignore — default state is fine
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebar.key, pathname]);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <aside className="docs-sidebar" aria-label={`${sidebar.title} navigation`}>
      <p className="docs-sidebar-section-title">{sidebar.title}</p>

      {sidebar.groups.map((group) => {
        const id = groupId(sidebar.key, group.title);
        const open = expanded.has(id);
        const isHeaderless = !group.title;
        const hasActive = group.items.some((it) => it.href === pathname);

        return (
          <div key={id} className="docs-sidebar-group">
            {!isHeaderless ? (
              <button
                type="button"
                className="docs-sidebar-group-trigger"
                onClick={() => toggle(id)}
                aria-expanded={open}
                aria-controls={`sidebar-${id}`}
                data-active={hasActive ? "true" : undefined}
              >
                <span className="docs-sidebar-group-title">{group.title}</span>
                <span className="docs-sidebar-group-chev" aria-hidden>
                  {open ? "−" : "+"}
                </span>
              </button>
            ) : null}

            {open || isHeaderless ? (
              <ul
                id={`sidebar-${id}`}
                className="docs-sidebar-list"
                style={isHeaderless ? undefined : { paddingLeft: 0 }}
              >
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  if (item.status === "planned") {
                    return (
                      <li key={item.href}>
                        <span
                          className="docs-sidebar-link is-planned"
                          aria-disabled="true"
                          title="Coming soon"
                        >
                          <span style={{ flex: 1 }}>{item.title}</span>
                          <span className="docs-sidebar-soon" aria-hidden>
                            soon
                          </span>
                        </span>
                      </li>
                    );
                  }
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className="docs-sidebar-link"
                      >
                        <span style={{ flex: 1 }}>{item.title}</span>
                        {item.badge ? (
                          <span className="docs-sidebar-badge">{item.badge}</span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        );
      })}
    </aside>
  );
}
