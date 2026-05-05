import { CodeBlock } from "./CodeBlock";

/** Legacy method signature renderer — keeps existing MDX rendering until those pages are rewritten. */
export function MethodSignature({
  language = "ts",
  code,
}: {
  language?: string;
  code: string;
}) {
  return <CodeBlock code={code} lang={language} hideLang />;
}
