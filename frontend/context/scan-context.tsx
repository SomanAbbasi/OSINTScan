"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  ReactNode,
} from "react";
import { OSINTModuleResult, PlatformResult, ScanSummary } from "@/lib/types";
import { createScan, cancelScan, getScanEventsUrl, getScanStatus } from "@/lib/api-client";

// Guard Next.js dev overlay against native DOM ErrorEvents without .error (like EventSource closure or img errors)
if (typeof window !== "undefined") {
  window.addEventListener(
    "error",
    (event: ErrorEvent) => {
      if (
        !event.error ||
        (event.target && event.target instanceof EventSource) ||
        event.message === "[object Event]" ||
        (typeof event.message === "string" && event.message.includes("[object Event]"))
      ) {
        event.stopImmediatePropagation?.();
        event.preventDefault?.();
      }
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    (event: PromiseRejectionEvent) => {
      if (
        event.reason instanceof Event ||
        (event.reason && typeof event.reason === "object" && !(event.reason instanceof Error))
      ) {
        event.stopImmediatePropagation?.();
        event.preventDefault?.();
      }
    },
    true
  );
}

export interface TabScanSession {
  target: string;
  username: string;
  inputType: string;
  status: "idle" | "running" | "completed" | "cancelled" | "error";
  scanId: string | null;
  totalPlatforms: number;
  results: PlatformResult[];
  osintResults: OSINTModuleResult[];
  activeEngines: string[];
  workingEngines: string[];
  createdAt: string;
  error: string | null;
  statusFilter?: string;
  categoryFilter?: string;
  engineFilter?: string;
}

interface ScanContextType {
  target: string;
  username: string;
  inputType: string;
  setInputType: (type: string) => void;
  switchInputType: (newType: string) => void;
  status: "idle" | "running" | "completed" | "cancelled" | "error";
  scanId: string | null;
  totalPlatforms: number;
  currentPlatform: string;
  results: PlatformResult[];
  osintResults: OSINTModuleResult[];
  error: string | null;
  isCancelling: boolean;

  // Working engine indicators
  workingEngines: string[];
  activeEngines: string[];
  workingSummary: string;

  // Filters & sorting
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  engineFilter: string;
  setEngineFilter: (engine: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "confidence" | "name" | "category" | "duration" | "status";
  setSortBy: (sort: "confidence" | "name" | "category" | "duration" | "status") => void;
  viewMode: "cards" | "table";
  setViewMode: (mode: "cards" | "table") => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;

  // Actions
  startScan: (target: string, inputType?: string, engines?: string[]) => Promise<void>;
  cancelCurrentScan: () => Promise<void>;
  clearScan: (forTab?: string) => void;

  // Computed
  summary: ScanSummary;
  foundMatches: PlatformResult[];
}

const STORAGE_KEY = "whatsmyname_active_scan_v2";
const TAB_STORAGE_KEY = "whatsmyname_tab_sessions_v1";

const ScanContext = createContext<ScanContextType | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState("");
  const [username, setUsername] = useState("");
  const [inputType, setInputType] = useState<string>("username");
  const [activeEngines, setActiveEngines] = useState<string[]>([]);
  const [workingEngines, setWorkingEngines] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "cancelled" | "error">("idle");
  const [scanId, setScanId] = useState<string | null>(null);
  const [totalPlatforms, setTotalPlatforms] = useState(716);
  const [currentPlatform, setCurrentPlatform] = useState("");
  const [results, setResults] = useState<PlatformResult[]>([]);
  const [osintResults, setOsintResults] = useState<OSINTModuleResult[]>([]);
  const [createdAt, setCreatedAt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Filters & pagination
  const [statusFilter, setStatusFilter] = useState("matches");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [engineFilter, setEngineFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"confidence" | "name" | "category" | "duration" | "status">("confidence");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const eventSourceRef = useRef<EventSource | null>(null);
  const isHydratedRef = useRef(false);

  // Per-tab session storage cache
  const tabSessionsRef = useRef<Record<string, TabScanSession>>({});
  const currentInputTypeRef = useRef<string>("username");

  const saveTabSessionsToStorage = () => {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(tabSessionsRef.current));
    } catch {}
  };

  const snapshotCurrentTab = (typeKey: string) => {
    if (target && status !== "idle" && status !== "cancelled") {
      tabSessionsRef.current[typeKey] = {
        target,
        username,
        inputType: typeKey,
        status,
        scanId,
        totalPlatforms,
        results,
        osintResults,
        activeEngines,
        workingEngines,
        createdAt,
        error,
        statusFilter,
        categoryFilter,
        engineFilter,
      };
      saveTabSessionsToStorage();
    }
  };

  // Restore session from sessionStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined" || isHydratedRef.current) return;
    isHydratedRef.current = true;

    try {
      // 1. Try restoring per-tab sessions map
      const savedTabsStr = sessionStorage.getItem(TAB_STORAGE_KEY);
      if (savedTabsStr) {
        const parsedTabs = JSON.parse(savedTabsStr);
        for (const k of Object.keys(parsedTabs)) {
          if (parsedTabs[k]?.status === "cancelled" || !parsedTabs[k]?.target) {
            delete parsedTabs[k];
          }
        }
        tabSessionsRef.current = parsedTabs;
      }

      // 2. Try restoring active single scan or fallback
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.status === "cancelled" || !parsed.target) {
          sessionStorage.removeItem(STORAGE_KEY);
        } else if (parsed.target && parsed.scanId) {
          const tabKey = parsed.inputType || "username";
          tabSessionsRef.current[tabKey] = {
            target: parsed.target,
            username: parsed.username || parsed.target,
            inputType: tabKey,
            status: parsed.status || "idle",
            scanId: parsed.scanId,
            totalPlatforms: parsed.totalPlatforms || 716,
            results: parsed.results || [],
            osintResults: parsed.osintResults || [],
            activeEngines: parsed.activeEngines || [],
            workingEngines: [],
            createdAt: parsed.createdAt || "",
            error: null,
            statusFilter: "matches",
            categoryFilter: "all",
            engineFilter: "all",
          };

          setTarget(parsed.target);
          setUsername(parsed.username || parsed.target);
          setInputType(tabKey);
          currentInputTypeRef.current = tabKey;
          setScanId(parsed.scanId);
          setTotalPlatforms(parsed.totalPlatforms || 716);
          setResults(parsed.results || []);
          setOsintResults(parsed.osintResults || []);
          setActiveEngines(parsed.activeEngines || []);
          if (parsed.createdAt) {
            setCreatedAt(parsed.createdAt);
          }

          if (parsed.status === "completed") {
            setStatus(parsed.status);
          } else if (parsed.status === "running") {
            getScanStatus(parsed.scanId)
              .then((stat) => {
                if (stat.status === "completed" || stat.status === "cancelled") {
                  setStatus(stat.status);
                  setResults(stat.results || []);
                  setOsintResults(stat.osintResults || []);
                  if (tabSessionsRef.current[tabKey]) {
                    tabSessionsRef.current[tabKey].status = stat.status;
                    tabSessionsRef.current[tabKey].results = stat.results || [];
                    tabSessionsRef.current[tabKey].osintResults = stat.osintResults || [];
                    saveTabSessionsToStorage();
                  }
                } else {
                  setStatus("running");
                  connectSSE(parsed.scanId);
                }
              })
              .catch(() => {
                setStatus("completed");
              });
          }
        }
      }
    } catch {
      // Ignore sessionStorage parsing errors
    }
  }, []);

  // Persist session to sessionStorage when state changes
  useEffect(() => {
    if (!isHydratedRef.current || typeof window === "undefined") return;
    if (!scanId || !target || status === "cancelled" || status === "idle") {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          scanId,
          target,
          username,
          inputType,
          activeEngines,
          status,
          totalPlatforms,
          results,
          osintResults,
          createdAt,
        })
      );
      // Also update tab session cache
      tabSessionsRef.current[inputType] = {
        target,
        username,
        inputType,
        status,
        scanId,
        totalPlatforms,
        results,
        osintResults,
        activeEngines,
        workingEngines,
        createdAt,
        error,
        statusFilter,
        categoryFilter,
        engineFilter,
      };
      saveTabSessionsToStorage();
    } catch {
      // Storage quota or disabled
    }
  }, [scanId, target, username, inputType, activeEngines, workingEngines, status, totalPlatforms, results, osintResults, createdAt, error, statusFilter, categoryFilter, engineFilter]);

  // Switch input tabs preserving previous scan results for each tab
  const switchInputType = (newType: string) => {
    if (newType === currentInputTypeRef.current && newType === inputType) return;

    // 1. Snapshot current active tab state
    snapshotCurrentTab(currentInputTypeRef.current);

    // 2. Close active SSE if running
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // 3. Switch context to new tab
    currentInputTypeRef.current = newType;
    setInputType(newType);

    const savedSession = tabSessionsRef.current[newType];
    if (savedSession && (savedSession.target || savedSession.results.length > 0)) {
      // Restore previously cached scan for this tab
      setTarget(savedSession.target);
      setUsername(savedSession.username || savedSession.target);
      setStatus(savedSession.status);
      setScanId(savedSession.scanId);
      setTotalPlatforms(savedSession.totalPlatforms || 716);
      setResults(savedSession.results || []);
      setOsintResults(savedSession.osintResults || []);
      setActiveEngines(savedSession.activeEngines || []);
      setWorkingEngines(savedSession.workingEngines || []);
      setCreatedAt(savedSession.createdAt || "");
      setError(savedSession.error || null);
      if (savedSession.statusFilter) setStatusFilter(savedSession.statusFilter);
      if (savedSession.categoryFilter) setCategoryFilter(savedSession.categoryFilter);
      if (savedSession.engineFilter) setEngineFilter(savedSession.engineFilter);
      setCurrentPage(1);

      if (savedSession.status === "running" && savedSession.scanId) {
        connectSSE(savedSession.scanId);
      }
    } else {
      // Clean idle state for a fresh tab
      setTarget("");
      setUsername("");
      setStatus("idle");
      setScanId(null);
      setResults([]);
      setOsintResults([]);
      setActiveEngines([]);
      setWorkingEngines([]);
      setCreatedAt("");
      setError(null);
      setStatusFilter("matches");
      setCategoryFilter("all");
      setEngineFilter("all");
      setCurrentPage(1);
    }
  };

  const connectSSE = (activeScanId: string) => {
    if (eventSourceRef.current) {
      try {
        eventSourceRef.current.close();
      } catch {}
      eventSourceRef.current = null;
    }

    try {
      const sseUrl = getScanEventsUrl(activeScanId);
      const es = new EventSource(sseUrl);
      eventSourceRef.current = es;

      const safeClose = () => {
        try {
          es.close();
        } catch {}
        if (eventSourceRef.current === es) {
          eventSourceRef.current = null;
        }
      };

      es.addEventListener("engine_started", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.engine) {
            setWorkingEngines((prev) => [...new Set([...prev, data.engine])]);
            setCurrentPlatform(`Running ${data.engine}...`);
          }
        } catch {}
      });

      es.addEventListener("engine_completed", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.engine) {
            setWorkingEngines((prev) => prev.filter((eng) => eng !== data.engine));
          }
        } catch {}
      });

      es.addEventListener("platform_started", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setCurrentPlatform(data.displayName || data.name || "");
        } catch {}
      });

      es.addEventListener("osint_result", (e: MessageEvent) => {
        try {
          const res: OSINTModuleResult = JSON.parse(e.data);
          setOsintResults((prev) => {
            const idx = prev.findIndex((p) => p.sourceName === res.sourceName && p.platformName === res.platformName);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = res;
              return updated;
            }
            return [...prev, res];
          });
        } catch {}
      });

      es.addEventListener("platform_result", (e: MessageEvent) => {
        try {
          const res: PlatformResult = JSON.parse(e.data);
          setResults((prev) => {
            const idx = prev.findIndex((p) => p.platformId === res.platformId);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = res;
              return updated;
            }
            return [...prev, res];
          });
        } catch {}
      });

      es.addEventListener("scan_completed", (e: MessageEvent) => {
        safeClose();
        try {
          if (e.data) {
            const summary = JSON.parse(e.data);
            if (summary.results) setResults(summary.results);
            if (summary.osintResults) setOsintResults(summary.osintResults);
          }
        } catch {}
        setStatus("completed");
        setWorkingEngines([]);
      });

      es.addEventListener("scan_cancelled", () => {
        safeClose();
        setStatus("cancelled");
        setWorkingEngines([]);
      });

      es.addEventListener("scan_failed", () => {
        safeClose();
        setStatus("error");
        setWorkingEngines([]);
      });

      es.onerror = (e: any) => {
        if (e) {
          e.preventDefault?.();
          e.stopPropagation?.();
          e.stopImmediatePropagation?.();
        }
        safeClose();

        getScanStatus(activeScanId)
          .then((stat) => {
            if (stat.status === "completed" || stat.status === "cancelled") {
              setStatus(stat.status);
              if (stat.results) setResults(stat.results);
              if (stat.osintResults) setOsintResults(stat.osintResults);
            }
          })
          .catch(() => {});
      };
    } catch {
      // EventSource initialization fallback
    }
  };

  const startScan = async (
    targetInput: string,
    type: string = "username",
    selectedEngines?: string[]
  ) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const cleanTarget = targetInput.trim();
    currentInputTypeRef.current = type;
    setTarget(cleanTarget);
    setUsername(cleanTarget);
    setInputType(type);
    setResults([]);
    setOsintResults([]);
    setError(null);
    setStatus("running");
    setIsCancelling(false);
    setStatusFilter("matches");
    setEngineFilter("all");
    setCurrentPage(1);

    try {
      const resp = await createScan({
        target: cleanTarget,
        username: cleanTarget,
        inputType: type,
        engines: selectedEngines,
      });

      setScanId(resp.scanId);
      setTotalPlatforms(resp.totalPlatforms || 100);
      setActiveEngines(resp.engines || []);
      setWorkingEngines(resp.engines || []);
      setCreatedAt(resp.createdAt);

      tabSessionsRef.current[type] = {
        target: cleanTarget,
        username: cleanTarget,
        inputType: type,
        status: "running",
        scanId: resp.scanId,
        totalPlatforms: resp.totalPlatforms || 100,
        results: [],
        osintResults: [],
        activeEngines: resp.engines || [],
        workingEngines: resp.engines || [],
        createdAt: resp.createdAt,
        error: null,
        statusFilter: "matches",
        categoryFilter: "all",
        engineFilter: "all",
      };
      saveTabSessionsToStorage();

      connectSSE(resp.scanId);
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Failed to initialize OSINT scan.");
    }
  };

  const cancelCurrentScan = async () => {
    if (!scanId || status !== "running") return;
    setIsCancelling(true);
    try {
      await cancelScan(scanId);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      // Thoroughly clear storage so refresh never restores cancelled session or target
      delete tabSessionsRef.current[inputType];
      saveTabSessionsToStorage();
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      setTarget("");
      setUsername("");
      setScanId(null);
      setResults([]);
      setOsintResults([]);
      setWorkingEngines([]);
      setStatus("idle");
    } catch {
      // Failed to cancel
    } finally {
      setIsCancelling(false);
    }
  };

  const clearScan = (forTab?: string) => {
    const tabToClear = forTab || inputType;
    if (eventSourceRef.current && tabToClear === inputType) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    delete tabSessionsRef.current[tabToClear];
    saveTabSessionsToStorage();

    if (!forTab || tabToClear === inputType) {
      setTarget("");
      setUsername("");
      setStatus("idle");
      setScanId(null);
      setResults([]);
      setOsintResults([]);
      setWorkingEngines([]);
      setActiveEngines([]);
      setError(null);
      setCurrentPage(1);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  // Working summary string for header
  const workingSummary = useMemo(() => {
    if (status !== "running") return "";
    if (workingEngines.length > 0) {
      return `Working: ${workingEngines.join(" • ")}`;
    }
    return `Scanning across OSINT engines...`;
  }, [status, workingEngines]);

  // Computed summary
  const summary: ScanSummary = useMemo(() => {
    const found = results.filter((r) => r.status === "FOUND").length;
    const notFound = results.filter((r) => r.status === "NOT_FOUND").length;
    const uncertain = results.filter((r) => r.status === "UNCERTAIN").length;
    const blocked = results.filter((r) => r.status === "BLOCKED" || r.status === "RATE_LIMITED").length;
    const errors = results.filter((r) => r.status === "ERROR" || r.status === "TIMEOUT").length;

    let durationSeconds = 0;
    if (createdAt) {
      durationSeconds = Math.max(0, (Date.now() - new Date(createdAt).getTime()) / 1000);
    }

    return {
      scanId: scanId || "",
      target,
      username,
      inputType,
      engines: activeEngines,
      status,
      totalChecked: results.length,
      totalPlatforms,
      foundCount: found,
      notFoundCount: notFound,
      uncertainCount: uncertain,
      blockedCount: blocked,
      errorCount: errors,
      durationSeconds: Math.round(durationSeconds * 10) / 10,
      createdAt: createdAt || new Date().toISOString(),
      results,
      osintResults,
    };
  }, [scanId, target, username, inputType, activeEngines, status, results, osintResults, totalPlatforms, createdAt]);

  const foundMatches = useMemo(() => {
    return results.filter((r) => r.status === "FOUND");
  }, [results]);

  return (
    <ScanContext.Provider
      value={{
        target,
        username,
        inputType,
        setInputType,
        switchInputType,
        status,
        scanId,
        totalPlatforms,
        currentPlatform,
        results,
        osintResults,
        error,
        isCancelling,
        workingEngines,
        activeEngines,
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
        clearScan,
        summary,
        foundMatches,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
}

export function useScanContext() {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error("useScanContext must be used within a ScanProvider");
  }
  return context;
}
