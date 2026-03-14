import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { headingId } from "@/lib/docs";
import { Callout } from "@/components/mdx/Callout";
import { StepList } from "@/components/mdx/StepList";
import { ApiFieldTable } from "@/components/mdx/ApiFieldTable";
import { MethodSignature } from "@/components/mdx/MethodSignature";
import { CodeTabs } from "@/components/mdx/CodeTabs";
import { DocBadge } from "@/components/docs/DocBadge";

function flattenText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(flattenText).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    return flattenText((children as { props: { children?: ReactNode } }).props.children);
  }

  return "";
}

function HeadingOne({
  children,
  ...props
}: ComponentPropsWithoutRef<"h1">) {
  const id = props.id ?? headingId(flattenText(children));

  return (
    <h1
      id={id}
      className="mt-8 font-display text-4xl font-semibold tracking-tight text-slate-950"
      {...props}
    >
      {children}
    </h1>
  );
}

function HeadingTwo({
  children,
  ...props
}: ComponentPropsWithoutRef<"h2">) {
  const id = props.id ?? headingId(flattenText(children));

  return (
    <h2
      id={id}
      className="mt-14 scroll-mt-28 font-display text-3xl font-semibold tracking-tight text-slate-950"
      {...props}
    >
      {children}
    </h2>
  );
}

function HeadingThree({
  children,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  const id = props.id ?? headingId(flattenText(children));

  return (
    <h3
      id={id}
      className="mt-10 scroll-mt-28 font-display text-2xl font-semibold tracking-tight text-slate-950"
      {...props}
    >
      {children}
    </h3>
  );
}

function HeadingFour({
  children,
  ...props
}: ComponentPropsWithoutRef<"h4">) {
  const id = props.id ?? headingId(flattenText(children));

  return (
    <h4
      id={id}
      className="mt-8 scroll-mt-28 font-display text-xl font-semibold text-slate-950"
      {...props}
    >
      {children}
    </h4>
  );
}

export const mdxComponents = {
  h1: HeadingOne,
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour,
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-5 text-base leading-8 text-slate-600" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-5 list-disc space-y-3 pl-6 text-base leading-8 text-slate-600" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-5 list-decimal space-y-3 pl-6 text-base leading-8 text-slate-600" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} />,
  a: ({
    href = "#",
    ...props
  }: ComponentPropsWithoutRef<"a">) =>
    href.startsWith("/") ? (
      <Link
        href={href}
        className="font-medium text-rose-700 underline decoration-rose-200 underline-offset-4 transition-colors hover:text-rose-800"
        {...props}
      />
    ) : (
      <a
        href={href}
        className="font-medium text-rose-700 underline decoration-rose-200 underline-offset-4 transition-colors hover:text-rose-800"
        {...props}
      />
    ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 border-l-4 border-rose-200 bg-rose-50/60 px-5 py-4 text-base leading-8 text-slate-700"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-slate-200" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto">
      <table className="min-w-full overflow-hidden rounded-[1.5rem] border border-slate-200" {...props} />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-slate-50" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400" {...props} />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-t border-slate-200 px-4 py-4 text-sm leading-7 text-slate-600" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="docs-scrollbar my-8 overflow-x-auto rounded-[1.5rem] bg-slate-950 p-5 text-sm text-slate-100" {...props} />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) =>
    className ? (
      <code className={className} {...props} />
    ) : (
      <code
        className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.92em] text-slate-900"
        {...props}
      />
    ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-slate-950" {...props} />
  ),
  Callout,
  StepList,
  ApiFieldTable,
  MethodSignature,
  CodeTabs,
  FeatureBadge: DocBadge,
};
