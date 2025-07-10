"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Search, Eye, PenSquare, Trash2, Users, Calendar, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { isTeacher } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

// Mock courses data
const mockCourses = [
  {
    id: "course1",
    title: "Introduction to Neuroscience",
    category: "neuroscience",
    level: "beginner",
    startDate: "2025-06-01",
    endDate: "2025-08-30",
    enrolledStudents: 32,
    status: "active",
    description: "An introductory course covering the basics of neuroscience and brain function.",
  },
  {
    id: "course2",
    title: "Cognitive Psychology",
    category: "cognitive-science",
    level: "intermediate",
    startDate: "2025-05-15",
    endDate: "2025-07-30",
    enrolledStudents: 24,
    status: "active",
    description: "Explore the mental processes that underlie human behavior and cognition.",
  },
  {
    id: "course3",
    title: "Neural Networks and Deep Learning",
    category: "neurobiology",
    level: "advanced",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    enrolledStudents: 18,
    status: "draft",
    description: "Advanced course on neural networks, their structure, and applications in deep learning.",
  },
  {
    id: "course4",
    title: "Brain Development",
    category: "brain-development",
    level: "intermediate",
    startDate: "2025-09-01",
    endDate: "2025-11-30",
    enrolledStudents: 0,
    status: "upcoming",
    description: "Study the development of the brain from infancy through adulthood.",
  },
  {
    id: "course5",
    title: "Neuropsychology",
    category: "neuropsychology",
    level: "advanced",
    startDate: "2025-04-01",
    endDate: "2025-06-30",
    enrolledStudents: 15,
    status: "completed",
    description: "Examine the relationship between brain function and behavior, focusing on neurological disorders.",
  },
]

export default function TeacherCoursesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [courses, setCourses] = useState(mockCourses)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const { toast } = useToast()

  // Check if user is a teacher
  useEffect(() => {
    setMounted(true)

    // Redirect if not a teacher
    if (mounted && !isTeacher()) {
      router.push("/dashboard")
    }
  }, [router, mounted])

  if (!mounted) {
    return <div>Loading...</div>
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Delete course handler
  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((course) => course.id !== courseId))
    toast({
      title: "Course deleted",
      description: "The course has been successfully deleted",
    })
  }

  // Filter courses based on criteria
  const filteredCourses = courses.filter((course) => {
    if (filter === "active") return course.status === "active"
    if (filter === "draft") return course.status === "draft"
    if (filter === "upcoming") return course.status === "upcoming"
    if (filter === "completed") return course.status === "completed"

    if (categoryFilter !== "all") {
      return course.category === categoryFilter
    }

    if (levelFilter !== "all") {
      return course.level === levelFilter
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return course.title.toLowerCase().includes(query) || course.description.toLowerCase().includes(query)
    }

    return true
  })

  // Get unique categories and levels for filters
  const categories = [...new Set(courses.map((c) => c.category))]
  const levels = [...new Set(courses.map((c) => c.level))]

  // Calculate statistics
  const activeCourses = courses.filter((c) => c.status === "active").length
  const draftCourses = courses.filter((c) => c.status === "draft").length
  const upcomingCourses = courses.filter((c) => c.status === "upcoming").length
  const totalStudentsEnrolled = courses.reduce((sum, course) => sum + course.enrolledStudents, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Course Management</h1>
          <p className="text-muted-foreground">Create and manage your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/teacher/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Courses</p>
              <h3 className="text-2xl font-bold">{activeCourses}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Courses</p>
              <h3 className="text-2xl font-bold">{upcomingCourses}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <PenSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Draft Courses</p>
              <h3 className="text-2xl font-bold">{draftCourses}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <h3 className="text-2xl font-bold">{totalStudentsEnrolled}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All Courses
            </TabsTrigger>
            <TabsTrigger value="active" className="flex-1 sm:flex-none">
              Active
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex-1 sm:flex-none">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 sm:flex-none">
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No courses found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>
                          {course.category.charAt(0).toUpperCase() + course.category.slice(1).replace("-", " ")}
                        </TableCell>
                        <TableCell>{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</TableCell>
                        <TableCell>{formatDate(course.startDate)}</TableCell>
                        <TableCell>{formatDate(course.endDate)}</TableCell>
                        <TableCell>{course.enrolledStudents}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              course.status === "active"
                                ? "default"
                                : course.status === "draft"
                                  ? "outline"
                                  : course.status === "upcoming"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/teacher/courses/${course.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/teacher/courses/${course.id}/edit`}>
                                  <PenSquare className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Management Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Create comprehensive course outlines with clear learning objectives.</li>
            <li>Set realistic start and end dates to allow sufficient time for content delivery.</li>
            <li>Provide detailed descriptions to help students understand course content.</li>
            <li>Regularly update course materials to ensure relevance and accuracy.</li>
            <li>Consider the appropriate difficulty level based on prerequisite knowledge.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
