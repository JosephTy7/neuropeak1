import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { Brain } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow border-r bg-card px-4">
          <div className="h-16 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">NeuroPeak</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col">
            <DashboardNav />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:pl-64">
        <div className="h-16 border-b flex items-center justify-end px-8">
          <ThemeToggle />
        </div>
        <main className="p-8">{children}</main>
      </div>
    </div>
  )
}
