"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Sparkles, Shield, AlertCircle } from "lucide-react";
import { validateUsername } from "@/lib/validators";

interface UsernameSearchFormProps {
  onSearch: (username: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  size?: "default" | "large";
}

const EXAMPLE_USERNAMES = ["alexdev", "osintcreator", "cybersec_lab", "brandname"];

export function UsernameSearchForm({
  onSearch,
  isLoading = false,
  initialValue = "",
  size = "large",
}: UsernameSearchFormProps) {
  const [input, setInput] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValue && !input) {
      setInput(initialValue);
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateUsername(input);
    if (!validation.isValid) {
      setError(validation.error || "Invalid username format");
      return;
    }
    setError(null);
    onSearch(input.trim());
  };

  const handleClear = () => {
    setInput("");
    setError(null);
  };

  const handleExampleClick = (name: string) => {
    setInput(name);
    setError(null);
    onSearch(name);
  };

  const isLarge = size === "large";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-all duration-200 shadow-sm ${
            error
              ? "border-rose-400 bg-rose-50/40 focus-within:ring-2 focus-within:ring-rose-400"
              : "border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20"
          }`}
        >
          <div className="pl-3 text-slate-400">
            <Search className={isLarge ? "w-5 h-5" : "w-4 h-4"} />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (error) setError(null);
            }}
            maxLength={64}
            disabled={isLoading}
            placeholder="Enter a username, such as alexdev or brandname"
            aria-label="Username or public handle"
            className={`w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none ${
              isLarge ? "text-base sm:text-lg py-2" : "text-sm py-1.5"
            }`}
          />

          {input && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear username input"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`flex items-center justify-center gap-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm ${
              isLarge ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <span>Scan Username</span>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-rose-600 font-medium px-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* Examples & hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Try an example:</span>
          <div className="flex items-center gap-1.5">
            {EXAMPLE_USERNAMES.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleExampleClick(name)}
                disabled={isLoading}
                className="underline hover:text-indigo-600 font-mono transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <span className="text-slate-400 text-[11px]">
          Max 64 characters • Letters, numbers, - _ .
        </span>
      </div>
    </div>
  );
}
