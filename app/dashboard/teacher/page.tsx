"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Users,
  FileQuestion,
  ClipboardList,
  Video,
  BarChart,
  Calendar,
  Clock,
  GraduationCap,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { isTeacher } from "@/lib/mock-data"

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your educator dashboard. Manage your courses, assignments, and student progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next: May 20, 2:00 PM</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">5 assignments, 13 quizzes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>Create and manage your courses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-primary" />
                    <span>Active Courses</span>
                  </div>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-primary" />
                    <span>Total Enrollments</span>
                  </div>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-primary" />
                    <span>Completion Rate</span>
                  </div>
                  <span className="font-medium">78%</span>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/dashboard/courses">
                    Manage Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assessment Tools</CardTitle>
                <CardDescription>Create quizzes and assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileQuestion className="mr-2 h-5 w-5 text-primary" />
                    <span>Active Quizzes</span>
                  </div>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                    <span>Active Assignments</span>
                  </div>
                  <span className="font-medium">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart className="mr-2 h-5 w-5 text-primary" />
                    <span>Average Score</span>
                  </div>
                  <span className="font-medium">82%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/teacher/quizzes">Quizzes</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/teacher/assignments">Assignments</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Classes</CardTitle>
                <CardDescription>Schedule and manage virtual classes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary" />
                    <span>Upcoming Classes</span>
                  </div>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    <span>Next Class</span>
                  </div>
                  <span className="font-medium">May 20</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Video className="mr-2 h-5 w-5 text-primary" />
                    <span>Recorded Sessions</span>
                  </div>
                  <span className="font-medium">12</span>
                </div>
                <Button asChild className="w-full mt-2">
                  <Link href="/dashboard/teacher/classes">
                    Manage Classes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Performance</CardTitle>
              <CardDescription>Track student progress and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Average Score</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Participation Rate</p>
                      <p className="text-2xl font-bold">92%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <BarChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Completion Rate</p>
                      <p className="text-2xl font-bold">78%</p>
                    </div>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/dashboard/leaderboard">
                    View Detailed Analytics
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: "New Assignment Submissions",
                    description: "5 students submitted the Neural Network Implementation assignment",
                    time: "2 hours ago",
                    icon: ClipboardList,
                  },
                  {
                    title: "Quiz Completed",
                    description: "12 students completed the AI Ethics Mid-term quiz",
                    time: "Yesterday",
                    icon: FileQuestion,
                  },
                  {
                    title: "New Course Enrollments",
                    description: "3 new students enrolled in Deep Learning Fundamentals",
                    time: "2 days ago",
                    icon: Users,
                  },
                  {
                    title: "Class Recording Available",
                    description: "Recording for 'Machine Learning Algorithms' is now available",
                    time: "3 days ago",
                    icon: Video,
                  },
                  {
                    title: "Course Update",
                    description: "You updated the content for Introduction to Machine Learning",
                    time: "5 days ago",
                    icon: BookOpen,
                  },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
