"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Filter, Eye, PenSquare, Trash2, Clock, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { mockAssignments, isTeacher } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function TeacherAssignmentsPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [assignments, setAssignments] = useState(mockAssignments)
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

  // Delete assignment handler
  const handleDeleteAssignment = (assignmentId: string) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== assignmentId))
    toast({
      title: "Assignment deleted",
      description: "The assignment has been successfully deleted",
    })
  }

  // Create new assignment handler
  const handleCreateAssignment = (assignmentData: any) => {
    const newAssignment = {
      id: `assignment-${Date.now()}`,
      title: assignmentData.title,
      course: assignmentData.course,
      description: assignmentData.description,
      dueDate: assignmentData.dueDate,
      status: "not_started",
      markerNotes: assignmentData.markerNotes || "",
      resources: [],
      submissions: [],
    }

    setAssignments([newAssignment, ...assignments])
    toast({
      title: "Assignment created",
      description: "Your new assignment has been successfully created",
    })
  }

  // Filter assignments based on criteria
  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "upcoming") return assignment.status === "not_started" || assignment.status === "in_progress"
    if (filter === "submitted") return assignment.status === "completed"

    if (courseFilter !== "all") {
      return assignment.course === courseFilter
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return assignment.title.toLowerCase().includes(query) || assignment.course.toLowerCase().includes(query)
    }

    return true
  })

  // Get unique courses for the filter
  const courses = [...new Set(assignments.map((a) => a.course))]

  // Calculate statistics
  const totalAssignments = assignments.length
  const submittedAssignments = assignments.filter((a) => a.status === "completed").length
  const pendingAssignments = assignments.filter((a) => a.status !== "completed").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Assignment Management</h1>
          <p className="text-muted-foreground">Create and manage assignments for your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateAssignmentDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
              <h3 className="text-2xl font-bold">{totalAssignments}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <h3 className="text-2xl font-bold">{submittedAssignments}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Assignments</p>
              <h3 className="text-2xl font-bold">{pendingAssignments}</h3>
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
              placeholder="Search assignments..."
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
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" onValueChange={setFilter}>
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">
              All Assignments
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
              Active
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex-1 sm:flex-none">
              Submitted
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No assignments found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.title}</TableCell>
                        <TableCell>{assignment.course}</TableCell>
                        <TableCell>{formatDate(assignment.dueDate)}</TableCell>
                        <TableCell>{assignment.submissions?.length || 0} submitted</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              assignment.status === "completed"
                                ? "outline"
                                : assignment.status === "in_progress"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {assignment.status === "completed"
                              ? "Submitted"
                              : assignment.status === "in_progress"
                                ? "In Progress"
                                : "Active"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/teacher/assignments/${assignment.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/dashboard/teacher/assignments/${assignment.id}/edit`}>
                                <PenSquare className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAssignment(assignment.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
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

          <TabsContent value="submitted" className="space-y-4">
            {/* Content will be filtered by the filter state */}
          </TabsContent>
        </Tabs>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide clear instructions and expectations for each assignment.</li>
            <li>Set realistic deadlines with sufficient time for completion.</li>
            <li>Include relevant resources to help students complete the assignment.</li>
            <li>Specify grading criteria to ensure transparency.</li>
            <li>Consider allowing assignment drafts for feedback before final submission.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function CreateAssignmentDialog() {
  return (
    <Button asChild>
      <Link href="/dashboard/teacher/assignments/create">
        <Plus className="mr-2 h-4 w-4" />
        Create Assignment
      </Link>
    </Button>
  )
}
