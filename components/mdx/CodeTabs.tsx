"use client";

import { useState } from "react";

type Tab = {
  label: string;
  code: string;
  language?: string;
};

export function CodeTabs({ tabs }: { tabs: Tab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = tabs[activeIndex] ?? tabs[0];

  return (
    <div className="my-8 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-950">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-4 py-3">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              index === activeIndex
                ? "bg-white text-slate-950"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <pre className="overflow-x-auto p-5 text-sm text-slate-100">
        <code>{activeTab.code}</code>
      </pre>
    </div>
  );
}
