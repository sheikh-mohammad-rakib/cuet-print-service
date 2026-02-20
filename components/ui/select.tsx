"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
    labels: Record<string, React.ReactNode>
    setLabel: (value: string, label: React.ReactNode) => void
} | null>(null)

interface SelectProps {
    children: React.ReactNode
    onValueChange?: (value: string) => void
    defaultValue?: string
    value?: string
}

const Select = ({ children, onValueChange, defaultValue, value: controlledValue }: SelectProps) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState(controlledValue || defaultValue || "")
    const [labels, setLabels] = React.useState<Record<string, React.ReactNode>>({})

    // Update internal state if controlled value changes
    React.useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue)
        }
    }, [controlledValue])

    const handleValueChange = React.useCallback((newValue: string) => {
        if (controlledValue === undefined) {
            setValue(newValue)
        }
        onValueChange?.(newValue)
        setOpen(false)
    }, [controlledValue, onValueChange])

    const setLabel = React.useCallback((val: string, label: React.ReactNode) => {
        setLabels(prev => {
            // Very simple check to avoid some loops, though React nodes are hard to compare
            if (prev[val] === label) return prev
            return { ...prev, [val]: label }
        })
    }, [])

    const contextValue = React.useMemo(() => ({
        value,
        onValueChange: handleValueChange,
        open,
        setOpen,
        labels,
        setLabel
    }), [value, handleValueChange, open, labels, setLabel])

    return (
        <SelectContext.Provider value={contextValue}>
            <div className="relative inline-block w-full">{children}</div>
        </SelectContext.Provider>
    )
}

const SelectTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => context?.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
>(({ className, placeholder, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    // If we have a selected value, show its label. Otherwise show placeholder.
    const display = (context?.value && context.labels[context.value]) ? context.labels[context.value] : placeholder

    return (
        <span ref={ref} className={cn("block truncate", className)} {...props}>
            {display}
        </span>
    )
})
SelectValue.displayName = "SelectValue"

const SelectContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(SelectContext)

    if (!context?.open) return null

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={() => context.setOpen(false)} />
            <div
                ref={ref}
                className={cn(
                    "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 w-full mt-1",
                    className
                )}
                {...props}
            >
                <div className="p-1">{children}</div>
            </div>
        </>
    )
})
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string, disabled?: boolean }
>(({ className, children, value, disabled, ...props }, ref) => {
    const context = React.useContext(SelectContext)
    const isSelected = context?.value === value

    // Register label
    const setLabel = context?.setLabel

    // Register label
    React.useEffect(() => {
        if (setLabel) {
            setLabel(value, children)
        }
    }, [value, children, setLabel])

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
                isSelected && "bg-accent",
                disabled && "opacity-50 pointer-events-none",
                className
            )}
            onClick={() => !disabled && context?.onValueChange?.(value)}
            {...props}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            <span className="truncate w-full text-left">{children}</span>
        </div>
    )
})
SelectItem.displayName = "SelectItem"

const SelectGroup = React.Fragment
const SelectLabel = React.Fragment
const SelectSeparator = React.Fragment

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator }
