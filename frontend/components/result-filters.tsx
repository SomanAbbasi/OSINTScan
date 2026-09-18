"use client";

import React from "react";
import { Search, ArrowUpDown, LayoutGrid, Table, CheckCircle2 } from "lucide-react";

interface ResultFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  categoryFilter: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  sortBy: "confidence" | "name" | "category" | "duration" | "status";
  onSortByChange: (sort: "confidence" | "name" | "category" | "duration" | "status") => void;
  viewMode: "cards" | "table";
  onViewModeChange: (mode: "cards" | "table") => void;
  categories: string[];
  counts: {
    all: number;
    matches: number;
    highConfidence: number;
    manualReview: number;
    notFound: number;
    blocked: number;
    errors: number;
  };
}

export function ResultFilters({
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  categories,
  counts,
}: ResultFiltersProps) {
  // Put Matches (Found) FIRST as the default focus
  const statusTabs = [
    { id: "matches", label: "Profiles Found", count: counts.matches },
    { id: "high_confidence", label: "Likely Matches", count: counts.highConfidence },
    { id: "manual_review", label: "Manual Review", count: counts.manualReview },
    { id: "not_found", label: "Not Found", count: counts.notFound },
    { id: "blocked", label: "Limited", count: counts.blocked },
    { id: "errors", label: "Errors", count: counts.errors },
    { id: "all", label: "All Sources", count: counts.all },
  ];

  return (
    <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      {/* Status Pill Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Second row: Search, Category, Sort, and View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search in results..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="confidence">Sort: Confidence</option>
              <option value="status">Sort: Status</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="category">Sort: Category</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>

          {/* Cards / Table toggle */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => onViewModeChange("cards")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "cards"
                  ? "bg-white text-slate-950 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Cards view"
              aria-label="Cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange("table")}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-white text-slate-950 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
