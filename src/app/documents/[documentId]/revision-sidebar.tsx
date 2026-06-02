"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id, Doc } from "../../../../convex/_generated/dataModel";
import { useRevisionStore } from "@/store/use-revision-store";
import { useEditorStore } from "@/store/use-editor-store";
import { useBroadcastEvent, useEventListener } from "@liveblocks/react";
import { formatDistanceToNow } from "date-fns";
import { 
  X, 
  History, 
  Plus, 
  RotateCcw, 
  Eye, 
  User, 
  Calendar,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { renderDiffToHTML } from "@/lib/diff";
import { toast } from "sonner";

interface RevisionSidebarProps {
  documentId: Id<"documents">;
}

export function RevisionSidebar({ documentId }: RevisionSidebarProps) {
  const { 
    isSidebarOpen, 
    setSidebarOpen, 
    isPreviewMode,
    setPreviewMode,
    setSelectedRevisionId,
    selectedRevisionId,
    setActiveDocContentBeforePreview,
    activeDocContentBeforePreview,
    exitPreview
  } = useRevisionStore();

  const { editor } = useEditorStore();
  const broadcast = useBroadcastEvent();
  const [snapshotTitle, setSnapshotTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // All collaborators in the room listen for restore events and apply them locally
  useEventListener(({ event }) => {
    if (event.type === "RESTORE_REVISION" && editor) {
      editor.setEditable(true);
      editor.commands.setContent(event.content);
    }
  });

  const revisions = useQuery(api.revisions.getRevisionsByDocId, { documentId });
  const createRevisionMutation = useMutation(api.revisions.createRevision);
  const updateInitialContentMutation = useMutation(api.revisions.updateDocInitialContent);

  if (!isSidebarOpen) return null;

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || !snapshotTitle.trim()) return;

    setIsCreating(true);
    try {
      // Capture plain text or clean HTML. Let's capture the text content
      const content = editor.getText();
      await createRevisionMutation({
        documentId,
        content,
        title: snapshotTitle.trim(),
      });
      toast.success("Snapshot created successfully!");
      setSnapshotTitle("");
    } catch {
      toast.error("Failed to create snapshot");
    } finally {
      setIsCreating(false);
    }
  };

  const handlePreviewRevision = (revision: Doc<"revisions">) => {
    if (!editor) return;

    // If not already in preview mode, cache the active collaborative content
    if (!isPreviewMode) {
      setActiveDocContentBeforePreview(editor.getHTML());
    }

    // Compute diff: revision content (original) vs current editor plain text
    const currentText = editor.getText();
    const diffHTML = renderDiffToHTML(revision.content, currentText);

    // Enter preview mode
    setPreviewMode(true);
    setSelectedRevisionId(revision._id);
    
    // Set editor content to the visual diff and lock editing
    editor.commands.setContent(diffHTML);
    editor.setEditable(false);
    
    toast.info(`Viewing revision: ${revision.title}`);
  };

  const handleRestoreRevision = async (revision: Doc<"revisions">) => {
    if (!editor) return;

    try {
      // 1. Update initialContent in Convex database
      // If the content stored is plain text, let's turn it into HTML paragraphs for Tiptap
      const restoredHTML = revision.content
        .split("\n\n")
        .map((p: string) => `<p>${p}</p>`)
        .join("");

      await updateInitialContentMutation({
        documentId,
        content: restoredHTML,
      });

      // 2. Broadcast to all collaborators in the room so everyone sees the restore
      broadcast({ type: "RESTORE_REVISION", content: restoredHTML });

      // 3. Apply locally
      editor.setEditable(true);
      editor.commands.setContent(restoredHTML);

      // 4. Clear revision store states
      exitPreview();
      toast.success("Document successfully restored to selected version!");
    } catch {
      toast.error("Failed to restore document version");
    }
  };

  return (
    <div className="fixed right-0 top-[114px] bottom-0 w-[350px] bg-white border-l border-neutral-200 shadow-2xl flex flex-col z-20 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
        <div className="flex items-center gap-x-2">
          <History className="size-5 text-neutral-800" />
          <h2 className="font-semibold text-neutral-800">Version History</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="size-8 text-neutral-500 hover:text-neutral-800"
          onClick={() => {
            if (isPreviewMode) {
              // Restore original collaborative content on close
              if (editor && activeDocContentBeforePreview) {
                editor.setEditable(true);
                editor.commands.setContent(activeDocContentBeforePreview);
              }
              exitPreview();
            }
            setSidebarOpen(false);
          }}
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Snapshot Creator */}
        {!isPreviewMode && (
          <form onSubmit={handleCreateSnapshot} className="p-3 border border-neutral-200 rounded-lg bg-neutral-50/50 space-y-2">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Save Current Snapshot</h3>
            <div className="flex gap-x-2">
              <Input
                placeholder="e.g. Draft 1, Revision A"
                value={snapshotTitle}
                onChange={(e) => setSnapshotTitle(e.target.value)}
                className="h-8 text-xs"
                disabled={isCreating}
              />
              <Button type="submit" size="sm" className="h-8 px-2 text-xs bg-black hover:bg-neutral-800 text-white" disabled={isCreating}>
                <Plus className="size-3.5 mr-1" /> Save
              </Button>
            </div>
          </form>
        )}

        {/* Revision List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Past Revisions</h3>
          
          {!revisions ? (
            <div className="text-center py-8 text-neutral-400 text-xs">Loading versions...</div>
          ) : revisions.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">No saved versions found.</div>
          ) : (
            <div className="space-y-2.5">
              {revisions.map((rev) => {
                const isSelected = selectedRevisionId === rev._id;
                return (
                  <div 
                    key={rev._id}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                      isSelected 
                        ? "border-black bg-neutral-50 shadow-sm" 
                        : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/30 cursor-pointer"
                    }`}
                    onClick={() => handlePreviewRevision(rev)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1 pr-2">
                        <p className={`text-sm font-semibold truncate ${isSelected ? "text-neutral-900" : "text-neutral-800"}`}>
                          {rev.title}
                        </p>
                        <div className="flex items-center gap-x-1.5 text-[11px] text-neutral-500">
                          <Calendar className="size-3 flex-shrink-0" />
                          <span>{formatDistanceToNow(rev.createdAt, { addSuffix: true })}</span>
                        </div>
                        <div className="flex items-center gap-x-1.5 text-[11px] text-neutral-500">
                          <User className="size-3 flex-shrink-0" />
                          <span className="truncate">Saved by {rev.authorName}</span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="size-4.5 text-neutral-800 flex-shrink-0 mt-0.5" />
                      )}
                    </div>

                    {/* Actions if selected */}
                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-200 flex gap-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-[10px] px-2 py-0 border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (editor && activeDocContentBeforePreview) {
                              editor.setEditable(true);
                              editor.commands.setContent(activeDocContentBeforePreview);
                            }
                            exitPreview();
                          }}
                        >
                          <X className="size-3 mr-1" /> Exit Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="h-7 text-[10px] px-2 py-0 bg-black hover:bg-neutral-800 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRestoreRevision(rev);
                          }}
                        >
                          <RotateCcw className="size-3 mr-1" /> Restore Version
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
