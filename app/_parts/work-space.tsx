"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Editor, OnMount } from "@monaco-editor/react"
import { AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd, AlignHorizontalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart, Check, ClipboardCheck, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import type * as Monaco from "monaco-editor"
import { useEditor } from "@/hooks/use-editor"
import { bootstrapcss, bootstrapjs, bootstrapLink, tailwindjs, tailwindLink } from "@/lib/constants"
import { useEffect, useRef, useState } from "react"
import { Horizontal, useAlignment, usePreview, Vertical } from "@/hooks/use-preview"
import Script from "next/script"
import { cn } from "@/lib/utils"

export const WorkSpace = ({ className }: { className?: string }) => {
    return (
        <div className={`flex justify-center gap-x-2 p-3 ${className}`}>
            <CodePanel className="w-1/2" />
            <PreviewPanel className="w-1/2" />
        </div>
    )
}

const PreviewPanel = ({ className }: { className?: string }) => {
    return (
        <div className={`border rounded ${className}`}>
            <PreviewTools />
            <PreviewFrame />
        </div>
    )
}


const PreviewFrame = ({ className }: { className?: string }) => {
    const codes = useEditor(state => state.codes)
    const css = useEditor(state => state.css)

    const h = usePreview(state => state.horizontal)
    const v = usePreview(state => state.vertical)

    const alignment = useAlignment()

    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    // const html = `
    //         <html>
    //             <head>
    //                 ${css === "tailwind" ? tailwindLink : ''}
    //                 ${css === "bootstrap" ? bootstrapLink : ''}
    //             </head>
    //             <body>
    //                 <div id="mainFrame"
    //                     class="
    //                     ${css === "bootstrap" ? "vh-100" : ''}
    //                     ${css === "tailwind" ? "h-screen" : ''}
    //                     ${alignment(h, v)}
    //                     "
    //                 >
    //                     ${codes}
    //                 </div>
    //             </body>
    //         </html>
    //     `

    const html = `
            <html>
                <head>
                </head>
                <body>
                    <div id="mainFrame">
                    </div>
                </body>
            </html>
        `

    useEffect(() => {
        const iframe = iframeRef?.current
        if (iframe) iframe.srcdoc = html
    }, [iframeRef, html])

    useEffect(() => {

        const refresh = () => {

            const doc = iframeRef?.current?.contentDocument

            const mainFrame = doc?.querySelector("#mainFrame")

            if(mainFrame) {
                mainFrame.innerHTML = codes as string
                mainFrame.className = cn(`
                    ${css === "bootstrap" ? "vh-100" : ''}
                    ${css === "tailwind" ? "h-screen" : ''}
                    ${alignment(h, v)}
                `)
            }
        }

        const load = () => {
            const doc = iframeRef?.current?.contentDocument
            if(!doc) return

            const head = doc?.head
            head.innerHTML = ""
            if (css === "tailwind") {
                const script = doc.createElement("script")
                script.src = tailwindjs
                script.onload = refresh
                head.appendChild(script)
            } else if (css === "bootstrap") {
                head.innerHTML = bootstrapLink
            }
        }
        load()
        
        if(codes) refresh()

    }, [codes, css, h, v, alignment])

    return (
        <div className={`p-2 h-[400] ${className}`}>
            <iframe ref={iframeRef} sandbox="allow-scripts allow-same-origin" className="h-full w-full" />
        </div>
    )
}

const PreviewTools = ({ className }: { className?: string }) => {
    const setHorizontal = usePreview(state => state.setHorizontal)
    const setVertical = usePreview(state => state.setVertical)

    return (
        <div className={`p-3 border-b flex justify-between items-center ${className}`}>
            <div>Preview</div>
            <div className="flex gap-x-3">
                <ToggleGroup variant={"outline"} onValueChange={value => value && setHorizontal(value[0] as Horizontal)}>
                    <ToggleGroupItem value="start"><AlignHorizontalJustifyStart /></ToggleGroupItem>
                    <ToggleGroupItem value="center"><AlignHorizontalJustifyCenter /></ToggleGroupItem>
                    <ToggleGroupItem value="end"><AlignHorizontalJustifyEnd /></ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup variant={"outline"} onValueChange={value => setVertical(value && value[0] as Vertical)}>
                    <ToggleGroupItem value="top"><AlignVerticalJustifyStart /></ToggleGroupItem>
                    <ToggleGroupItem value="center"><AlignVerticalJustifyCenter /></ToggleGroupItem>
                    <ToggleGroupItem value="bottom"><AlignVerticalJustifyEnd /></ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    )
}

const CodePanel = ({ className }: { className?: string }) => {
    return (
        <div className={`border rounded ${className}`}>
            <EditorTools />
            <CodeEditor className="h-[400]" />
        </div>
    )
}

const CodeEditor = ({ className }: { className?: string }) => {
    const { theme } = useTheme()
    const setCodes = useEditor(state => state.setCodes)
    const setEditor = useEditor(state => state.setEditor)

    const onMount: OnMount = (editor, monaco: typeof Monaco) => {
        setEditor(editor)
        editor.focus()
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
            const codes = editor.getValue()
            setCodes(codes)
        })
    }

    return (
        <Editor className={` ${className}`}
            onMount={onMount}
            language="html"
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            defaultLanguage="html"
            options={{
                fontFamily: "JetBrains Mono",
                minimap: { enabled: false },
                padding: {
                    top: 16, bottom: 16,
                },
                quickSuggestions: false,
            }} />
    )
}

const EditorTools = ({ className }: { className?: string }) => {
    return (
        <div className={`p-3 border-b flex justify-between ${className}`}>
            <CssSelect />
            <Actions />
        </div>
    )
}

const Actions = ({ className }: { className?: string }) => {

    return (
        <div className={`flex items-center gap-x-2 ${className}`}>
            {/* <Toggle><Check/> Auto Refresh</Toggle> */}
            <CopyButton />
            <Button>Copy as React</Button>
        </div>
    )
}

const CopyButton = ({ className }: { className?: string }) => {
    const [copying, setCopying] = useState(false)
    useEffect(() => {
        if (!copying) return
        setTimeout(() => setCopying(!copying), 1500)
    }, [copying])
    const editor = useEditor(state => state.editor)
    const copy = async () => {
        setCopying(!copying)
        await navigator.clipboard.writeText(editor?.getValue() as string)
    }

    return (
        <>
            <Button className={className} onClick={copy} variant={"ghost"}>
                {!copying ? <Copy /> : <ClipboardCheck />}
            </Button>
        </>
    )
}

const CssSelect = ({ className }: { className?: string }) => {
    const css = useEditor(state => state.css)
    const setCss = useEditor(state => state.setCss)
    return (
        <div className={` ${className}`}>
            <Select onValueChange={value => setCss(value as "tailwind" | "bootstrap")} defaultValue={css}>
                <SelectTrigger>
                    <SelectValue placeholder="Select css library" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Css Framework</SelectLabel>
                        <SelectItem value="tailwind">Tailwind</SelectItem>
                        <SelectItem value="bootstrap">Bootstrap</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}