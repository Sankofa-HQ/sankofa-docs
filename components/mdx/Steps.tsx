import { Children, type ReactNode, isValidElement } from "react";

type LegacyStep = { title: string; body: string };

/** New, MDX-friendly Steps with <Step> children. */
export function Steps({
  children,
  // Legacy prop preserved for migration: <Steps steps={[{title, body}]} />
  steps,
}: {
  children?: ReactNode;
  steps?: LegacyStep[];
}) {
  const items: ReactNode[] = [];

  if (steps && steps.length > 0) {
    for (const s of steps) {
      items.push(
        <Step key={s.title} title={s.title}>
          {s.body}
        </Step>
      );
    }
  } else {
    Children.forEach(children, (child) => {
      if (isValidElement(child)) items.push(child);
    });
  }

  return <ol className="docs-steps">{items}</ol>;
}

export function Step({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="docs-step">
      <p className="docs-step-title">{title}</p>
      <div className="docs-step-body">{children}</div>
    </li>
  );
}

/** Backwards-compat alias used by older MDX files. Will be retired in Phase 4. */
export const StepList = Steps;
