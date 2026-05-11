import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { headingId } from "@/lib/content";
import { Callout } from "./Callout";
import { CodeBlock } from "./CodeBlock";
import { CodeGroup, CodeGroupItem } from "./CodeGroup";
import { ParameterTable } from "./ParameterTable";
import { EndpointBadge } from "./EndpointBadge";
import { RequestResponse } from "./RequestResponse";
import { Steps, Step, StepList } from "./Steps";
import { Tabs, Tab } from "./Tabs";
import { Accordion, AccordionItem } from "./Accordion";
import { Card, CardGrid } from "./Card";
import { PlatformMatrix } from "./PlatformMatrix";
import { Badge, SDKBadge, SinceBadge, DeprecatedBadge } from "./Badges";
import { CodeTabs } from "./CodeTabs";
import { MethodSignature } from "./MethodSignature";
import { DocLink } from "./DocLink";

function flatten(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(flatten).join("");
  if (children && typeof children === "object" && "props" in children) {
    return flatten((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function H({ depth, children, ...props }: ComponentPropsWithoutRef<"h2"> & { depth: 1 | 2 | 3 | 4 }) {
  const Tag = (`h${depth}` as unknown) as "h1";
  const id = props.id ?? headingId(flatten(children));
  return (
    <Tag id={id} {...props}>
      {children}
    </Tag>
  );
}

/**
 * Pre + code from MDX gets routed to <CodeBlock>. Inline code keeps the default
 * (rendered by .prose styles).
 */
function Pre({ children }: ComponentPropsWithoutRef<"pre">) {
  // children is a single <code> element produced by MDX/remark for fenced blocks.
  if (
    children &&
    typeof children === "object" &&
    "props" in children
  ) {
    const code = (children as { props: { className?: string; children?: ReactNode } }).props;
    const lang = (code.className ?? "").replace(/^language-/, "") || "text";
    const text = typeof code.children === "string" ? code.children : flatten(code.children);
    return <CodeBlock code={text} lang={lang} />;
  }
  return <pre>{children}</pre>;
}

export const mdxComponents = {
  h1: (p: ComponentPropsWithoutRef<"h2">) => <H depth={1} {...p} />,
  h2: (p: ComponentPropsWithoutRef<"h2">) => <H depth={2} {...p} />,
  h3: (p: ComponentPropsWithoutRef<"h3">) => <H depth={3} {...p} />,
  h4: (p: ComponentPropsWithoutRef<"h4">) => <H depth={4} {...p} />,
  a: ({ href, children, ...rest }: ComponentPropsWithoutRef<"a">) => (
    <DocLink href={href} {...rest}>
      {children}
    </DocLink>
  ),
  pre: Pre,
  table: (p: ComponentPropsWithoutRef<"table">) => (
    <div className="prose-table-wrap">
      <table {...p} />
    </div>
  ),
  // Custom MDX components surfaced to authors:
  Callout,
  CodeBlock,
  CodeGroup,
  CodeGroupItem,
  ParameterTable,
  EndpointBadge,
  RequestResponse,
  Steps,
  Step,
  StepList,
  Tabs,
  Tab,
  Accordion,
  AccordionItem,
  Card,
  CardGrid,
  PlatformMatrix,
  Badge,
  SDKBadge,
  SinceBadge,
  DeprecatedBadge,
  // Legacy compat (used by current MDX during migration):
  CodeTabs,
  MethodSignature,
  FeatureBadge: SDKBadge,
};
