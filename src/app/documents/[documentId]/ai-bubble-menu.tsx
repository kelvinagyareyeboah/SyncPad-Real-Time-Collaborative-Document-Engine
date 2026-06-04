"use client";

import { useEffect, useState, useRef } from "react";
import { useEditorStore } from "@/store/use-editor-store";
import { getAIPromptResponse } from "./ai-action";
import { 
  Sparkles, 
  CornerDownLeft, 
  Loader2, 
  Minimize2, 
  FileText, 
  MessageSquareCode,
  Languages
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function AIBubbleMenu() {
  const { editor } = useEditorStore();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { view, state } = editor;
      const { selection } = state;

      // Only show menu if there is a non-empty text selection and the editor is focused
      if (selection.empty || !editor.isFocused || !editor.isEditable) {
        setIsOpen(false);
        return;
      }

      // Calculate coordinates of the selection
      try {
        const { from, to } = selection;
        const startCoords = view.coordsAtPos(from);
        const endCoords = view.coordsAtPos(to);

        // Position the menu horizontally centered above the selection
        const left = (startCoords.left + endCoords.left) / 2;
        const top = Math.min(startCoords.top, endCoords.top) - 8; // Offset above

        setCoords({
          top: top + window.scrollY,
          left: left + window.scrollX,
        });
        setIsOpen(true);
      } catch {
        setIsOpen(false);
      }
    };

    const handleFocusBlur = () => {
      // Small timeout to allow clicks inside the bubble menu itself
      setTimeout(() => {
        if (!editor.isFocused && !menuRef.current?.contains(document.activeElement)) {
          setIsOpen(false);
        }
      }, 150);
    };

    editor.on("selectionUpdate", handleSelectionUpdate);
    editor.on("focus", handleSelectionUpdate);
    editor.on("blur", handleFocusBlur);

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate);
      editor.off("focus", handleSelectionUpdate);
      editor.off("blur", handleFocusBlur);
    };
  }, [editor]);

  if (!isOpen || !coords || !editor) return null;

  const handleAIAction = async (instruction: string) => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, " ");

    if (!selectedText.trim()) {
      toast.error("Please select some text first!");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("AI is thinking...");

    try {
      const response = await getAIPromptResponse(selectedText, instruction);
      
      if (!response) {
        throw new Error("No response received");
      }

      // Stream/Typewriter effect back into the editor!
      toast.dismiss(toastId);
      toast.success("AI suggestion generated!");

      // 1. Delete original selection
      editor.chain().focus().deleteSelection().run();

      // 2. Stream in the new text character by character / word by word
      const words = response.split(/(\s+)/);
      let wordIndex = 0;

      const streamInterval = setInterval(() => {
        if (!editor || wordIndex >= words.length) {
          clearInterval(streamInterval);
          setIsLoading(false);
          setIsOpen(false);
          return;
        }

        editor.chain().focus().insertContent(words[wordIndex]).run();
        wordIndex++;
      }, 40); // 40ms per word is a very natural typing speed!

    } catch {
      toast.dismiss(toastId);
      toast.error("Failed to generate AI response.");
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleAIAction(customPrompt.trim());
    setCustomPrompt("");
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        top: `${coords.top - 55}px`, // Place above selection
        left: `${coords.left}px`,
        transform: "translateX(-50%)",
      }}
      className="z-50 bg-[#1E293B] border border-neutral-700/60 shadow-2xl rounded-xl p-2 flex flex-col gap-y-1.5 w-[320px] text-white animate-in zoom-in-95 duration-100 backdrop-blur-md bg-opacity-95"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-4 gap-x-2 text-xs text-neutral-300">
          <Loader2 className="size-4 animate-spin text-indigo-400" />
          <span>Gemini is generating response...</span>
        </div>
      ) : (
        <>
          {/* Quick Actions Header */}
          <div className="flex items-center justify-between px-1.5 py-0.5 border-b border-neutral-700/50 pb-1.5 mb-1 text-[11px] font-medium text-neutral-400">
            <div className="flex items-center gap-x-1.5">
              <Sparkles className="size-3 text-indigo-400 animate-pulse" />
              <span>AI Writing Copilot</span>
            </div>
            <span>Beta</span>
          </div>

          {/* Quick Action Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 justify-start text-[11px] text-neutral-200 hover:text-white hover:bg-neutral-800 font-normal px-2"
              onClick={() => handleAIAction("Summarize this text clearly in a short paragraph.")}
            >
              <FileText className="size-3.5 mr-1.5 text-blue-400" />
              Summarize
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 justify-start text-[11px] text-neutral-200 hover:text-white hover:bg-neutral-800 font-normal px-2"
              onClick={() => handleAIAction("Simplify this text to make it extremely clear and concise.")}
            >
              <Minimize2 className="size-3.5 mr-1.5 text-emerald-400" />
              Simplify
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 justify-start text-[11px] text-neutral-200 hover:text-white hover:bg-neutral-800 font-normal px-2"
              onClick={() => handleAIAction("Rewrite this text in a formal, professional corporate tone.")}
            >
              <MessageSquareCode className="size-3.5 mr-1.5 text-purple-400" />
              Make Professional
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 justify-start text-[11px] text-neutral-200 hover:text-white hover:bg-neutral-800 font-normal px-2"
              onClick={() => handleAIAction("Translate this text to fluent English.")}
            >
              <Languages className="size-3.5 mr-1.5 text-amber-400" />
              Translate to English
            </Button>
          </div>

          {/* Custom Instruction Input */}
          <form onSubmit={handleCustomSubmit} className="mt-1 border-t border-neutral-700/50 pt-2 flex gap-x-1.5">
            <Input
              placeholder="Ask AI (e.g. Translate to Spanish, make bullet list...)"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="h-7 text-[10px] bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500 focus-visible:ring-indigo-500"
            />
            <Button
              type="submit"
              size="icon"
              className="size-7 bg-indigo-600 hover:bg-indigo-700 text-white flex-shrink-0"
            >
              <CornerDownLeft className="size-3.5" />
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
