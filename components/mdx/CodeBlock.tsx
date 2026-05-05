import { getHighlighter, SHIKI_THEME } from "@/lib/shiki";
import { CopyButton } from "./CopyButton";

type Props = {
  code: string;
  lang?: string;
  filename?: string;
  /** Lines to highlight (1-indexed). */
  highlight?: number[];
  /** Hides the language tag in the header. */
  hideLang?: boolean;
};

const LANG_LABELS: Record<string, string> = {
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  json: "JSON",
  bash: "bash",
  shell: "shell",
  sh: "bash",
  go: "Go",
  py: "Python",
  python: "Python",
  java: "Java",
  kt: "Kotlin",
  kotlin: "Kotlin",
  swift: "Swift",
  dart: "Dart",
  html: "HTML",
  css: "CSS",
  yaml: "YAML",
  yml: "YAML",
  http: "HTTP",
  sql: "SQL",
  diff: "Diff",
};

export async function CodeBlock({
  code,
  lang = "text",
  filename,
  highlight = [],
  hideLang = false,
}: Props) {
  const trimmed = code.replace(/\n+$/, "");
  let html: string;
  try {
    const hl = await getHighlighter();
    html = hl.codeToHtml(trimmed, {
      lang: lang in LANG_LABELS || (hl as { getLoadedLanguages?: () => string[] }).getLoadedLanguages?.().includes(lang) ? lang : "text",
      themes: SHIKI_THEME,
      defaultColor: false,
      transformers: [
        {
          name: "highlight-lines",
          line(node, line) {
            if (highlight.includes(line)) {
              if (!node.properties) node.properties = {};
              (node.properties as Record<string, unknown>)["data-highlighted-line"] = "true";
            }
          },
        },
      ],
    });
  } catch {
    // Fallback: render plain code if shiki fails on an unknown language.
    const escaped = trimmed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = `<pre><code>${escaped}</code></pre>`;
  }

  const langLabel = hideLang ? null : LANG_LABELS[lang] ?? lang;

  return (
    <div className="docs-code">
      {(filename || langLabel) && (
        <div className="docs-code-header">
          <div className="docs-code-filename">
            {langLabel ? <span className="docs-code-lang">{langLabel}</span> : null}
            {filename ? <span>{filename}</span> : null}
          </div>
          <CopyButton text={trimmed} />
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
