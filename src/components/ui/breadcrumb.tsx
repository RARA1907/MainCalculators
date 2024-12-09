import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  segments: {
    title: string
    href: string
  }[]
}

export function Breadcrumb({ segments, className, ...props }: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "mb-4 flex items-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="text-foreground hover:text-muted-foreground transition-colors"
      >
        Home
      </Link>
      {segments.map((segment, index) => (
        <React.Fragment key={segment.href}>
          <ChevronRight className="mx-2 h-4 w-4" />
          <Link
            href={segment.href}
            className={cn(
              "hover:text-muted-foreground transition-colors",
              index === segments.length - 1 && "text-foreground font-medium"
            )}
            aria-current={index === segments.length - 1 ? "page" : undefined}
          >
            {segment.title}
          </Link>
        </React.Fragment>
      ))}
    </nav>
  )
}
