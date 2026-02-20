"use client"

import * as React from "react"
import { Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const RadioGroupContext = React.createContext<{
    value?: string
    onValueChange?: (value: string) => void
} | null>(null)

const RadioGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        value?: string
        defaultValue?: string
        onValueChange?: (value: string) => void
    }
>(({ className, children, value: controlledValue, defaultValue, onValueChange, ...props }, ref) => {
    const [value, setValue] = React.useState(controlledValue || defaultValue || "")

    React.useEffect(() => {
        if (controlledValue !== undefined) {
            setValue(controlledValue)
        }
    }, [controlledValue])

    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setValue(newValue)
        }
        onValueChange?.(newValue)
    }

    return (
        <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange }}>
            <div className={cn("grid gap-2", className)} ref={ref} {...props}>
                {children}
            </div>
        </RadioGroupContext.Provider>
    )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext)
    const isChecked = context?.value === value

    return (
        <button
            ref={ref}
            role="radio"
            aria-checked={isChecked}
            data-state={isChecked ? "checked" : "unchecked"}
            value={value}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            onClick={() => context?.onValueChange?.(value)}
            type="button" // Prevent form submission
            {...props}
        >
            {isChecked && (
                <Circle className="h-2.5 w-2.5 fill-current text-current" />
            )}
        </button>
    )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
