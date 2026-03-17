import { AlertCircle, CheckCircle2, Info, ShieldAlert } from "lucide-react";

const iconMap = {
  info: Info,
  tip: Info,
  success: CheckCircle2,
  warning: ShieldAlert,
  note: AlertCircle,
} as const;

const toneMap = {
  info: "border-sky-200 bg-sky-50 text-sky-900",
  tip: "border-sky-200 bg-sky-50 text-sky-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  note: "border-slate-200 bg-slate-50 text-slate-900",
} as const;

export function Callout({
  title,
  tone = "info",
  children,
}: {
  title: string;
  tone?: keyof typeof iconMap;
  children: React.ReactNode;
}) {
  const Icon = iconMap[tone];

  return (
    <div className={`my-8 rounded-[1.5rem] border p-5 ${toneMap[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-white/70 p-2">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold">{title}</p>
          <div className="mt-2 text-sm leading-7 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
