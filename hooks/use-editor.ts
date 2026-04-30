import { create } from "zustand"
import type * as Monaco from "monaco-editor"

type AppEditorState = {
    codes?:string,
    css:"tailwind" | "bootstrap",
    editor?:Monaco.editor.IStandaloneCodeEditor,
    setCodes:(code:string) => void,
    setCss:(css:"tailwind" | "bootstrap") => void
    setEditor:(editor:Monaco.editor.IStandaloneCodeEditor) => void
}

export const useEditor = create<AppEditorState>(set => ({
    codes: "",
    css: "tailwind",
    setCodes: (codes) => set({codes}),
    setCss: (css) => set({css}),
    setEditor: (editor) => set({editor})
}))