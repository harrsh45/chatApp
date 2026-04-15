import React from "react";

export default function RunOverlay({ open, title, subtitle }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/25 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-sky-200/70 bg-white/80 backdrop-blur p-5 shadow-2xl shadow-slate-900/10">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/70">
            <div className="h-6 w-6 rounded-full border-2 border-sky-200 border-t-sky-600 animate-spin" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {title || "Starting preview"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {subtitle || "Spinning up the container. This can take a moment…"}
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-sky-100">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-sky-400/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

