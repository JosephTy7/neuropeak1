"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Video, FileText, Plus, Search, Eye, PenSquare, Trash2, Play, Calendar, MoreHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { isTeacher } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

// Mock lectures data
const mockLectures = [
  {
    id: "lecture1",
    title: "Introduction to Neural Networks",
    courseId: "course1",
    courseName: "Introduction to Neuroscience",
    date: "2025-05-20",
    duration: 60,
    type: "video",
    status: "published",
    views: 45,
    isLive: false,
    hasRecording: true,
    materials: 3,
  },
  {
    id: "lecture2",
    title: "Brain Structure and Function",
    courseId: "course1",
    courseName: "Introduction to Neuroscience",
    date: "2025-05-22",
    duration: 75,
    type: "video",
    status: "published",
    views: 38,
    isLive: false,
    hasRecording: true,
    materials: 5,
  },
  {
    id: "lecture3",
    title: "Cognitive Processing Models",
    courseId: "course2",
    courseName: "Cognitive Psychology",
    date: "2025-05-25",
    duration: 90,
    type: "document",
    status: "draft",
    views: 0,
    isLive: false,
    hasRecording: false,
    materials: 2,
  },
  {
    id: "lecture4",
    title: "Live Q&A Session: Neural Networks",
    courseId: "course3",
    courseName: "Neural Networks and Deep Learning",
    date: "2025-06-01",
    duration: 120,
    type: "video",
    status: "scheduled",
    views: 0,
    isLive: true,
    hasRecording: false,
    materials: 1,
  },
  {
    id: "lecture5",
    title: "Developmental Stages of the Brain",
    courseId: "course4",
    courseName: "Brain Development",
    date: "2025-06-05",
    duration: 60,
    type: "document",
    status: "draft",
    views: 0,
    isLive: false,
    hasRecording: false,
    materials: 4,
  },
]

export default function TeacherLecturesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [lectures, setLectures] = useState(mockLectures)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [courseFilter, setCourseFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
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

  // Delete lecture handler
  const handleDeleteLecture = (lectureId: string) => {
    setLectures(lectures.filter((lecture) => lecture.id !== lectureId))
    toast({
      title: "Lecture deleted",
      description: "The lecture has been successfully deleted",
    })
  }

  // Filter lectures based on criteria
  const filteredLectures = lectures.filter((lecture) => {
    if (filter === "published") return lecture.status === "published"
    if (filter === "draft") return lecture.status === "draft"
    if (filter === "scheduled") return lecture.status === "scheduled"
    if (filter === "live") return lecture.isLive

    if (courseFilter !== "all") {
      return lecture.courseId === courseFilter
    }

    if (typeFilter !== "all") {
      return lecture.type === typeFilter
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return lecture.title.toLowerCase().includes(query) || lecture.courseName.toLowerCase().includes(query)
    }

    return true
  })

  // Get unique courses for the filter
  const courses = [...new Set(lectures.map((l) => ({ id: l.courseId, name: l.courseName })))]

  // Calculate statistics
  const publishedLectures = lectures.filter((l) => l.status === "published").length
  const draftLectures = lectures.filter((l) => l.status === "draft").length
  const scheduledLectures = lectures.filter((l) => l.status === "scheduled").length
  const totalViews = lectures.reduce((sum, lecture) => sum + lecture.views, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lecture Management</h1>
          <p className="text-muted-foreground">Create and manage lectures for your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/teacher/lectures/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Lecture
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Video className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Published Lectures</p>
              <h3 className="text-2xl font-bold">{publishedLectures}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <PenSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Draft Lectures</p>
              <h3 className="text-2xl font-bold">{draftLectures}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Scheduled Live</p>
              <h3 className="text-2xl font-bold">{scheduledLectures}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Eye className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <h3 className="text-2xl font-bold">{totalViews}</h3>
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
              placeholder="Search lectures..."
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
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All Lectures
            </TabsTrigger>
            <TabsTrigger value="published" className="flex-1 sm:flex-none">
              Published
            </TabsTrigger>
            <TabsTrigger value="draft" className="flex-1 sm:flex-none">
              Drafts
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex-1 sm:flex-none">
              Scheduled
            </TabsTrigger>
            <TabsTrigger value="live" className="flex-1 sm:flex-none">
              Live
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLectures.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No lectures found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLectures.map((lecture) => (
                      <TableRow key={lecture.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {lecture.isLive && <Badge className="mr-2">LIVE</Badge>}
                            {lecture.title}
                          </div>
                        </TableCell>
                        <TableCell>{lecture.courseName}</TableCell>
                        <TableCell>{formatDate(lecture.date)}</TableCell>
                        <TableCell>{lecture.duration} min</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {lecture.type === "video" ? (
                              <Video className="h-4 w-4 mr-1" />
                            ) : (
                              <FileText className="h-4 w-4 mr-1" />
                            )}
                            {lecture.type.charAt(0).toUpperCase() + lecture.type.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>{lecture.materials}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              lecture.status === "published"
                                ? "default"
                                : lecture.status === "draft"
                                  ? "outline"
                                  : "secondary"
                            }
                          >
                            {lecture.status.charAt(0).toUpperCase() + lecture.status.slice(1)}
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
                                <Link href={`/dashboard/teacher/lectures/${lecture.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/dashboard/teacher/lectures/${lecture.id}/edit`}>
                                  <PenSquare className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {lecture.isLive && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/dashboard/teacher/lectures/${lecture.id}/live`}>
                                    <Play className="mr-2 h-4 w-4" />
                                    Start Live Session
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteLecture(lecture.id)}
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

          <TabsContent value="published" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lecture Creation Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Create clear, concise lectures with well-defined learning objectives.</li>
            <li>Include supplementary materials to enhance student understanding.</li>
            <li>For video lectures, ensure good audio quality and appropriate pacing.</li>
            <li>Schedule live sessions in advance to maximize student attendance.</li>
            <li>Consider recording live sessions for students who cannot attend in real-time.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
