"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Video,
  Users,
  Plus,
  Search,
  Clock,
  CalendarDays,
  PenSquare,
  Trash2,
  Eye,
  MoreHorizontal,
  LinkIcon,
  ExternalLink,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { isTeacher } from "@/lib/mock-data"

// Mock classes data
const mockClasses = [
  {
    id: "class1",
    title: "Introduction to Neural Networks",
    course: "Neural Networks",
    date: "2025-05-20T14:00",
    duration: 90,
    platform: "Zoom",
    link: "https://zoom.us/j/123456789",
    status: "upcoming",
    description:
      "An introductory session covering the basics of neural networks, their architecture, and applications.",
    students: 24,
    recordingAvailable: false,
  },
  {
    id: "class2",
    title: "Deep Learning Frameworks",
    course: "Deep Learning",
    date: "2025-05-18T10:00",
    duration: 120,
    platform: "Google Meet",
    link: "https://meet.google.com/abc-defg-hij",
    status: "completed",
    description: "Overview of popular deep learning frameworks including TensorFlow and PyTorch.",
    students: 18,
    recordingAvailable: true,
  },
  {
    id: "class3",
    title: "Ethics in AI Development",
    course: "AI Ethics",
    date: "2025-05-22T15:30",
    duration: 60,
    platform: "Zoom",
    link: "https://zoom.us/j/987654321",
    status: "upcoming",
    description: "Discussion on ethical considerations in AI development and deployment.",
    students: 30,
    recordingAvailable: false,
  },
  {
    id: "class4",
    title: "Machine Learning Algorithms",
    course: "Machine Learning Basics",
    date: "2025-05-15T13:00",
    duration: 90,
    platform: "Zoom",
    link: "https://zoom.us/j/567891234",
    status: "completed",
    description: "Deep dive into popular machine learning algorithms and their use cases.",
    students: 22,
    recordingAvailable: true,
  },
]

export default function ClassesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [classes, setClasses] = useState(mockClasses)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
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
      hour: "numeric",
      minute: "2-digit",
    })
  }

  // Delete class handler
  const handleDeleteClass = (classId: string) => {
    setClasses(classes.filter((cls) => cls.id !== classId))
    toast({
      title: "Class deleted",
      description: "The class has been successfully deleted",
    })
  }

  // Create new class handler
  const handleCreateClass = (classData: any) => {
    const newClass = {
      id: `class-${Date.now()}`,
      title: classData.title,
      course: classData.course,
      date: classData.date,
      duration: Number.parseInt(classData.duration, 10),
      platform: classData.platform,
      link: classData.link,
      status: "upcoming",
      description: classData.description,
      students: 0,
      recordingAvailable: false,
    }

    setClasses([newClass, ...classes])
    toast({
      title: "Class created",
      description: "Your new class has been successfully created",
    })
  }

  // Filter classes based on criteria
  const filteredClasses = classes
    .filter((cls) => {
      if (filter === "upcoming") return cls.status === "upcoming"
      if (filter === "completed") return cls.status === "completed"

      if (courseFilter !== "all") {
        return cls.course === courseFilter
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return cls.title.toLowerCase().includes(query) || cls.course.toLowerCase().includes(query)
      }

      return true
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get unique courses for the filter
  const courses = [...new Set(classes.map((c) => c.course))]

  // Calculate statistics
  const upcomingClasses = classes.filter((c) => c.status === "upcoming").length
  const completedClasses = classes.filter((c) => c.status === "completed").length
  const totalStudentsEnrolled = classes.reduce((sum, cls) => sum + cls.students, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Class Management</h1>
          <p className="text-muted-foreground">Schedule and manage online classes for your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateClassDialog onCreateClass={handleCreateClass} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <CalendarDays className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Classes</p>
              <h3 className="text-2xl font-bold">{upcomingClasses}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Video className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Completed Classes</p>
              <h3 className="text-2xl font-bold">{completedClasses}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Students Enrolled</p>
              <h3 className="text-2xl font-bold">{totalStudentsEnrolled}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Next Class</p>
              <h3 className="text-2xl font-bold">
                {classes.filter((c) => c.status === "upcoming").length > 0
                  ? formatDate(
                      classes
                        .filter((c) => c.status === "upcoming")
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].date,
                    ).split(",")[0]
                  : "None"}
              </h3>
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
              placeholder="Search classes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course} value={course}>
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All Classes
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
              Upcoming
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
                    <TableHead>Course</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No classes found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.title}</TableCell>
                        <TableCell>{cls.course}</TableCell>
                        <TableCell>{formatDate(cls.date)}</TableCell>
                        <TableCell>{cls.platform}</TableCell>
                        <TableCell>{cls.duration} min</TableCell>
                        <TableCell>{cls.students}</TableCell>
                        <TableCell>
                          <Badge variant={cls.status === "upcoming" ? "default" : "outline"}>
                            {cls.status === "upcoming" ? "Upcoming" : "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={cls.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Join</span>
                              </a>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/teacher/classes/${cls.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/teacher/classes/${cls.id}/edit`}>
                                    <PenSquare className="mr-2 h-4 w-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(cls.link)}>
                                  <LinkIcon className="mr-2 h-4 w-4" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteClass(cls.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Online Class Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Schedule classes well in advance to give students time to prepare.</li>
            <li>Ensure your meeting link is valid and accessible to all enrolled students.</li>
            <li>Record sessions when possible for students who cannot attend live.</li>
            <li>Prepare interactive elements to maintain student engagement.</li>
            <li>Allow time for questions and discussions during each class.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function CreateClassDialog({ onCreateClass }: { onCreateClass: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    date: "",
    duration: "60",
    platform: "Zoom",
    link: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateClass(formData)
    setOpen(false)
    // Reset form
    setFormData({
      title: "",
      course: "",
      date: "",
      duration: "60",
      platform: "Zoom",
      link: "",
      description: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Schedule New Class</DialogTitle>
          <DialogDescription>
            Fill in the details below to schedule a new online class for your students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="course" className="text-right">
                Course
              </Label>
              <Select
                name="course"
                value={formData.course}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, course: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Machine Learning Basics">Machine Learning Basics</SelectItem>
                  <SelectItem value="Neural Networks">Neural Networks</SelectItem>
                  <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                  <SelectItem value="AI Ethics">AI Ethics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date & Time
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration (min)
              </Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                className="col-span-3"
                min="15"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="platform" className="text-right">
                Platform
              </Label>
              <Select
                name="platform"
                value={formData.platform}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zoom">Zoom</SelectItem>
                  <SelectItem value="Google Meet">Google Meet</SelectItem>
                  <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Meeting Link
              </Label>
              <Input
                id="link"
                name="link"
                type="url"
                value={formData.link}
                onChange={handleChange}
                className="col-span-3"
                placeholder="https://zoom.us/j/123456789"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
                placeholder="Class description and topics to be covered"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Schedule Class</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
