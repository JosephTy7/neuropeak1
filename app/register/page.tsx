"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Brain, Github, Chrome, Twitter, Microscope as Microsoft, CheckCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { mockAuth } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await mockAuth.register(email, password, fullName)
      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      })
      router.push("/login")
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

  const handleOAuthRegister = (provider: string) => {
    toast({
      title: "OAuth Registration",
      description: `Registering with ${provider}...`,
    })
    // In a real app, this would redirect to the OAuth provider
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        <div className="hidden md:flex flex-col justify-center p-8">
          <h2 className="text-3xl font-bold mb-6">Join the Future of Learning</h2>
          <div className="space-y-6">
            {[
              "AI-powered personalized learning paths",
              "Expert-led courses in cutting-edge topics",
              "Global community of learners",
              "Interactive learning experiences",
              "Track your progress in real-time",
            ].map((feature, i) => (
              <div key={i} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">NeuroPeak</span>
            </Link>
            <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
            <p className="text-muted-foreground text-center">Start your learning journey today</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account with Email"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or register with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={() => handleOAuthRegister("Google")}>
                <Chrome className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleOAuthRegister("GitHub")}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleOAuthRegister("Microsoft")}>
                <Microsoft className="mr-2 h-4 w-4" />
                Microsoft
              </Button>
              <Button variant="outline" className="w-full" onClick={() => handleOAuthRegister("Twitter")}>
                <Twitter className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
