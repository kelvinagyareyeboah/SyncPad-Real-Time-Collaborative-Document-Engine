"use client";

import { useState } from "react";
import { FileText } from "lucide-react";

interface NamePromptProps {
  onConfirm: (name: string) => void;
}

export function NamePrompt({ onConfirm }: NamePromptProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    onConfirm(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-lg bg-white flex items-center justify-center">
            <FileText className="size-5 text-black" />
          </div>
          <span className="text-xl font-semibold text-white">SyncPad</span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">What's your name?</h2>
          <p className="mt-1 text-sm text-white/40">
            This is how collaborators will see you in documents.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex Johnson"
            minLength={2}
            maxLength={32}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/20 text-sm outline-none focus:border-white/40 transition-colors"
          />
          <button
            type="submit"
            disabled={name.trim().length < 2}
            className="w-full px-4 py-3 rounded-lg bg-white hover:bg-white/90 text-black text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enter SyncPad
          </button>
        </form>
      </div>
    </div>
  );
}
