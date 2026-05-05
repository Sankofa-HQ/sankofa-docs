import { mdxComponents } from "@/components/mdx";
import type { MDXComponents } from "mdx/types";

/**
 * Root MDX provider (Next 15+ convention).
 *
 * Even though Phase 1 still loads MDX through next-mdx-remote (where the
 * components prop wins), this file is the canonical place to register MDX
 * components for any future @next/mdx-compiled `.mdx` routes.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
