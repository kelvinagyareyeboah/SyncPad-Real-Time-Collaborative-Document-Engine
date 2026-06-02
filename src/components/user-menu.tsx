"use client";

import { useLocalUser } from "@/hooks/use-local-user";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export function UserMenu() {
  const [user] = useLocalUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const name = user?.name ?? "...";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full hover:bg-neutral-100 transition-colors px-1.5 py-1"
      >
        <div className="size-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
        <ChevronDown className={`size-3.5 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-neutral-200 shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-black flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{name}</p>
                <p className="text-xs text-neutral-400">SyncPad workspace</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
