import Link from "next/link";
import { DocBadge } from "@/components/docs/DocBadge";
import { getSidebarSections } from "@/lib/docs";

export function DocsSidebar({ currentHref }: { currentHref: string }) {
  const sections = getSidebarSections();

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] overflow-y-auto pr-2 lg:block">
      <nav aria-label="Sidebar" className="space-y-7">
        {sections.map((section) => (
          <div key={section.key}>
            <div className="mb-2 px-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                {section.title}
              </p>
            </div>

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = currentHref === item.href;

                return (
                  <div key={item.href} className="space-y-0.5">
                    <Link
                      href={item.href}
                      className={`group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                          : "text-slate-600 hover:bg-white hover:text-slate-950"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      {item.badge ? <DocBadge badge={item.badge} scale={0.8} /> : null}
                    </Link>

                    {active && item.headings && item.headings.length > 0 && (
                      <div className="ml-4 mt-1 flex flex-col border-l border-slate-200 py-1">
                        {item.headings
                          .filter((h) => h.depth === 2)
                          .map((heading) => (
                            <Link
                              key={heading.id}
                              href={`#${heading.id}`}
                              className="px-4 py-1.5 text-[13px] text-slate-500 transition-colors hover:text-slate-950"
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
      </nav>
    </aside>
  );
}
