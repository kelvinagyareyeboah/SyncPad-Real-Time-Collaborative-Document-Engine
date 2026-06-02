"use client";

import { Preloaded, usePreloadedQuery, useQuery, useMutation } from "convex/react";

import { Room } from "./room";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Toolbar } from "./toolbar";
import { RevisionSidebar } from "./revision-sidebar";
import { AIBubbleMenu } from "./ai-bubble-menu";
import { useRevisionStore } from "@/store/use-revision-store";
import { useEditorStore } from "@/store/use-editor-store";
import { useZenStore } from "@/store/use-zen-store";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument);
  const { 
    isSidebarOpen, 
    isPreviewMode, 
    selectedRevisionId,
    activeDocContentBeforePreview,
    exitPreview 
  } = useRevisionStore();
  
  const { editor } = useEditorStore();
  const { isZenMode, toggleZenMode } = useZenStore();
  
  const revisions = useQuery(api.revisions.getRevisionsByDocId, { documentId: document._id });
  const updateInitialContentMutation = useMutation(api.revisions.updateDocInitialContent);

  const selectedRevision = revisions?.find((r) => r._id === selectedRevisionId);

  const handleClosePreview = () => {
    if (!editor) return;
    if (activeDocContentBeforePreview) {
      editor.setEditable(true);
      editor.commands.setContent(activeDocContentBeforePreview);
    }
    exitPreview();
    toast.info("Exited version preview");
  };

  const handleRestore = async () => {
    if (!editor || !selectedRevision) return;

    try {
      const restoredHTML = selectedRevision.content
        .split("\n\n")
        .map((p: string) => `<p>${p}</p>`)
        .join("");

      await updateInitialContentMutation({
        documentId: document._id,
        content: restoredHTML,
      });

      editor.setEditable(true);
      editor.commands.setContent(restoredHTML);
      exitPreview();
      toast.success("Document successfully restored to selected version!");
    } catch {
      toast.error("Failed to restore document version");
    }
  };

  return (
    <Room>
      <div className="min-h-screen bg-editor-bg flex flex-col transition-all duration-300">
        {/* Top Navigation */}
        <div 
          className={`flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden h-[112px] transition-all duration-300 ease-in-out ${
            isZenMode ? "-translate-y-[114px]" : "translate-y-0"
          }`}
        >
          <Navbar data={document} />
          <Toolbar />
        </div>

        {/* Content Wrapper */}
        <div 
          className={`flex-1 flex print:pt-0 relative overflow-hidden transition-all duration-300 ease-in-out ${
            isZenMode ? "pt-4" : "pt-[114px]"
          }`}
        >
          {/* Main Writing Area */}
          <div 
            className={`flex-1 flex flex-col transition-all duration-200 ${
              isSidebarOpen ? "pr-[350px]" : ""
            }`}
          >
            {/* Revision Preview Alert Banner */}
            {isPreviewMode && selectedRevision && (
              <div className="bg-black text-white py-2.5 px-4 flex items-center justify-between text-xs animate-in slide-in-from-top duration-200 print:hidden font-medium z-10 shadow-sm border-b border-neutral-800">
                <div className="flex items-center gap-x-2">
                  <AlertCircle className="size-4 text-neutral-300 animate-bounce" />
                  <div className="flex flex-col sm:flex-row sm:gap-x-2">
                    <span className="font-bold text-neutral-100 uppercase tracking-wide bg-white/10 px-1.5 py-0.5 rounded text-[10px] w-fit">
                      PREVIEWING SNAPSHOT: {selectedRevision.title}
                    </span>
                    <span>
                      Showing visual diff against active workspace. Collaborative editing is paused.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-x-3">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-7 text-neutral-200 hover:text-white hover:bg-white/10 text-xs px-3.5 py-0"
                    onClick={handleClosePreview}
                  >
                    <X className="size-3.5 mr-1" /> Close Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-7 bg-white text-black hover:bg-neutral-100 text-xs font-semibold px-3.5 py-0 shadow-sm"
                    onClick={handleRestore}
                  >
                    <RotateCcw className="size-3.5 mr-1" /> Restore Version
                  </Button>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto relative">
              <Editor initialContent={document.initialContent} />
              <AIBubbleMenu />
            </div>
          </div>

          {/* Revision History Sidebar */}
          <RevisionSidebar documentId={document._id} />
        </div>

        {/* Floating Zen Toggle Button */}
        <button
          onClick={toggleZenMode}
          className="fixed bottom-6 left-6 z-30 size-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 opacity-30 hover:opacity-100 border border-slate-700/50 backdrop-blur"
          title={isZenMode ? "Exit Zen Mode" : "Enter Zen Mode"}
        >
          {isZenMode ? <Eye className="size-5 text-white" /> : <EyeOff className="size-5 text-neutral-400" />}
        </button>
      </div>
    </Room>
  );
};

