"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { mockUsers } from "@/lib/mock-data"

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Get the current user's email from localStorage or session
    const currentUserEmail = localStorage.getItem("userEmail")

    // Find the user in mockUsers
    const currentUser = Object.values(mockUsers).find((user) => user.email === currentUserEmail)

    // Redirect based on user role
    if (currentUser) {
      switch (currentUser.role) {
        case "admin":
          router.push("/dashboard/admin")
          break
        case "teacher":
          router.push("/dashboard/teacher")
          break
        case "student":
          router.push("/dashboard/student")
          break
        default:
          router.push("/login")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return null // This page will redirect immediately
}
