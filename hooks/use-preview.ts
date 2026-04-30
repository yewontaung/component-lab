import { create } from "zustand"
import { useEditor } from "./use-editor"

export type Horizontal = "start" | "center" | "end"
export type Vertical = "top" | "center" | "bottom"

type PreviewState = {
    horizontal?: Horizontal,
    vertical?: Vertical,
    setHorizontal: (horizontal:Horizontal) => void,
    setVertical: (vertical:Vertical) => void,
}

export const usePreview = create<PreviewState>(set => ({
    setHorizontal: (horizontal) => set({horizontal}),
    setVertical: (vertical) => set({vertical}),
}))

const H = {
    "tailwind": {
        "start": "justify-start",
        "center": "justify-center",
        "end": "justify-end",
    },
    "bootstrap": {
        "start": "justify-content-start",
        "center": "justify-content-center",
        "end": "justify-content-end",
    },
}

const V = {
    "tailwind": {
        "top": "items-start",
        "center": "items-center",
        "bottom": "items-end",
    },
    "bootstrap": {
        "top": "align-items-start",
        "center": "align-items-center",
        "bottom": "align-items-end",
    },
}

export const useAlignment = () => {
    const css = useEditor(state => state.css)

    const safeH = (style:typeof H.tailwind | typeof H.bootstrap, h?:Horizontal, ) => h ? style[h] : ''
    const safeV = (style:typeof V.tailwind | typeof V.bootstrap, v?:Vertical, ) => v ? style[v] : ''

    return (h?:Horizontal, v?:Vertical) => css === "tailwind" ? 
        `${h || v ? "flex" : ''} ${safeH(H.tailwind, h)} ${safeV(V.tailwind, v)}` : 
        `${h || v ? "d-flex" : ''} ${safeH(H.bootstrap, h)} ${safeV(V.bootstrap, v)}`
}