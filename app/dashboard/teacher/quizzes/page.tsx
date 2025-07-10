"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, CheckCircle, BookOpen, Plus, Eye, PenSquare, Trash2, Filter, SortAsc } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { mockQuizzes, isTeacher } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function TeacherQuizzesPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [quizzes, setQuizzes] = useState(mockQuizzes)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "title" | "course">("date")
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

  // Delete quiz handler
  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId))
    toast({
      title: "Quiz deleted",
      description: "The quiz has been successfully deleted",
    })
  }

  // Create new quiz handler
  const handleCreateQuiz = (quizData: any) => {
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      title: quizData.title,
      course: quizData.course,
      description: quizData.description,
      timeLimit: Number.parseInt(quizData.timeLimit, 10),
      dueDate: quizData.dueDate,
      status: "not_started",
      questions: [],
      markerNotes: quizData.markerNotes || "",
      passingScore: Number.parseInt(quizData.passingScore, 10),
      showAnswersAfterSubmission: quizData.showAnswers,
      allowRetakes: quizData.allowRetakes,
    }

    setQuizzes([newQuiz, ...quizzes])
    toast({
      title: "Quiz created",
      description: "Your new quiz has been successfully created",
    })
  }

  // Filter quizzes based on criteria
  const filteredQuizzes = quizzes
    .filter((quiz) => {
      if (filter === "draft") return quiz.status === "draft"
      if (filter === "published") return quiz.status === "published" || quiz.status === "not_started"

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return quiz.title.toLowerCase().includes(query) || quiz.course.toLowerCase().includes(query)
      }

      return true
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "course") {
        return a.course.localeCompare(b.course)
      }
      return 0
    })

  // Calculate statistics
  const totalQuizzes = quizzes.length
  const activeQuizzes = quizzes.filter((q) => q.status === "not_started" || q.status === "published").length
  const draftQuizzes = quizzes.filter((q) => q.status === "draft").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quiz Management</h1>
          <p className="text-muted-foreground">Create and manage quizzes for your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <CreateQuizDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
              <h3 className="text-2xl font-bold">{totalQuizzes}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Quizzes</p>
              <h3 className="text-2xl font-bold">{activeQuizzes}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <PenSquare className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Drafts</p>
              <h3 className="text-2xl font-bold">{draftQuizzes}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Recent Activity</p>
              <h3 className="text-2xl font-bold">Today</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search quizzes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Sort by Date</SelectItem>
                  <SelectItem value="title">Sort by Title</SelectItem>
                  <SelectItem value="course">Sort by Course</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All Quizzes
              </TabsTrigger>
              <TabsTrigger value="published" className="flex-1 sm:flex-none">
                Published
              </TabsTrigger>
              <TabsTrigger value="draft" className="flex-1 sm:flex-none">
                Drafts
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredQuizzes.length === 0 ? (
                <Card className="overflow-hidden">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No quizzes found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">{quiz.title}</TableCell>
                          <TableCell>{quiz.course}</TableCell>
                          <TableCell>{formatDate(quiz.dueDate)}</TableCell>
                          <TableCell>
                            <Badge variant={quiz.status === "draft" ? "outline" : "default"}>
                              {quiz.status === "draft" ? "Draft" : "Published"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/teacher/quizzes/${quiz.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/teacher/quizzes/${quiz.id}/edit`}>
                                  <PenSquare className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteQuiz(quiz.id)}>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="published" className="space-y-4">
              {/* Content will be filtered by the filter state */}
            </TabsContent>

            <TabsContent value="draft" className="space-y-4">
              {/* Content will be filtered by the filter state */}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-[300px] space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Quiz Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Create clear questions with unambiguous answers</li>
                <li>Use varied question types to test different skills</li>
                <li>Provide sufficient time based on question complexity</li>
                <li>Include detailed marker notes for consistency</li>
                <li>Consider setting a passing threshold</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Use Multiple Formats</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Mix multiple choice, short answer, and essay questions to assess different skills.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Set Clear Instructions</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Provide detailed instructions so students know exactly what to expect.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Preview Before Publishing</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Always preview quizzes from a student perspective before publishing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CreateQuizDialog() {
  return (
    <Button asChild>
      <Link href="/dashboard/teacher/quizzes/create">
        <Plus className="mr-2 h-4 w-4" />
        Create Quiz
      </Link>
    </Button>
  )
}
