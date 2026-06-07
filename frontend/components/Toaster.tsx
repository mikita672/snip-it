"use client"

import { useTheme } from "next-themes"
import { Toaster as _Toaster } from "sonner"

export function Toaster() {
    const { theme = "system" } = useTheme()

    return (
        <_Toaster
            theme={theme as "light" | "dark" | "system"}
            position="bottom-center"
            toastOptions={{
                classNames: {
                    toast: "bg-background text-foreground border-border",
                    description: "!text-light",
                    success: "!bg-success !text-light !border-success",
                    error: "!bg-destructive !text-light !border-destructive",
                    warning: "!bg-warning !text-light !border-warning",
                },
            }}
        />
    )
}