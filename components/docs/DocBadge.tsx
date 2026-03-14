import type { DocBadge as DocBadgeType } from "@/lib/docs";

const badgeClasses: Record<DocBadgeType, string> = {
  Official: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Custom: "bg-sky-50 text-sky-700 ring-sky-200",
  Enterprise: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function DocBadge({ badge }: { badge: DocBadgeType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] ring-1 ring-inset ${badgeClasses[badge]}`}
    >
      {badge}
    </span>
  );
}
