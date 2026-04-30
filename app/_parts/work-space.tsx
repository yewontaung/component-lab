"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Editor, OnMount } from "@monaco-editor/react"
import { AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd, AlignHorizontalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd, AlignVerticalJustifyStart, Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import type * as Monaco from "monaco-editor"
import { useEditor } from "@/hooks/use-editor"
import { bootstrapLink, tailwindLink } from "@/lib/constants"

export const WorkSpace = ({ className }: { className?: string }) => {
    return (
        <div className={`flex justify-center gap-x-2 p-3 ${className}`}>
            <CodePanel className="w-1/2" />
            <PreviewPanel className="w-1/2" />
        </div>
    )
}

const PreviewPanel = ({className}:{className?:string}) => {
    return (
        <div className={`border rounded ${className}`}>
            <PreviewTools />
            <PreviewFrame />
        </div>
    )
}

const PreviewFrame = ({className}:{className?:string}) => {
    const codes = useEditor(state => state.codes)
    const css = useEditor(state => state.css)
    console.log(css)
    const html = `
        <html>
            <head>
                ${css === "tailwind" ? tailwindLink : ''}
                ${css === "bootstrap" ? bootstrapLink : ''}
            </head>
            <body>
                ${codes}
            </body>
        </html>
    `
    return (
        <div className={`p-2 h-[400] ${className}`}>
            <iframe sandbox="allow-scripts allow-same-origin" className="h-full w-full" srcDoc={html} />
        </div>
    )
}

const PreviewTools = ({className}:{className?:string}) => {
    return (
        <div className={`p-3 border-b flex justify-between items-center ${className}`}>
            <div>Preview</div>
            <div className="flex gap-x-3">
                <ToggleGroup variant={"outline"}>
                    <ToggleGroupItem><AlignHorizontalJustifyStart/></ToggleGroupItem>
                    <ToggleGroupItem><AlignHorizontalJustifyCenter/></ToggleGroupItem>
                    <ToggleGroupItem><AlignHorizontalJustifyEnd/></ToggleGroupItem>
                </ToggleGroup>
                <ToggleGroup variant={"outline"}>
                    <ToggleGroupItem><AlignVerticalJustifyStart/></ToggleGroupItem>
                    <ToggleGroupItem><AlignVerticalJustifyCenter/></ToggleGroupItem>
                    <ToggleGroupItem><AlignVerticalJustifyEnd/></ToggleGroupItem>
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
    const {theme} = useTheme()
    const setCodes = useEditor(state => state.setCodes)

    const onMount:OnMount = (editor, monaco: typeof Monaco) => {
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
        <div className="flex items-center gap-x-2">
            <Toggle><Check/> Auto Refresh</Toggle>
            <Button variant={"ghost"}><Copy/></Button>
            <Button>Copy as React</Button>
        </div>
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