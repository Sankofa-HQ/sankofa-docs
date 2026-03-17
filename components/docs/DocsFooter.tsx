import Link from "next/link";
import { docsTopLinks, mainSiteUrl } from "@/lib/site";

export function DocsFooter() {
  return (
    <footer className="border-t border-slate-200/80 px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-950">Sankofa Docs</p>
          <p className="mt-1">
            Official usage, SDK, integration, and self-hosting documentation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {docsTopLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/orgs/Sankofa-HQ/repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-slate-950"
          >
            GitHub
          </a>
          <a
            href={mainSiteUrl}
            className="font-medium text-slate-950 transition-colors hover:text-rose-700"
          >
            Main site
          </a>
        </div>
      </div>
    </footer>
  );
}
