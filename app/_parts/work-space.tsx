"use client"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { Editor } from "@monaco-editor/react"
import { Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"

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
    return (
        <div className="p-2 h-[400]">
            <iframe />
        </div>
    )
}

const PreviewTools = ({className}:{className?:string}) => {
    return (
        <div className={`p-3 border-b flex justify-between ${className}`}>
            Preview            
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
    return (
        <Editor className={` ${className}`}
            language="html"
            theme={theme === "dark" ? "vs-dark" : "vs-light"}
            defaultLanguage="html"
            options={{
                fontFamily: "JetBrains Mono",
                minimap: { enabled: false },
                padding: {
                    top: 16, bottom: 16,
                }
            }} />
    )
}

const EditorTools = ({ className }: { className?: string }) => {
    return (
        <div className={`p-3 border-b flex justify-between ${className}`}>
            <FrameworkSelect />
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

const FrameworkSelect = ({ className }: { className?: string }) => {
    return (
        <div className={` ${className}`}>
            <Select defaultValue="tailwind">
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