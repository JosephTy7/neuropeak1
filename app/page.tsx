import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, BookOpen, Users, Trophy, Sparkles, Target, Zap, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NeuroPeak</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hover:bg-primary/10 transition-colors duration-300">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 rounded-full px-6"
            >
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary animate-pulse">
            <Sparkles className="h-4 w-4 mr-2" />
            <span>AI-Powered Learning Revolution</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            Unlock Your Full Potential with AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of learning with NeuroPeak. Our AI adapts to your unique learning style, helping you
            master new skills faster than ever before.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary rounded-full px-8 py-6 shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <Link href="/login" className="flex items-center">
                <span className="mr-2">Start Your Journey</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                  <ChevronRight className="h-4 w-4 text-white" />
                </div>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-2 hover:bg-primary/5 rounded-full px-8 py-6 transition-all duration-300 transform hover:-translate-y-1 hover:border-primary/50 backdrop-blur-sm"
            >
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-primary shadow-md hover:shadow-lg">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-muted-foreground">
              Our AI engine adapts to your learning style and pace, creating a truly personalized experience
            </p>
          </Card>

          <Card className="p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-primary shadow-md hover:shadow-lg">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Target className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Goals</h3>
            <p className="text-muted-foreground">
              Set and achieve your learning goals with AI-driven recommendations and progress tracking
            </p>
          </Card>

          <Card className="p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300 border-t-4 border-primary shadow-md hover:shadow-lg">
            <div className="p-3 bg-primary/10 rounded-full mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Community</h3>
            <p className="text-muted-foreground">Connect with learners worldwide, share insights, and grow together</p>
          </Card>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-4xl font-bold mb-12 relative">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Why Choose NeuroPeak?
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Adaptation",
                description: "Learning path adjusts in real-time to your progress",
                stat: "93%",
                label: "Learning Efficiency",
              },
              {
                icon: BookOpen,
                title: "Rich Content",
                description: "Expert-curated courses with interactive elements",
                stat: "1000+",
                label: "Available Courses",
              },
              {
                icon: Trophy,
                title: "Achievement System",
                description: "Gamified learning experience with rewards",
                stat: "50+",
                label: "Achievements",
              },
              {
                icon: Users,
                title: "Active Community",
                description: "Learn and grow with peers worldwide",
                stat: "100K+",
                label: "Active Learners",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-primary/5 transition-colors duration-300"
              >
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                  {feature.stat}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{feature.label}</p>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24 text-center bg-gradient-to-r from-primary/10 to-purple-600/10 py-16 px-4 rounded-2xl shadow-inner">
          <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-primary/10 text-primary">
            <Trophy className="h-4 w-4 mr-2" />
            <span>Start Learning Today</span>
          </div>
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing the future of education with NeuroPeak.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary rounded-full px-8 py-6 shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <Link href="/login" className="flex items-center">
                <span className="mr-2">Begin Your Journey</span>
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                  <ChevronRight className="h-4 w-4 text-white" />
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-12 mt-24 border-t">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">NeuroPeak</span>
            </div>
            <p className="text-sm text-muted-foreground">Empowering learners worldwide with AI-powered education.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/courses" className="hover:text-primary transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard/learning-path" className="hover:text-primary transition-colors">
                  Learning Paths
                </Link>
              </li>
              <li>
                <Link href="/dashboard/community" className="hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">
                  Career
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © 2024-2025 NeuroPeak. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
