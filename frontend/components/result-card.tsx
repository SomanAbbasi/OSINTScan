"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  Info,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  Radio,
  MapPin,
  AlertTriangle,
  Globe,
} from "lucide-react";
import { PlatformResult } from "@/lib/types";
import { PlatformIcon } from "./platform-icon";

export function ResultCard({ result }: { result: PlatformResult }) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = () => {
    if (!result.profileUrl) return;
    try {
      navigator.clipboard.writeText(result.profileUrl).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const isFound = result.status === "FOUND";
  const meta = result.metadata || {};
  const enginesList: string[] =
    meta.engines && Array.isArray(meta.engines) && meta.engines.length > 0
      ? meta.engines
      : result.sourceEngine
      ? [result.sourceEngine]
      : [];

  // Clean domain extraction for "Source: domain.com"
  const getSourceDomain = () => {
    if (result.profileUrl) {
      try {
        const parsed = new URL(result.profileUrl);
        return parsed.hostname.replace(/^www\./, "");
      } catch {
        // Fallback
      }
    }
    return `${result.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
  };

  // Section 14: Restrained, responsible confidence wording
  const getStatusBadge = () => {
    if (isFound) {
      if (meta.crossValidation || result.confidence === "high") {
        return (
          <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            Public profile found
          </span>
        );
      }
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-800 border border-slate-200">
          Possible match
        </span>
      );
    }
    if (result.status === "NOT_FOUND") {
      return (
        <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-slate-50 text-slate-500 border border-slate-200">
          No profile found
        </span>
      );
    }
    return (
      <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-amber-50 text-amber-800 border border-amber-200">
        Unable to verify
      </span>
    );
  };

  return (
    <div
      className={`p-5 rounded-xl border bg-white transition-all duration-150 ${
        isFound
          ? "border-slate-200/90 shadow-2xs hover:border-slate-300"
          : "border-slate-200/60 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Platform Icon & Info */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {meta.avatarUrl ? (
            <img
              src={meta.avatarUrl}
              alt={result.displayName}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
              onError={(e) => {
                try {
                  e.currentTarget.style.display = "none";
                } catch {}
              }}
            />
          ) : (
            <PlatformIcon category={result.category} name={result.displayName} />
          )}

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-slate-950 text-base leading-snug break-words">
                {result.displayName}
              </h3>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span>Source: <strong className="font-mono text-slate-700">{getSourceDomain()}</strong></span>
              <span>·</span>
              <span className="capitalize">{result.category}</span>
            </div>
          </div>
        </div>

        {/* Right: Response time */}
        <div className="text-[11px] font-mono text-slate-400 shrink-0">
          {result.durationMs}ms
        </div>
      </div>

      {/* Rich Metadata snippet (Recovery hints / Bio / PhoneInfoga Telephony / Breach details) */}
      {(meta.bio ||
        meta.emailrecovery ||
        meta.phoneNumber ||
        meta.carrier ||
        meta.region ||
        meta.lineType ||
        meta.isVoIP ||
        meta.dork_query ||
        meta.dataClasses) && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2">
          {meta.bio && <p className="italic text-slate-600">&quot;{meta.bio}&quot;</p>}

          {meta.emailrecovery && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Recovery hint: <strong className="font-mono">{meta.emailrecovery}</strong></span>
            </div>
          )}

          {meta.phoneNumber && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone hint: <strong className="font-mono">{meta.phoneNumber}</strong></span>
            </div>
          )}

          {/* Telephony & PhoneInfoga intelligence badges */}
          {(meta.carrier || meta.lineType || meta.region || meta.isVoIP || meta.timezones) && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {meta.carrier && meta.carrier !== "Unknown" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  <Radio className="w-3 h-3 text-slate-500" />
                  <span>{meta.carrier}</span>
                </span>
              )}

              {meta.lineType && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  <Phone className="w-3 h-3 text-slate-500" />
                  <span>{meta.lineType}</span>
                </span>
              )}

              {meta.region && meta.region !== "Unknown" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{meta.region}</span>
                </span>
              )}

              {meta.isVoIP && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-medium border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>VoIP Number</span>
                </span>
              )}

              {meta.timezones && meta.timezones !== "Unknown" && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-mono border border-slate-200">
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span>{meta.timezones}</span>
                </span>
              )}
            </div>
          )}

          {/* Google Dork footprint target query */}
          {meta.dork_query && (
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700 block mb-0.5">Google Dork Query:</span>
              <code className="text-slate-800 font-mono text-[10px] break-all">{meta.dork_query}</code>
            </div>
          )}

          {/* Breach Exposure Data Classes */}
          {meta.dataClasses && Array.isArray(meta.dataClasses) && meta.dataClasses.length > 0 && (
            <div className="pt-1">
              <span className="text-[11px] text-slate-500 block mb-1">Exposed Data:</span>
              <div className="flex flex-wrap gap-1">
                {meta.dataClasses.map((cls: string) => (
                  <span
                    key={cls}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-medium"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Row for Found Profile */}
      {result.profileUrl && isFound && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="truncate flex-1 min-w-[120px] max-w-full text-xs font-mono text-slate-400">
            {result.profileUrl}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs transition-colors shrink-0"
              aria-label="Copy profile link"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={result.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
            >
              <span>Open</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Subtle "Detection details" expandable panel (Section 13) */}
      <div className="mt-3 pt-2 text-[11px] text-slate-400">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="inline-flex items-center gap-1 hover:text-slate-700 transition-colors"
        >
          <Info className="w-3 h-3 text-slate-400" />
          <span>{showDetails ? "Hide verification details" : "Verification details"}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </button>

        {showDetails && (
          <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1.5 text-slate-600 animate-in fade-in duration-150 text-left">
            <div>
              <strong>Method:</strong> {result.detectionReason || "Public endpoint verification"}
            </div>
            {enginesList.length > 0 && (
              <div>
                <strong>Validated by:</strong> {enginesList.join(", ")}
              </div>
            )}
            {result.httpStatus && (
              <div>
                <strong>HTTP Response:</strong> {result.httpStatus}
              </div>
            )}
            <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60">
              A username match alone does not prove that two accounts belong to the same person.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
