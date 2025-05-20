
import Link from "next/link"
import { Building2 } from "lucide-react"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }) {
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 mx-6", className)} {...props}>
      <Link href="/" className="flex items-center space-x-2 ">
        <Building2 className="h-6 w-6 text-purple-600" />
        <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">MetaEstate</span>
      </Link>
      <Link href="/marketplace" className="text-sm font-medium transition-colors hover:text-primary">
        Marketplace
      </Link>
      {/* <Link href="/lands" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary " className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
        Lands
      </Link>
      <Link href="/worlds" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Worlds
      </Link>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        My Portfolio
      </Link> */}
    </nav>
  )
}

