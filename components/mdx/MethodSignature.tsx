export function MethodSignature({
  name,
  signature,
  description,
  returns,
  notes,
}: {
  name: string;
  signature: string;
  description: string;
  returns?: string;
  notes?: string;
}) {
  return (
    <div className="my-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
      <div className="flex flex-wrap items-center gap-3">
        <p className="font-display text-2xl font-semibold text-slate-950">
          {name}
        </p>
      </div>
      <pre className="mt-4 overflow-x-auto rounded-[1.25rem] bg-slate-950 p-4 text-sm text-slate-100">
        <code>{signature}</code>
      </pre>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
      {returns ? (
        <p className="mt-3 text-sm leading-7 text-slate-600">
          <strong className="text-slate-950">Returns:</strong> {returns}
        </p>
      ) : null}
      {notes ? (
        <p className="mt-2 text-sm leading-7 text-slate-600">
          <strong className="text-slate-950">Notes:</strong> {notes}
        </p>
      ) : null}
    </div>
  );
}
