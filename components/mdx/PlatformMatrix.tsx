type State = "yes" | "no" | "partial";

const PLATFORMS = ["Web", "Flutter", "RN", "iOS", "Android", "Node", "Go", "Python"] as const;
type Platform = (typeof PLATFORMS)[number];

type Row = {
  feature: string;
  support: Partial<Record<Platform, State>>;
};

export function PlatformMatrix({ rows }: { rows: Row[] }) {
  return (
    <div className="docs-matrix">
      <div className="docs-matrix-row is-header">
        <div>Feature</div>
        {PLATFORMS.map((p) => (
          <div key={p} className="docs-matrix-cell">
            {p}
          </div>
        ))}
      </div>
      {rows.map((row) => (
        <div key={row.feature} className="docs-matrix-row">
          <div>{row.feature}</div>
          {PLATFORMS.map((p) => {
            const state = row.support[p] ?? "no";
            return (
              <div key={p} className="docs-matrix-cell" data-state={state}>
                {state === "yes" ? "✓" : state === "partial" ? "◐" : "—"}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
