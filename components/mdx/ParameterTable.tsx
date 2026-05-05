import type { ReactNode } from "react";

export type Parameter = {
  name: string;
  type: string;
  required?: boolean;
  default?: string;
  since?: string;
  deprecated?: string;
  description: ReactNode;
};

export function ParameterTable({ params }: { params: Parameter[] }) {
  return (
    <div className="docs-params">
      {params.map((p) => (
        <div key={p.name} className="docs-params-row">
          <div className="docs-params-name">
            <code>{p.name}</code>
            <span className="docs-params-type">{p.type}</span>
            {p.required ? <span className="docs-params-required">Required</span> : null}
            {p.default ? (
              <span className="docs-params-type">default <code>{p.default}</code></span>
            ) : null}
            {p.since ? (
              <span className="docs-params-type">since <code>{p.since}</code></span>
            ) : null}
          </div>
          <div className="docs-params-desc">
            {p.deprecated ? (
              <p>
                <strong>Deprecated</strong> — {p.deprecated}.{" "}
              </p>
            ) : null}
            {p.description}
          </div>
        </div>
      ))}
    </div>
  );
}
