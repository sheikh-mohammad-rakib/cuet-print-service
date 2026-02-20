import { toast as sonnerToast } from "sonner"

type ToastProps = {
    title?: string
    description?: string
    variant?: "default" | "destructive"
    className?: string
}

export function useToast() {
    function toast({ title, description, variant }: ToastProps) {
        if (variant === "destructive") {
            sonnerToast.error(title, {
                description: description,
            })
        } else {
            sonnerToast.success(title, {
                description: description,
            })
        }
    }

    return {
        toast,
        dismiss: (toastId?: string) => sonnerToast.dismiss(toastId),
    }
}
