"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DocBadge } from "@/components/docs/DocBadge";
import type { DocNavItem, DocSection } from "@/lib/docs";

type SidebarSection = DocSection & { items: DocNavItem[] };

export function DocsMobileNav({
  currentHref,
  sections,
}: {
  currentHref: string;
  sections: SidebarSection[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm lg:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-4 w-4" />
        Browse docs
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/35 lg:hidden">
          <div className="h-full w-[86vw] max-w-sm overflow-y-auto border-r border-slate-200 bg-[#f3f4f6] px-4 py-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                Documentation
              </span>
              <button
                type="button"
                className="inline-flex rounded-full border border-slate-200 bg-white p-2 text-slate-600"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              {sections.map((section) => (
                <div key={section.key}>
                  <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = currentHref === item.href;

                      return (
                        <div key={item.href} className="space-y-0.5">
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                              active
                                ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                                : "text-slate-600"
                            }`}
                          >
                            <span className="truncate">{item.title}</span>
                            {item.badge ? (
                              <DocBadge badge={item.badge} scale={0.8} />
                            ) : null}
                          </Link>

                          {active && item.headings && item.headings.length > 0 && (
                            <div className="ml-4 mt-1 flex flex-col border-l border-slate-200 py-1">
                              {item.headings
                                .filter((h) => h.depth === 2)
                                .map((heading) => (
                                  <Link
                                    key={heading.id}
                                    href={`#${heading.id}`}
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-1.5 text-[13px] text-slate-500 transition-colors"
                                  >
                                    {heading.text}
                                  </Link>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
