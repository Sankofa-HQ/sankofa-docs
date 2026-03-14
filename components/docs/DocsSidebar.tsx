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
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                {section.title}
              </p>
              <p className="mt-1 text-sm text-slate-500">{section.description}</p>
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const active = currentHref === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-2xl border px-3 py-3 transition-colors ${
                      active
                        ? "border-rose-200 bg-white text-slate-950 shadow-sm"
                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{item.title}</span>
                      {item.badge ? <DocBadge badge={item.badge} /> : null}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
