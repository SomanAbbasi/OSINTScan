"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { PlatformDisplay } from "@/lib/types";
import { PlatformIcon } from "@/components/platform-icon";
import { Pagination } from "@/components/pagination";

export function PlatformsDirectoryClient({
  platforms,
  categories,
}: {
  platforms: PlatformDisplay[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(18);

  const filtered = platforms.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.displayName.toLowerCase().includes(q) || p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchCat) return false;
    }
    return true;
  });

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setCurrentPage(1);
  };

  const paginatedPlatforms = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search platforms by name (e.g. GitHub, Reddit)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
        >
          <option value="all">All Categories ({platforms.length})</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)} (
              {platforms.filter((p) => p.category === c).length})
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPlatforms.map((p) => (
          <Link
            key={p.slug}
            href={`/platforms/${p.slug}`}
            className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 transition-all shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <PlatformIcon category={p.category} name={p.displayName} />
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {p.displayName}
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                  {p.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                {p.shortDescription}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-900 font-medium">
              <span>View Detection Spec</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-sm">
          No platforms matched your search criteria.
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={(page) => {
            setCurrentPage(page);
            if (typeof window !== "undefined") {
              window.scrollTo({ top: 140, behavior: "smooth" });
            }
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          pageSizeOptions={[18, 36, 54, 90]}
        />
      )}
    </div>
  );
}
