import React from "react";
import { Search } from "lucide-react";

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="p-10 text-center rounded-2xl border border-slate-200/80 bg-white space-y-2.5 shadow-2xs">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <Search className="w-4 h-4 stroke-[2]" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">
        Nothing publicly discoverable was found for this identifier.
      </h3>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        {message ||
          "If no public profiles were found, this does not guarantee the identifier is unused. Private accounts, restricted directories, or alternative URLs may exist."}
      </p>
    </div>
  );
}
