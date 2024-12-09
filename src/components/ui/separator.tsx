import * as React from "react"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <hr
    ref={ref}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal"
        ? "h-[1px] w-full"
        : "w-[1px] h-full",
      className
    )}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Separator }
