import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"

const adidasButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-medium uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background hover:bg-foreground/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-none px-3",
        lg: "h-11 rounded-none px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface AdidasButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof adidasButtonVariants> {
  asChild?: boolean
  href?: string
}

const AdidasButton = React.forwardRef<HTMLButtonElement, AdidasButtonProps>(
  ({ className, variant, size, asChild = false, href, ...props }, ref) => {
    const Comp = asChild ? Slot : href ? "a" : "button"

    if (href) {
      return (
        <Link href={href} className={cn(adidasButtonVariants({ variant, size, className }))}>
          {props.children}
        </Link>
      )
    }

    return <Comp className={cn(adidasButtonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
AdidasButton.displayName = "AdidasButton"

export { AdidasButton, adidasButtonVariants }
