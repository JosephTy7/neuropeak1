"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, AlertTriangle, Search, CheckCircle, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { mockQuizzes } from "@/lib/mock-data"

export default function QuizzesPage() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "title" | "course">("date")

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

  // Check if quiz is due soon (within 48 hours)
  const isDueSoon = (dateString: string) => {
    const dueDate = new Date(dateString)
    const now = new Date()
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffHours > 0 && diffHours < 48
  }

  // Filter and sort quizzes based on selected criteria
  const filteredQuizzes = mockQuizzes
    .filter((quiz) => {
      // Filter by status
      if (filter === "upcoming") return quiz.status === "not_started"
      if (filter === "completed") return quiz.status === "completed"

      // Always apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return quiz.title.toLowerCase().includes(query) || quiz.course.toLowerCase().includes(query)
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected criteria
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
  const totalQuizzes = mockQuizzes.length
  const completedQuizzes = mockQuizzes.filter((q) => q.status === "completed").length
  const upcomingQuizzes = mockQuizzes.filter((q) => q.status === "not_started").length
  const averageScore =
    mockQuizzes.filter((q) => q.status === "completed" && q.score).reduce((sum, quiz) => sum + (quiz.score || 0), 0) /
      completedQuizzes || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Quizzes</h1>
          <p className="text-muted-foreground">View and take your assigned quizzes</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Sort by Date</SelectItem>
              <SelectItem value="title">Sort by Title</SelectItem>
              <SelectItem value="course">Sort by Course</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quizzes by title or course..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
            <TabsList className="w-full justify-start mb-4">
              <TabsTrigger value="all" className="flex-1 sm:flex-none">
                All Quizzes
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="flex-1 sm:flex-none">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 sm:flex-none">
                Completed
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
                filteredQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} formatDate={formatDate} isDueSoon={isDueSoon} />
                ))
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              {/* Content will be filtered by the filter state */}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {/* Content will be filtered by the filter state */}
            </TabsContent>
          </Tabs>
        </div>

        <div className="md:w-[300px] space-y-4">
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Quiz Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="text-sm font-medium">
                    {completedQuizzes}/{totalQuizzes}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Score</span>
                  <span className="text-sm font-medium">{averageScore.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Upcoming</span>
                  <span className="text-sm font-medium">{upcomingQuizzes}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Prepare Effectively</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Review your notes and course materials before starting a quiz.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Time Management</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Allocate time based on the number of questions. Don't spend too long on any single question.
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <h4 className="text-sm font-medium">Check Your Work</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  If time permits, review your answers before submitting the quiz.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>Quiz Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Once you start a quiz, the timer will begin and cannot be paused.</li>
                <li>Answer all questions before submitting. You can navigate between questions.</li>
                <li>Ensure you have a stable internet connection before starting.</li>
                <li>Your results will be available immediately after submission.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function QuizCard({
  quiz,
  formatDate,
  isDueSoon,
}: {
  quiz: any
  formatDate: (date: string) => string
  isDueSoon: (date: string) => boolean
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-full mt-1">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.course}</CardDescription>
            </div>
          </div>
          <div>
            {quiz.status === "completed" ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="mr-1 h-3 w-3" /> Score: {quiz.score}%
              </Badge>
            ) : (
              <Badge variant={isDueSoon(quiz.dueDate) ? "destructive" : "outline"}>
                {isDueSoon(quiz.dueDate) ? "Due Soon" : "Upcoming"}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Due: {formatDate(quiz.dueDate)}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Time Limit: {quiz.timeLimit} minutes</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Questions: {quiz.questions?.length || "N/A"}</span>
            </div>
          </div>

          {isDueSoon(quiz.dueDate) && quiz.status !== "completed" && (
            <div className="flex items-center text-amber-600 text-sm mt-2 bg-amber-50 p-2 rounded-md">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span>This quiz is due soon! Make sure to complete it on time.</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        {quiz.status === "completed" ? (
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/quizzes/${quiz.id}`}>Review Results</Link>
          </Button>
        ) : (
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/dashboard/quizzes/${quiz.id}`}>Start Quiz</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
