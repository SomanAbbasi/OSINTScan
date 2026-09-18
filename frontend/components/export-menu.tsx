"use client";

import React, { useState } from "react";
import {
  Download,
  FileSpreadsheet,
  FileCode,
  Printer,
  ChevronDown,
  Eye,
  FileText,
} from "lucide-react";
import { ScanSummary, PlatformResult } from "@/lib/types";
import { downloadCSV, downloadJSON, downloadHTMLReport } from "@/lib/platform-utils";
import { ReportModal } from "./report-modal";

export function ExportMenu({
  summary,
  matches,
}: {
  summary: ScanSummary;
  matches: PlatformResult[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const matchCount = matches.length;

  const handlePrint = () => {
    setIsOpen(false);
    // Give browser time to close dropdown menu before opening print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-xs"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <Download className="w-3.5 h-3.5 text-indigo-600" />
          <span>Export Report</span>
          <span className="px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
            {matchCount}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-30 text-xs">
              <div className="px-3.5 py-1.5 border-b border-slate-100 text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Resultant Matches Only</span>
                <span className="font-bold text-indigo-600">{matchCount} Found</span>
              </div>

              {/* View Interactive Report Option */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowModal(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-left text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-600" />
                  <span>View Interactive Report</span>
                </div>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                  Preview
                </span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              {/* Print / Save PDF */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-between px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print / Save as PDF</span>
                </div>
                <span className="text-[10px] text-slate-400">PDF</span>
              </button>

              {/* Standalone HTML Report */}
              <button
                onClick={() => {
                  downloadHTMLReport(summary);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Standalone HTML Report</span>
                </div>
                <span className="text-[10px] text-slate-400">.html</span>
              </button>

              {/* CSV Export */}
              <button
                onClick={() => {
                  downloadCSV(summary);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export CSV (Matches)</span>
                </div>
                <span className="text-[10px] text-slate-400">.csv</span>
              </button>

              {/* JSON Export */}
              <button
                onClick={() => {
                  downloadJSON(summary);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  <span>Export JSON (Matches)</span>
                </div>
                <span className="text-[10px] text-slate-400">.json</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Interactive Report Modal */}
      <ReportModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        summary={summary}
        matches={matches}
      />
    </>
  );
}
