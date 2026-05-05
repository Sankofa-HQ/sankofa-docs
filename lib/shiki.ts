import { createHighlighter, type Highlighter } from "shiki";

let singleton: Promise<Highlighter> | null = null;

const LANGS = [
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "bash",
  "shell",
  "html",
  "css",
  "yaml",
  "toml",
  "go",
  "kotlin",
  "swift",
  "java",
  "python",
  "dart",
  "objective-c",
  "ruby",
  "diff",
  "markdown",
  "mdx",
  "sql",
  "http",
] as const;

export function getHighlighter(): Promise<Highlighter> {
  if (singleton) return singleton;
  singleton = createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: LANGS as unknown as string[],
  });
  return singleton;
}

export const SHIKI_THEME = {
  light: "github-light",
  dark: "github-dark",
} as const;
