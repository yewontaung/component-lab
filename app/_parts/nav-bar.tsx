"use client"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export const NavBar = ({className}:{className?:string}) => {
    return (
        <div className={`p-3 shadow ${className}`}>
            <div className="flex justify-between items-center px-5">
                <h2 className="text-3xl font-bold">ComponentLab</h2>
                <div>
                    <ThemeButton />
                </div>
            </div>
        </div>
    )
}

const ThemeButton = ({className}:{className?:string}) => {
    const {theme, setTheme} = useTheme()
    const toggle = () => theme === "dark" ? setTheme("light") : setTheme("dark");
    return (
        <>
            <Button onClick={toggle} variant={"outline"} size={"icon-lg"} className={`rounded-full ${className}`}>
                {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
        </>        
    )
}