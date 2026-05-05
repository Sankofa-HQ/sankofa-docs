import type { ReactNode } from "react";

type Tone = "brand" | "info" | "success" | "warning" | "danger" | "neutral";

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span className="docs-badge" data-tone={tone}>
      {children}
    </span>
  );
}

export function SDKBadge({ platform }: { platform: string }) {
  return <Badge tone="brand">{platform}</Badge>;
}

export function SinceBadge({ version }: { version: string }) {
  return <Badge tone="info">since {version}</Badge>;
}

export function DeprecatedBadge({ replacedBy }: { replacedBy?: string }) {
  return (
    <Badge tone="danger">
      deprecated{replacedBy ? ` — use ${replacedBy}` : ""}
    </Badge>
  );
}
