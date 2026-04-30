import { create } from "zustand"

type AppEditorState = {
    codes?:string,
    css:"tailwind" | "bootstrap",
    setCodes:(code:string) => void,
    setCss:(css:"tailwind" | "bootstrap") => void
}

export const useEditor = create<AppEditorState>(set => ({
    codes: "",
    css: "tailwind",

    setCodes: (codes) => set({codes}),
    setCss: (css) => set({css}),
}))