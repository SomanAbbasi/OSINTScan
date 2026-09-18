import React from "react";
import Link from "next/link";
import { Lock, EyeOff } from "lucide-react";

export function PrivacyNotice() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-600">
      <div className="flex items-center gap-2">
        <Lock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
        <span>
          <strong>No Signup Required.</strong> Searches are processed ephemerally in-memory. Usernames are not indexed.
        </span>
      </div>
      <div className="flex items-center gap-3 font-medium">
        <Link href="/privacy" className="text-indigo-600 hover:underline">
          Privacy Policy
        </Link>
        <span>•</span>
        <Link href="/terms" className="text-indigo-600 hover:underline">
          Terms of Use
        </Link>
      </div>
    </div>
  );
}
