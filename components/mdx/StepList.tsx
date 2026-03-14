export function StepList({
  steps,
}: {
  steps: Array<{ title: string; body: string }>;
}) {
  return (
    <ol className="my-8 space-y-4">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4"
        >
          <div className="flex gap-4">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white font-display font-semibold text-slate-950 ring-1 ring-slate-200">
              {index + 1}
            </span>
            <div>
              <p className="font-semibold text-slate-950">{step.title}</p>
              <p className="mt-1 text-sm leading-7 text-slate-600">{step.body}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
