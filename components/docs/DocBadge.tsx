import type { DocBadge as DocBadgeType } from "@/lib/docs";

const badgeClasses: Record<DocBadgeType, string> = {
  Official: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Custom: "bg-sky-50 text-sky-700 ring-sky-200",
  Enterprise: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function DocBadge({
  badge,
  scale = 1,
}: {
  badge: DocBadgeType;
  scale?: number;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] ring-1 ring-inset ${badgeClasses[badge]}`}
      style={{ transform: `scale(${scale})`, transformOrigin: "right center" }}
    >
      {badge}
    </span>
  );
}
