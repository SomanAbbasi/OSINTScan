import React from "react";
import Link from "next/link";
import { SearchX, Home, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <main className="py-24 px-4 max-w-xl mx-auto text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
        <SearchX className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 ">
          Page Not Found (404)
        </h1>
        <p className="text-sm text-slate-600 max-w-sm mx-auto">
          The page or platform you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          href="/platforms"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 :bg-zinc-800 transition-colors"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View Platform Directory</span>
        </Link>
      </div>
    </main>
  );
}
