"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  Mail,
  UserRound,
  Phone,
  Lock,
  ChevronDown,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { OSINTInputType } from "@/lib/types";

interface MultiInputSearchFormProps {
  onSearch: (target: string, inputType: OSINTInputType, engines?: string[]) => void;
  onTabChange?: (tab: OSINTInputType) => void;
  onClear?: (tab: OSINTInputType) => void;
  isLoading?: boolean;
  initialValue?: string;
  initialInputType?: OSINTInputType;
}

interface CountryOption {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
}

const TOP_COUNTRIES: CountryOption[] = [
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44" },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1" },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61" },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49" },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33" },
  { name: "Pakistan", code: "PK", flag: "🇵🇰", dialCode: "+92" },
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪", dialCode: "+971" },
  { name: "Saudi Arabia", code: "SA", flag: "🇸🇦", dialCode: "+966" },
  { name: "Turkey", code: "TR", flag: "🇹🇷", dialCode: "+90" },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55" },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81" },
  { name: "Spain", code: "ES", flag: "🇪🇸", dialCode: "+34" },
  { name: "Italy", code: "IT", flag: "🇮🇹", dialCode: "+39" },
  { name: "Netherlands", code: "NL", flag: "🇳🇱", dialCode: "+31" },
  { name: "Singapore", code: "SG", flag: "🇸🇬", dialCode: "+65" },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27" },
  { name: "Mexico", code: "MX", flag: "🇲🇽", dialCode: "+52" },
  { name: "Ireland", code: "IE", flag: "🇮🇪", dialCode: "+353" },
];

const ENGINES_CONFIG = {
  username: [
    { id: "whatsmyname", name: "WhatsMyName Source", desc: "700+ community platforms" },
    { id: "sherlock", name: "Sherlock Source", desc: "480+ social platforms" },
    { id: "maigret", name: "Maigret Source", desc: "Alexa-ranked sites database" },
    { id: "blackbird", name: "Blackbird Source", desc: "Fast social footprinting" },
    { id: "breach", name: "Exposure Intelligence", desc: "Public compromise checks" },
  ],
  email: [
    { id: "holehe", name: "Account Recovery Source", desc: "120+ email services" },
    { id: "ghunt", name: "Public Footprint Source", desc: "Public Google metadata" },
    { id: "blackbird", name: "Social Metadata", desc: "Public profiles & gravatar" },
    { id: "breach", name: "Exposure Intelligence", desc: "Public compromise checks" },
  ],
  phone: [
    { id: "phoneinfoga", name: "PhoneInfoga Intelligence", desc: "VoIP, carrier, telecom & dorks" },
    { id: "ignorant", name: "Phone Registration Source", desc: "Account existence verification" },
    { id: "breach", name: "Exposure Intelligence", desc: "Public compromise checks" },
  ],
  breach: [
    { id: "breach", name: "Exposure Intelligence", desc: "Public compromise checks" },
  ],
};

