import { create } from "zustand";

interface RevisionState {
  isSidebarOpen: boolean;
  isPreviewMode: boolean;
  previewContent: string | null;
  activeDocContentBeforePreview: string | null;
  selectedRevisionId: string | null;
  
  setSidebarOpen: (open: boolean) => void;
  setPreviewMode: (preview: boolean) => void;
  setPreviewContent: (content: string | null) => void;
  setActiveDocContentBeforePreview: (content: string | null) => void;
  setSelectedRevisionId: (id: string | null) => void;
  
  exitPreview: () => void;
}

export const useRevisionStore = create<RevisionState>((set) => ({
  isSidebarOpen: false,
  isPreviewMode: false,
  previewContent: null,
  activeDocContentBeforePreview: null,
  selectedRevisionId: null,

  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
  setPreviewContent: (previewContent) => set({ previewContent }),
  setActiveDocContentBeforePreview: (activeDocContentBeforePreview) => set({ activeDocContentBeforePreview }),
  setSelectedRevisionId: (selectedRevisionId) => set({ selectedRevisionId }),

  exitPreview: () => set({
    isPreviewMode: false,
    previewContent: null,
    selectedRevisionId: null
  })
}));
