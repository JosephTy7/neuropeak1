import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Search, Clock, Users, Star, ArrowRight, BookOpen, Bookmark, Filter } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"

// Course categories with their respective colors
const categories = [
  { name: "Computer Science", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  { name: "Data Science", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  { name: "Mathematics", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  { name: "Language", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  { name: "Business", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  { name: "Arts", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300" },
  { name: "Science", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300" },
  { name: "Health", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
]

// Mock course data
const courses = [
  {
    id: 1,
    title: "Introduction to Python Programming",
    description: "Learn the fundamentals of Python programming language with hands-on projects.",
    category: "Computer Science",
    level: "Beginner",
    duration: "8 weeks",
    students: 12453,
    rating: 4.8,
    instructor: "Dr. Sarah Johnson",
    image: "/python-programming-course.png",
  },
  {
    id: 2,
    title: "Advanced Data Analysis",
    description: "Master statistical methods and data visualization techniques for complex datasets.",
    category: "Data Science",
    level: "Advanced",
    duration: "10 weeks",
    students: 8721,
    rating: 4.7,
    instructor: "Prof. Michael Chen",
    image: "/data-analysis-visualization.png",
  },
  {
    id: 3,
    title: "Calculus for Engineers",
    description: "Comprehensive calculus course designed specifically for engineering applications.",
    category: "Mathematics",
    level: "Intermediate",
    duration: "12 weeks",
    students: 6542,
    rating: 4.6,
    instructor: "Dr. Robert Taylor",
    image: "/calculus-mathematics-engineering.png",
  },
  {
    id: 4,
    title: "Spanish for Beginners",
    description: "Start your journey to Spanish fluency with this interactive language course.",
    category: "Language",
    level: "Beginner",
    duration: "16 weeks",
    students: 15678,
    rating: 4.9,
    instructor: "Maria Rodriguez",
    image: "/placeholder.svg?height=200&width=350&query=spanish language learning",
  },
  {
    id: 5,
    title: "Digital Marketing Fundamentals",
    description: "Learn essential digital marketing strategies to grow your business online.",
    category: "Business",
    level: "Beginner",
    duration: "6 weeks",
    students: 9876,
    rating: 4.5,
    instructor: "Alex Thompson",
    image: "/placeholder.svg?height=200&width=350&query=digital marketing business",
  },
  {
    id: 6,
    title: "Introduction to Oil Painting",
    description: "Discover the techniques and principles of oil painting in this hands-on course.",
    category: "Arts",
    level: "Beginner",
    duration: "8 weeks",
    students: 4532,
    rating: 4.8,
    instructor: "Emma Wilson",
    image: "/placeholder.svg?height=200&width=350&query=oil painting art canvas",
  },
  {
    id: 7,
    title: "Quantum Physics Explained",
    description: "Demystify the complex world of quantum mechanics with clear explanations.",
    category: "Science",
    level: "Advanced",
    duration: "14 weeks",
    students: 3245,
    rating: 4.7,
    instructor: "Dr. James Maxwell",
    image: "/placeholder.svg?height=200&width=350&query=quantum physics science",
  },
  {
    id: 8,
    title: "Nutrition and Wellness",
    description: "Learn the science of nutrition and how to create a balanced, healthy lifestyle.",
    category: "Health",
    level: "Intermediate",
    duration: "8 weeks",
    students: 7865,
    rating: 4.6,
    instructor: "Dr. Lisa Chen",
    image: "/placeholder.svg?height=200&width=350&query=nutrition health wellness",
  },
  {
    id: 9,
    title: "Machine Learning Fundamentals",
    description: "Build a strong foundation in machine learning algorithms and applications.",
    category: "Computer Science",
    level: "Intermediate",
    duration: "12 weeks",
    students: 10234,
    rating: 4.9,
    instructor: "Prof. David Lee",
    image: "/placeholder.svg?height=200&width=350&query=machine learning AI",
  },
]

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NeuroPeak</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" asChild className="hover:bg-primary/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Explore Our Courses</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover a wide range of courses designed to help you achieve your learning goals with our AI-powered
            platform.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search for courses..." className="pl-10 w-full" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Badge key={category.name} className={`${category.color} cursor-pointer`}>
                {category.name}
              </Badge>
            ))}
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const categoryObj = categories.find((c) => c.name === course.category)
                const categoryColor = categoryObj ? categoryObj.color : "bg-gray-100 text-gray-800"

                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge className={categoryColor}>{course.category}</Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mt-2">{course.title}</CardTitle>
                      <CardDescription className="text-sm">{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          {course.level}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Bookmark className="h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" className="flex items-center gap-1">
                        Enroll Now
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Other tabs would have similar content but filtered */}
          <TabsContent value="popular">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Popular courses filtered view would appear here</p>
            </div>
          </TabsContent>

          {/* Repeat for other tabs */}
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button variant="outline" className="mr-2">
            Previous
          </Button>
          <Button variant="outline" className="bg-primary/10">
            1
          </Button>
          <Button variant="outline" className="mx-1">
            2
          </Button>
          <Button variant="outline" className="mx-1">
            3
          </Button>
          <Button variant="outline" className="ml-2">
            Next
          </Button>
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
