"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LayoutDashboard, Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { appUrl, docsTopLinks, mainSiteUrl } from "@/lib/site";

const githubUrl = "https://github.com/orgs/Sankofa-HQ/repositories";

export function DocsHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-[rgba(243,244,246,0.92)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-full px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          >
            <Image
              src="/logo-full.png"
              alt="Sankofa Docs"
              width={144}
              height={36}
              priority
            />
          </Link>
          <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 lg:inline-flex">
            Docs
          </span>
        </div>

        <nav aria-label="Docs navigation" className="hidden items-center gap-1 lg:flex">
          {docsTopLinks.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                  active
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-white hover:text-slate-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950 sm:inline-flex"
          >
            GitHub
          </a>
          <a
            href={mainSiteUrl}
            className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:text-slate-950 sm:inline-flex"
          >
            <Rocket className="h-4 w-4" />
            Website
          </a>
          <a
            href={appUrl}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Open app
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
