"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { useScanContext } from "@/context/scan-context";
import { filterResults, sortResults } from "@/lib/platform-utils";
import { MultiInputSearchForm } from "./multi-input-search-form";
import { ScanProgress } from "./scan-progress";
import { ResultSummary } from "./result-summary";
import { ResultFilters } from "./result-filters";
import { ResultCard } from "./result-card";
import { ResultTable } from "./result-table";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { ExportMenu } from "./export-menu";
import { PrintableReport } from "./printable-report";
import { Pagination } from "./pagination";
import { CheckCircle2, ArrowRight, Loader2, Cpu, Filter } from "lucide-react";
import { OSINTInputType, PlatformResult } from "@/lib/types";

interface ScanWorkspaceProps {
  initialTarget?: string;
  initialInputType?: OSINTInputType;
  autoStart?: boolean;
}

export function ScanWorkspace({
  initialTarget = "",
  initialInputType = "username",
  autoStart = false,
}: ScanWorkspaceProps) {
  const {
    target,
    username,
    inputType,
    status,
    totalPlatforms,
    currentPlatform,
    results,
    osintResults,
    error,
    isCancelling,
    workingEngines,
    workingSummary,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    engineFilter,
    setEngineFilter,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    startScan,
    cancelCurrentScan,
    switchInputType,
    clearScan,
    summary,
    foundMatches,
  } = useScanContext();

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const displayTarget = target || username || initialTarget;

  useEffect(() => {
    if (autoStart && initialTarget && status === "idle") {
      startScan(initialTarget, initialInputType);
    }
  }, [autoStart, initialTarget, initialInputType, status, startScan]);

  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCat: string) => {
    setCategoryFilter(newCat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Strict deduplication guarantee across all engines
  const deduplicatedResults = useMemo(() => {
    const seen = new Set<string>();
    const unique: PlatformResult[] = [];
    for (const r of results) {
      const key = r.platformId || r.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(r);
      }
    }
    return unique;
  }, [results]);

  // Distinct engines present in results
  const availableEngines = useMemo(() => {
    const set = new Set<string>();
    deduplicatedResults.forEach((r) => {
      if (r.metadata?.engines && Array.isArray(r.metadata.engines)) {
        r.metadata.engines.forEach((e: string) => set.add(e));
      } else if (r.sourceEngine) {
        set.add(r.sourceEngine);
      }
    });
    return Array.from(set).sort();
  }, [deduplicatedResults]);

  const categories = useMemo(() => {
    return Array.from(new Set(deduplicatedResults.map((r) => r.category))).sort();
  }, [deduplicatedResults]);

  // Filter by category and search query, strictly displaying found profiles
  const filtered = useMemo(() => {
    const confirmedMatches = deduplicatedResults.filter((r) => r.status === "FOUND");
    return filterResults(confirmedMatches, {
      statusFilter: "matches",
      categoryFilter,
      searchQuery,
    });
  }, [deduplicatedResults, categoryFilter, searchQuery]);

  const sortedResults = sortResults(filtered, sortBy);

  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const filterCounts = {
    all: deduplicatedResults.length,
    matches: deduplicatedResults.filter((r) => r.status === "FOUND").length,
    highConfidence: deduplicatedResults.filter((r) => r.status === "FOUND" && r.confidence === "high").length,
    manualReview: deduplicatedResults.filter((r) => r.requiresManualVerification).length,
    notFound: deduplicatedResults.filter((r) => r.status === "NOT_FOUND").length,
    blocked: deduplicatedResults.filter((r) => r.status === "BLOCKED" || r.status === "RATE_LIMITED").length,
    errors: deduplicatedResults.filter((r) => r.status === "ERROR" || r.status === "TIMEOUT").length,
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Multi-Input Search Form */}
      <MultiInputSearchForm
        onSearch={(tgt, type, engines) => startScan(tgt, type, engines)}
        onTabChange={(tab) => switchInputType(tab)}
        onClear={(tab) => clearScan(tab)}
        isLoading={status === "running"}
        initialValue={displayTarget}
        initialInputType={(inputType as OSINTInputType) || "username"}
      />

      {/* Scan Progress Bar */}
      {status === "running" && (
        <ScanProgress
          totalChecked={deduplicatedResults.length}
          totalPlatforms={totalPlatforms}
          currentPlatform={currentPlatform}
          onCancel={cancelCurrentScan}
          isCancelling={isCancelling}
        />
      )}

      {/* Error state */}
      {status === "error" && (
        <ErrorState error={error || undefined} onRetry={() => startScan(displayTarget, inputType)} />
      )}

      {/* Results Header and Summary */}
      {deduplicatedResults.length > 0 && (
        <div ref={resultsRef} className="space-y-4 pt-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Audit Intelligence Results
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono font-semibold border border-emerald-200">
                {foundMatches.length} profiles found
              </span>
            </div>
            <ExportMenu summary={summary} matches={foundMatches} />
          </div>

          <ResultSummary summary={summary} />

          {/* Filters Bar */}
          <ResultFilters
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
            categoryFilter={categoryFilter}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchQueryChange={handleSearchChange}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={categories}
            counts={filterCounts}
          />

          {/* Active View Notice */}
          {statusFilter === "matches" && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] sm:text-xs px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  Showing <strong>Positive Matches ({filterCounts.matches})</strong>
                </span>
              </div>
              <button
                onClick={() => handleStatusChange("all")}
                className="underline hover:text-black font-semibold flex items-center gap-1 text-[11px] sm:text-xs self-start sm:self-auto"
              >
                <span>View all {deduplicatedResults.length} tested endpoints</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Results List */}
          {sortedResults.length === 0 ? (
            statusFilter === "matches" && status === "running" ? (
              <div className="p-10 text-center rounded-2xl border border-dashed border-slate-200 bg-white space-y-2">
                <Loader2 className="w-6 h-6 text-slate-700 animate-spin mx-auto" />
                <p className="text-sm font-medium text-slate-800">
                  Scanning active OSINT engines ({workingSummary || "WhatsMyName, Sherlock, Maigret, Blackbird, Holehe, GHunt, Ignorant, Breach"})...
                </p>
                <p className="text-xs text-slate-500">
                  Any positive matches and accounts will appear here automatically in real time.
                </p>
              </div>
            ) : (
              <EmptyState
                message={
                  statusFilter === "matches"
                    ? "No public profile matches have been detected yet for this target."
                    : searchQuery || categoryFilter !== "all" || engineFilter !== "all"
                    ? "No results matched your active filters."
                    : undefined
                }
              />
            )
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {/* Contained Results Deck */}
              {viewMode === "cards" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4">
                  {paginatedResults.map((r) => (
                    <ResultCard key={r.platformId} result={r} />
                  ))}
                </div>
              ) : (
                <ResultTable results={paginatedResults} />
              )}

              {/* Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalItems={sortedResults.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
                pageSizeOptions={[12, 24, 48, 100]}
              />
            </div>
          )}
        </div>
      )}

      {/* Hidden during screen view, isolates exclusively during window.print() */}
      <PrintableReport summary={summary} matches={foundMatches} />
    </div>
  );
}
