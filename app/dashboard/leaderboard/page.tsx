"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Star, TrendingUp, ChevronUp, ChevronDown, Brain, Users, BookOpen, Award } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function LeaderboardPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState("weekly")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [userRole, setUserRole] = useState<string>("student")
  const [students] = useState([
    {
      id: "1",
      name: "Taizya Simunza",
      points: 2500,
      rank: 1,
      coursesCompleted: 8,
      streak: 15,
      change: "up",
      quizAverage: 95,
      participationRate: 98,
      helpfulnessScore: 92,
    },
    {
      id: "2",
      name: "Joseph Mwamba",
      points: 2350,
      rank: 2,
      coursesCompleted: 7,
      streak: 12,
      change: "down",
      quizAverage: 92,
      participationRate: 95,
      helpfulnessScore: 88,
    },
    {
      id: "3",
      name: "Emmanuel Zulu",
      points: 2200,
      rank: 3,
      coursesCompleted: 6,
      streak: 10,
      change: "up",
      quizAverage: 88,
      participationRate: 90,
      helpfulnessScore: 85,
    },
  ])

  // Check user role on component mount
  useEffect(() => {
    setMounted(true)

    // Get user role from localStorage
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("userRole")
      if (storedRole) {
        setUserRole(storedRole)
      }
    }
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  const isAdmin = userRole === "admin"
  const isTeacherRole = userRole === "teacher" || isAdmin

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  if (isTeacherRole) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Student Performance Tracking</h1>
          <p className="text-muted-foreground">Monitor student progress and achievements</p>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="ml">Machine Learning</SelectItem>
              <SelectItem value="dl">Deep Learning</SelectItem>
              <SelectItem value="ai">AI Ethics</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Star className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <h3 className="text-2xl font-bold">85%</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <h3 className="text-2xl font-bold">156</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Course Completion</p>
                <h3 className="text-2xl font-bold">78%</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Learning Progress</p>
                <h3 className="text-2xl font-bold">92%</h3>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course Progress</TableHead>
                  <TableHead>Quiz Average</TableHead>
                  <TableHead>Participation</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2"
                          style={{ width: `${student.participationRate}%` }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{student.quizAverage}%</TableCell>
                    <TableCell>{student.participationRate}%</TableCell>
                    <TableCell>2 hours ago</TableCell>
                    <TableCell>
                      {student.change === "up" ? (
                        <div className="flex items-center text-green-500">
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Improving
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-500">
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Needs Attention
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
            <div className="space-y-4">
              {[
                {
                  title: "High Performers",
                  description: "25% of students scoring above 90%",
                  icon: Award,
                  color: "text-green-500",
                },
                {
                  title: "Average Performance",
                  description: "60% of students between 70-90%",
                  icon: TrendingUp,
                  color: "text-blue-500",
                },
                {
                  title: "Needs Improvement",
                  description: "15% of students below 70%",
                  icon: Brain,
                  color: "text-yellow-500",
                },
              ].map((insight, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${insight.color} bg-opacity-10`}>
                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  <div>
                    <p className="font-medium">{insight.title}</p>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Schedule Review Sessions",
                  description: "For students scoring below 70%",
                  icon: Users,
                },
                {
                  title: "Update Course Material",
                  description: "Based on common misconceptions",
                  icon: BookOpen,
                },
                {
                  title: "Recognize Achievements",
                  description: "Highlight top performers' strategies",
                  icon: Trophy,
                },
              ].map((recommendation, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <recommendation.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{recommendation.title}</p>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">Track your performance and compete with fellow learners</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="allTime">All Time</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            <SelectItem value="ml">Machine Learning</SelectItem>
            <SelectItem value="dl">Deep Learning</SelectItem>
            <SelectItem value="ai">AI Ethics</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Star className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Your Rank</p>
              <h3 className="text-2xl font-bold">#2</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Your Points</p>
              <h3 className="text-2xl font-bold">2350</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Quiz Average</p>
              <h3 className="text-2xl font-bold">85%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Participation</p>
              <h3 className="text-2xl font-bold">92%</h3>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Quiz Avg</TableHead>
                <TableHead>Participation</TableHead>
                <TableHead>Helpfulness</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRankIcon(student.rank)}
                      <span className="font-bold">{student.rank}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">{student.points}</TableCell>
                  <TableCell>{student.quizAverage}%</TableCell>
                  <TableCell>{student.participationRate}%</TableCell>
                  <TableCell>{student.helpfulnessScore}%</TableCell>
                  <TableCell>
                    {student.change === "up" ? (
                      <ChevronUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-red-500" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Scoring System</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Quiz Performance (70%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">Based on your average quiz scores and completion rate</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Consistency (20%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">Calculated from your learning streaks and participation</p>
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Community Contribution (10%)</h3>
              </div>
              <p className="text-sm text-muted-foreground">Based on helping others and community engagement</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
          <div className="space-y-4">
            {[
              {
                icon: Award,
                title: "Top 50 Student",
                description: "Maintained position in top 50 for 2 weeks",
              },
              {
                icon: TrendingUp,
                title: "Rising Star",
                description: "Improved rank by 20 positions this week",
              },
              {
                icon: Users,
                title: "Community Helper",
                description: "Helped 10 students this month",
              },
            ].map((achievement, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <achievement.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
