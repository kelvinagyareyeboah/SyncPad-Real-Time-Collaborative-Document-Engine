"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";

import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";

import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";

import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";

import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

import TextAlign from "@tiptap/extension-text-align";

import Link from "@tiptap/extension-link";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { useStorage } from "@liveblocks/react";

import { useEditorStore } from "@/store/use-editor-store";
import { FontSizeExtensions } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { SmartCompose } from "@/extensions/smart-compose";
import { getSmartComposeSuggestion } from "./ai-action";
import { useZenStore } from "@/store/use-zen-store";
import { Ruler } from "./ruler";
import { Threads } from "./threads";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/constants/margins";
import { useEffect, useRef } from "react";

interface EditorProps {
  initialContent?: string | undefined;
}

export const Editor = ({ initialContent }: EditorProps) => {
  const leftMargin = useStorage((root) => root.leftMargin) ?? LEFT_MARGIN_DEFAULT;
  const rightMargin = useStorage((root) => root.rightMargin) ?? RIGHT_MARGIN_DEFAULT;

  const liveblocks = useLiveblocksExtension({
    initialContent,
    // offlineSupport buffers ops locally and replays them on reconnect via Yjs
    offlineSupport_experimental: true,
  });
  const { setEditor } = useEditorStore();
  const { isZenMode } = useZenStore();
  
  const composeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (composeTimeoutRef.current) {
        clearTimeout(composeTimeoutRef.current);
      }
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      setEditor(editor);

      // Debounce and trigger Smart Compose autocomplete suggestions
      if (composeTimeoutRef.current) {
        clearTimeout(composeTimeoutRef.current);
      }

      // Skip suggestions if editor is not editable (e.g. in Revision Time-Travel Mode)
      if (!editor.isEditable) return;

      composeTimeoutRef.current = setTimeout(async () => {
        if (!editor.state.selection.empty) return;

        const { to } = editor.state.selection;
        // Grab context of 150 characters before the cursor to predict completion
        const textBefore = editor.state.doc.textBetween(Math.max(0, to - 150), to, "\n");

        if (textBefore.trim().length < 5) return;

        try {
          const suggestion = await getSmartComposeSuggestion(textBefore);
          if (suggestion && suggestion.trim().length > 0) {
            editor.commands.setSuggestion(suggestion);
          }
        } catch (e) {
          console.error("Smart compose fetch error:", e);
        }
      }, 700);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
      editor.commands.clearSuggestion();
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: `padding-left: ${leftMargin}px; padding-right: ${rightMargin}px;`,
        class:
          "focus:outline-none print:boder-0 border bg-white border-editor-border flex flex-col min-h-[1054px] w-full md:w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        // Disable built-in history — Yjs (via Liveblocks) manages collaborative
        // undo/redo so all peers share a single consistent history stack
        history: false,
      }),
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TaskList,
      Image,
      ImageResize,
      Underline,
      FontFamily,
      TextStyle,
      Color,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "1.5",
      }),
      FontSizeExtensions,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Highlight.configure({
        multicolor: true,
      }),
      TaskItem.configure({ nested: true }),
      SmartCompose,
    ],
  });

  return (
    <div className="size-full overflow-x-auto bg-editor-bg px-4 print:p-0 print:bg-white print:overflow-visible">
      {!isZenMode && <Ruler />}
      <div className="min-w-0 md:min-w-max flex justify-center w-full md:w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
        <Threads editor={editor} />
      </div>
    </div>
  );
};