export function MultiInputSearchForm({
  onSearch,
  onTabChange,
  onClear,
  isLoading = false,
  initialValue = "",
  initialInputType = "username",
}: MultiInputSearchFormProps) {
  const [activeTab, setActiveTab] = useState<OSINTInputType>(initialInputType);

  // Separate, independent storage per tab so switching never spills values
  const [tabInputs, setTabInputs] = useState<Record<"username" | "email", string>>({
    username: initialInputType === "username" ? initialValue : "",
    email: initialInputType === "email" ? initialValue : "",
  });
  const [phoneDigits, setPhoneDigits] = useState(
    initialInputType === "phone" ? initialValue.replace(/^\+/, "") : ""
  );

  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(TOP_COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedEngines, setSelectedEngines] = useState<Record<string, boolean>>({
    whatsmyname: true,
    sherlock: true,
    maigret: true,
    blackbird: true,
    holehe: true,
    ghunt: true,
    ignorant: true,
    phoneinfoga: true,
    breach: true,
  });

  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync initialValue if inputType changes from parent / context
  useEffect(() => {
    if (initialInputType && initialInputType !== activeTab) {
      setActiveTab(initialInputType);
    }
  }, [initialInputType]);

  useEffect(() => {
    if (initialValue) {
      if (initialInputType === "phone") {
        parseIncomingPhone(initialValue);
      } else if (initialInputType === "username" || initialInputType === "email") {
        setTabInputs((prev) => ({
          ...prev,
          [initialInputType]: initialValue,
        }));
      }
    } else {
      if (initialInputType === "phone") {
        setPhoneDigits("");
      } else if (initialInputType === "username" || initialInputType === "email") {
        setTabInputs((prev) => ({
          ...prev,
          [initialInputType]: "",
        }));
      }
    }
  }, [initialValue, initialInputType]);

  const parseIncomingPhone = (val: string) => {
    const cleaned = val.trim();
    for (const c of TOP_COUNTRIES) {
      if (cleaned.startsWith(c.dialCode)) {
        setSelectedCountry(c);
        setPhoneDigits(cleaned.slice(c.dialCode.length).trim());
        return;
      }
    }
    setPhoneDigits(cleaned.replace(/^\+/, ""));
  };

  const handleTabChange = (tab: OSINTInputType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setError(null);
    onTabChange?.(tab);
  };

  const currentInputValue = activeTab === "phone" ? phoneDigits : tabInputs[activeTab as "username" | "email"] || "";

  const handleInputChange = (val: string) => {
    if (error) setError(null);
    if (activeTab === "phone") {
      setPhoneDigits(val);
      if (!val.trim()) {
        onClear?.("phone");
      }
    } else {
      setTabInputs((prev) => ({
        ...prev,
        [activeTab]: val,
      }));
      if (!val.trim()) {
        onClear?.(activeTab);
      }
    }
  };

  const getEffectivePhone = () => {
    const digitsOnly = phoneDigits.replace(/[\s\-\(\)]/g, "");
    return `${selectedCountry.dialCode}${digitsOnly}`;
  };

  const validateInput = (): boolean => {
    if (activeTab === "phone") {
      const digitsOnly = phoneDigits.replace(/[\s\-\(\)]/g, "");
      if (!digitsOnly || digitsOnly.length < 5) {
        setError(`Please enter valid phone digits for ${selectedCountry.name}.`);
        return false;
      }
      const full = getEffectivePhone();
      if (!/^\+[1-9]\d{6,14}$/.test(full)) {
        setError("Please enter a valid international phone number.");
        return false;
      }
      setError(null);
      return true;
    }

    const trimmed = currentInputValue.trim();
    if (!trimmed) {
      setError("Please enter a target to scan.");
      return false;
    }

    if (activeTab === "username") {
      const cleanUser = trimmed.replace(/^@/, "");
      if (cleanUser.length > 64) {
        setError("Username must be 64 characters or fewer.");
        return false;
      }
      if (!/^[a-zA-Z0-9_\-\.]{1,64}$/.test(cleanUser)) {
        setError("Username can only contain letters, numbers, '.', '_', and '-'.");
        return false;
      }
    } else if (activeTab === "email") {
      if (!/^[\w\.\+\-]+@[\w\-]+\.[a-zA-Z0-9\.\-_]{2,}$/.test(trimmed)) {
        setError("Please enter a valid email address (e.g. user@example.com).");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInput()) return;

    const available = ENGINES_CONFIG[activeTab] || [];
    const enabled = available
      .filter((e) => selectedEngines[e.id] !== false)
      .map((e) => e.id);

    let targetValue = "";
    if (activeTab === "phone") {
      targetValue = getEffectivePhone();
    } else if (activeTab === "username") {
      targetValue = currentInputValue.trim().replace(/^@/, "");
    } else {
      targetValue = currentInputValue.trim();
    }

    onSearch(targetValue, activeTab, enabled);
  };

  const handleClear = () => {
    if (activeTab === "phone") {
      setPhoneDigits("");
    } else {
      setTabInputs((prev) => ({
        ...prev,
        [activeTab]: "",
      }));
    }
    setError(null);
    onClear?.(activeTab);
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "email":
        return "Enter email";
      case "phone":
        return "Enter phone";
      default:
        return "Enter username";
    }
  };

  const filteredCountries = TOP_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.dialCode.includes(countrySearch) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Segmented Input Selector */}
      <div className="inline-flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => handleTabChange("username")}
          className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "username"
              ? "bg-white text-slate-950 shadow-2xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserRound className="w-3.5 h-3.5" />
          <span>Username</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("email")}
          className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "email"
              ? "bg-white text-slate-950 shadow-2xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("phone")}
          className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === "phone"
              ? "bg-white text-slate-950 shadow-2xs font-semibold"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Phone</span>
        </button>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl border bg-white shadow-xs transition-all duration-200 ${
            error
              ? "border-rose-300 ring-2 ring-rose-100"
              : "border-slate-200 hover:border-slate-300 focus-within:border-indigo-600 focus-within:ring-3 focus-within:ring-indigo-500/10"
          }`}
        >
          {/* PHONE TAB */}
          {activeTab === "phone" ? (
            <div className="flex items-center flex-1 gap-2 pl-2 min-w-0">
              <div className="relative shrink-0" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 border border-slate-200/80 transition-colors shrink-0"
                  aria-label="Select Country Dial Code"
                >
                  <span className="text-base leading-none">{selectedCountry.flag}</span>
                  <span className="font-mono text-slate-900">{selectedCountry.dialCode}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 max-w-[calc(100vw-3rem)] max-h-64 overflow-hidden rounded-xl bg-white border border-slate-200 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 text-left">
                    <div className="p-2 border-b border-slate-100 bg-slate-50/70">
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        className="w-full px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-slate-400"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-slate-50 text-xs">
                      {filteredCountries.map((c) => (
                        <button
                          key={`${c.code}-${c.dialCode}`}
                          type="button"
                          onClick={() => {
                            setSelectedCountry(c);
                            setIsCountryDropdownOpen(false);
                            setCountrySearch("");
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition-colors ${
                            selectedCountry.code === c.code && selectedCountry.dialCode === c.dialCode
                              ? "bg-slate-50 font-semibold text-slate-950"
                              : "text-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{c.flag}</span>
                            <span className="truncate">{c.name}</span>
                          </div>
                          <span className="font-mono text-slate-400 shrink-0">{c.dialCode}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <input
                type="tel"
                value={phoneDigits}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={isLoading}
                placeholder={getPlaceholder()}
                aria-label="Phone number"
                className="w-full min-w-0 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base py-1 sm:py-1.5"
              />
            </div>
          ) : (
            /* USERNAME & EMAIL TABS */
            <div className="flex items-center flex-1 gap-2.5 pl-3 min-w-0">
              <span className="text-slate-400 select-none shrink-0">
                {activeTab === "email" ? (
                  <Mail className="w-4 h-4 text-slate-400" />
                ) : (
                  <span className="font-mono text-slate-400 text-sm">@</span>
                )}
              </span>

              <input
                type="text"
                value={currentInputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={isLoading}
                placeholder={getPlaceholder()}
                aria-label="Search identifier"
                className="w-full min-w-0 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-sm sm:text-base py-1 sm:py-1.5"
              />
            </div>
          )}

          {/* Clear Button */}
          {((activeTab === "phone" ? phoneDigits : currentInputValue)) && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear input"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (activeTab === "phone" ? !phoneDigits.trim() : !currentInputValue.trim())}
            className="flex items-center justify-center gap-2 font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-black disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-2xs px-5 sm:px-6 py-2.5 sm:py-3 text-sm shrink-0"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Scanning...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" />
                <span>Scan</span>
              </div>
            )}
          </button>
        </div>

        {/* Validation error */}
        {error && (
          <p className="mt-2 text-xs font-medium text-rose-600 text-left pl-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
            {error}
          </p>
        )}
      </form>

      {/* Trust line underneath search */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>No account required. Searches are processed in memory and aren&apos;t stored.</span>
        <span>·</span>
        <Link href="/privacy" className="text-slate-600 underline hover:text-slate-900 transition-colors">
          Privacy details
        </Link>
      </div>

      {/* Centered & Visible Advanced Sources toggle (Examples removed) */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-600 bg-slate-100/90 hover:bg-slate-200/90 hover:text-slate-900 border border-slate-200 transition-all shadow-2xs"
        >
          <SlidersHorizontal className="w-3 h-3 text-slate-500" />
          <span>{showAdvanced ? "Hide sources" : "Advanced sources & engines"}</span>
        </button>
      </div>

      {/* Advanced Sources Drawer (Hidden by default) */}
      {showAdvanced && (
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs text-left space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px]">
            <span className="font-semibold text-slate-800">Public Sources Configuration</span>
            <span className="text-slate-400 font-mono">Default: All Active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {(ENGINES_CONFIG[activeTab] || []).map((source) => {
              const isChecked = selectedEngines[source.id] !== false;
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() =>
                    setSelectedEngines((prev) => ({
                      ...prev,
                      [source.id]: !prev[source.id],
                    }))
                  }
                  className={`flex items-start gap-2.5 p-2 rounded-lg border text-left transition-all ${
                    isChecked
                      ? "bg-slate-50 border-slate-300 text-slate-900"
                      : "bg-slate-50/40 border-slate-200 text-slate-400 opacity-60"
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 mt-0.5 rounded flex items-center justify-center border transition-colors ${
                      isChecked
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="text-xs font-medium block">{source.name}</span>
                    <span className="text-[10px] text-slate-400">{source.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
