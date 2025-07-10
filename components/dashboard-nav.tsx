"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Brain,
  LayoutDashboard,
  Settings,
  LogOut,
  Trophy,
  Video,
  MessageSquare,
  FileQuestion,
  ClipboardList,
  CalendarDays,
  Users,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { mockAuth } from "@/lib/mock-data"

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState<string>("student")

  // Get user role on component mount
  useEffect(() => {
    setMounted(true)

    const fetchUser = async () => {
      try {
        const { user } = await mockAuth.getUser()
        setUserRole(user.role)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  const isAdmin = userRole === "admin"
  const isTeacher = userRole === "teacher"
  const isStudent = userRole === "student"

  const handleLogout = async () => {
    try {
      await mockAuth.logout()
      router.push("/login")
      toast({
        title: "Logged out",
        description: "You have successfully logged out.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    }
  }

  const studentRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/courses",
      label: "Courses",
      icon: BookOpen,
    },
    {
      href: "/dashboard/learning-path",
      label: "Learning Path",
      icon: Brain,
    },
    {
      href: "/dashboard/quizzes",
      label: "Quizzes",
      icon: FileQuestion,
    },
    {
      href: "/dashboard/assignments",
      label: "Assignments",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/community",
      label: "Community",
      icon: MessageSquare,
    },
    {
      href: "/dashboard/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const teacherRoutes = [
    {
      href: "/dashboard/teacher",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/courses",
      label: "Courses",
      icon: BookOpen,
    },
    {
      href: "/dashboard/teacher/quizzes",
      label: "Quizzes",
      icon: FileQuestion,
    },
    {
      href: "/dashboard/teacher/assignments",
      label: "Assignments",
      icon: ClipboardList,
    },
    {
      href: "/dashboard/lectures",
      label: "Lectures",
      icon: Video,
    },
    {
      href: "/dashboard/teacher/classes",
      label: "Classes",
      icon: CalendarDays,
    },
    {
      href: "/dashboard/community",
      label: "Community",
      icon: MessageSquare,
    },
    {
      href: "/dashboard/leaderboard",
      label: "Student Performance",
      icon: Trophy,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const adminRoutes = [
    {
      href: "/dashboard/admin",
      label: "Admin Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/dashboard/admin/users",
      label: "User Management",
      icon: Users,
    },
    {
      href: "/dashboard/admin/settings",
      label: "System Settings",
      icon: Settings,
    },
    {
      href: "/dashboard/settings",
      label: "Account Settings",
      icon: User,
    },
  ]

  // Update routes selection logic
  const routes = isAdmin ? adminRoutes : isTeacher ? teacherRoutes : studentRoutes

  if (!mounted) {
    return <div className="grid items-start gap-2">Loading...</div>
  }

  return (
    <nav className="grid items-start gap-2">
      {routes.map((route) => {
        const Icon = route.icon
        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === route.href ? "bg-accent" : "transparent",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{route.label}</span>
          </Link>
        )
      })}
      <Button variant="ghost" className="justify-start mt-auto" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </Button>
    </nav>
  )
}

export { DashboardNav }
