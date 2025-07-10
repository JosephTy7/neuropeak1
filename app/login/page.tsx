"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Brain, Github, Chrome, Twitter, ComputerIcon as Microsoft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { mockAuth } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { user } = await mockAuth.login(email, password)

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/dashboard/admin")
      } else if (user.role === "teacher") {
        router.push("/dashboard/teacher")
      } else {
        router.push("/dashboard")
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    toast({
      title: "OAuth Login",
      description: `Logging in with ${provider}...`,
    })
    // In a real app, this would redirect to the OAuth provider
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NeuroPeak</span>
          </Link>
          <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-center">Enter your credentials to access your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <div className="text-sm text-right">
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary transition-all duration-300 rounded-lg"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in with Email"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full rounded-lg hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleOAuthLogin("Google")}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-lg hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleOAuthLogin("GitHub")}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-lg hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleOAuthLogin("Microsoft")}
            >
              <Microsoft className="mr-2 h-4 w-4" />
              Microsoft
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-lg hover:bg-primary/5 transition-all duration-300"
              onClick={() => handleOAuthLogin("Twitter")}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}
