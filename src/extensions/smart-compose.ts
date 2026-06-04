import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

export interface SmartComposeOptions {
  onTriggerCompose?: (context: string) => Promise<string>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    smartCompose: {
      setSuggestion: (text: string) => ReturnType;
      clearSuggestion: () => ReturnType;
    };
  }
}

export const SmartCompose = Extension.create<SmartComposeOptions>({
  name: "smartCompose",

  addOptions() {
    return {
      onTriggerCompose: async () => "",
    };
  },

  addStorage() {
    return {
      suggestion: null as string | null,
    };
  },

  addCommands() {
    return {
      setSuggestion: (text: string) => ({ editor }) => {
        this.storage.suggestion = text;
        // Force a transaction update to trigger decoration redraw
        editor.view.dispatch(editor.state.tr);
        return true;
      },
      clearSuggestion: () => ({ editor }) => {
        this.storage.suggestion = null;
        editor.view.dispatch(editor.state.tr);
        return true;
      },
    };
  },

  addProseMirrorPlugins() {
    const key = new PluginKey("smartComposeKey");
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const extension = this;

    return [
      new Plugin({
        key,
        props: {
          decorations(state) {
            const suggestion = extension.storage.suggestion;
            if (!suggestion || !state.selection.empty) {
              return DecorationSet.empty;
            }

            const { to } = state.selection;
            
            // Create a widget decoration at the current cursor position
            const span = document.createElement("span");
            span.className = "text-neutral-400 select-none opacity-50 pointer-events-none inline-block font-normal";
            span.textContent = suggestion;
            
            const decoration = Decoration.widget(to, span, { side: 1 });
            return DecorationSet.create(state.doc, [decoration]);
          },
          handleKeyDown(view, event) {
            const suggestion = extension.storage.suggestion;
            if (!suggestion) return false;

            if (event.key === "Tab") {
              event.preventDefault();
              const { to } = view.state.selection;
              
              // Insert the suggestion text
              const tr = view.state.tr.insertText(suggestion, to);
              view.dispatch(tr);
              
              // Clear suggestion
              extension.storage.suggestion = null;
              view.focus();
              return true;
            }

            // Dismiss the ghost text on other keydowns, except modifiers
            if (
              event.key !== "Shift" && 
              event.key !== "Control" && 
              event.key !== "Alt" && 
              event.key !== "Meta"
            ) {
              extension.storage.suggestion = null;
              view.dispatch(view.state.tr);
            }
            return false;
          },
        },
      }),
    ];
  },
});
