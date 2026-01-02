import Link from "next/link"
import { Zap } from "lucide-react"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export function SidebarLogo() {
  const { state, isMobile } = useSidebar()
  const isCollapsed = state === "collapsed" && !isMobile

  return (
    <Link
      href="/"
      className={`flex items-center gap-2 px-4 py-3 border-b transition-all ${isCollapsed ? "flex-col justify-center px-2" : ""}`}
    >
      {/* Logo icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
        <Zap size={16} />
      </div>

      {/* App name */}
      {!isCollapsed && <span className="text-lg font-semibold">TaskFlow</span>}

      <div className={isCollapsed ? "mt-1" : "ms-auto"}>
        <SidebarTrigger size="icon" />
      </div>
    </Link>
  )
}
