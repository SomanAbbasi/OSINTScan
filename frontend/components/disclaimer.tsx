import React from "react";
import { AlertCircle, ShieldCheck } from "lucide-react";

export function Disclaimer({ variant = "banner" }: { variant?: "banner" | "compact" | "card" }) {
  if (variant === "compact") {
    return (
      <p className="text-xs text-slate-500 text-center leading-relaxed">
        <strong>Important:</strong> This tool checks publicly accessible profile URLs. A matching username does not prove account ownership. Always verify profiles manually.
      </p>
    );
  }

  if (variant === "card") {
    return (
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-1">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span>Manual Verification Recommended</span>
        </div>
        <p className="text-xs leading-relaxed text-amber-800">
          Username matches indicate that a public page exists with that name. It does not establish the identity or ownership of the individual behind the account.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
      <div className="flex items-center gap-2 text-slate-900 font-medium">
        <ShieldCheck className="w-4 h-4 text-indigo-600" />
        <span>Ethical OSINT & Public Footprint Notice</span>
      </div>
      <p>
        WhatsMyName checks publicly accessible profile URLs across independent websites. Only publicly visible pages are audited; private accounts and login-protected contents are never accessed. A username match does not prove account ownership or identity. Use this service strictly for lawful, respectful research and personal privacy auditing.
      </p>
    </div>
  );
}
