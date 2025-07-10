"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, Clock, TrendingUp, Calendar, Brain, Target, Video, ExternalLink } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { mockEnrolledCourses } from "@/lib/mock-data"
import Link from "next/link"
import { Award, Star, HelpCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { MessageSquare, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function StudentDashboard() {
  const [enrolledCourses] = useState(mockEnrolledCourses)
  const [quizHistory] = useState([
    { id: 1, course: "Machine Learning Basics", score: 85, improvement: "Review neural network architectures" },
    { id: 2, course: "Deep Learning", score: 92, improvement: "Great work! Focus on advanced optimization" },
    { id: 3, course: "AI Ethics", score: 78, improvement: "Study more about bias in AI systems" },
  ])

  const [upcomingAssignments] = useState([
    { id: 1, title: "Neural Networks Quiz", due: "Tomorrow at 3:00 PM", course: "Deep Learning" },
    { id: 2, title: "Ethics Case Study", due: "Friday at 11:59 PM", course: "AI Ethics" },
    { id: 3, title: "Final Project", due: "Next Week", course: "Machine Learning" },
  ])

  const [achievements] = useState([
    { id: 1, name: "Quick Learner", description: "Completed 5 courses", icon: Star },
    { id: 2, name: "Perfect Score", description: "100% on a quiz", icon: Award },
    { id: 3, name: "Helper", description: "Helped 10 peers", icon: HelpCircle },
  ])

  const [topPerformers] = useState([
    {
      name: "Taizya Simunza",
      points: 2500,
      rank: 1,
    },
    {
      name: "Joseph Mwamba",
      points: 2350,
      rank: 2,
    },
    {
      name: "Emmanuel Zulu ",
      points: 2200,
      rank: 3,
      
    },
  ])

  // New state for online classes
  const [onlineClasses] = useState([
    {
      id: 1,
      title: "Neural Networks Architecture",
      course: "Deep Learning",
      instructor: "Dr. Zulu",
      time: "Today, 2:00 PM - 3:30 PM",
      platform: "Zoom",
      link: "https://zoom.us/j/123456789",
      joinable: true,
    },
    {
      id: 2,
      title: "Ethics in AI Development",
      course: "AI Ethics",
      instructor: "Prof. Banda",
      time: "Tomorrow, 10:00 AM - 11:30 AM",
      platform: "Google Meet",
      link: "https://meet.google.com/abc-defg-hij",
      joinable: false,
    },
    {
      id: 3,
      title: "Machine Learning Algorithms",
      course: "Introduction to Machine Learning",
      instructor: "Dr. Phiri",
      time: "May 21, 3:00 PM - 5:00 PM",
      platform: "Zoom",
      link: "https://zoom.us/j/987654321",
      joinable: false,
    },
  ])

  // Restore the AI chat button and functionality
  const [showChat, setShowChat] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I'm your AI learning assistant. How can I help you today?" },
  ])

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return

    // Add user message to chat
    setChatHistory((prev) => [...prev, { role: "user", content: chatMessage }])

    // Simulate AI response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: " " + chatMessage + ". How can i help you...",
        },
      ])
    }, 1000)

    setChatMessage("")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Joseph!</h1>
        <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 overflow-hidden">
          <div className="flex items-center space-x-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Enrolled Courses</p>
              <h3 className="text-2xl font-bold">{enrolledCourses.length}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 overflow-hidden">
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Class Rank</p>
              <h3 className="text-2xl font-bold">#2</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 overflow-hidden">
          <div className="flex items-center space-x-4">
            <Clock className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Study Time</p>
              <h3 className="text-2xl font-bold">12.5h</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 overflow-hidden">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Learning Streak</p>
              <h3 className="text-2xl font-bold">7 days</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* New Online Classes Section */}
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Online Classes</h3>
              <p className="text-sm text-muted-foreground">Join your scheduled virtual classes</p>
            </div>
          </div>
          <div className="space-y-5">
            {onlineClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1 mb-3 md:mb-0">
                  <div className="flex items-center">
                    <h4 className="font-medium">{classItem.title}</h4>
                    {classItem.joinable && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        Live Now
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{classItem.course}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-3.5 w-3.5" />
                    <span>{classItem.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="mr-2 h-3.5 w-3.5" />
                    <span>{classItem.instructor}</span>
                  </div>
                </div>
                <Button variant={classItem.joinable ? "default" : "outline"} className="flex items-center" asChild>
                  <a href={classItem.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Join {classItem.platform}
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Course Progress</h3>
              <p className="text-sm text-muted-foreground">Track your progress in enrolled courses</p>
            </div>
          </div>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{course.title}</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Top Performers</h3>
              <p className="text-sm text-muted-foreground">This week's leading students</p>
            </div>
          </div>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={performer.avatar || "/placeholder.svg"}
                      alt={performer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {performer.rank <= 3 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {performer.rank}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{performer.name}</p>
                    <p className="text-sm text-muted-foreground">{performer.points} points</p>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/leaderboard">View Full Leaderboard</Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Quiz History</h3>
          <div className="space-y-4">
            {quizHistory.map((quiz) => (
              <div key={quiz.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{quiz.course}</p>
                    <p className="text-sm text-muted-foreground">Score: {quiz.score}%</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/quizzes/${quiz.id}`}>Review</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Improvement: {quiz.improvement}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/dashboard/quizzes">View All Quizzes</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden">
          <h3 className="text-lg font-semibold mb-4">Achievements</h3>
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <achievement.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{achievement.name}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upcoming Assignments</h3>
              <p className="text-sm text-muted-foreground">Stay on top of your deadlines</p>
            </div>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                </div>
                <span className="text-sm text-muted-foreground">{assignment.due}</span>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" asChild>
              <Link href="/dashboard/assignments">View All Assignments</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Learning Assistant</h3>
              <p className="text-sm text-muted-foreground">Get help with your studies</p>
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              Need help understanding a concept? Want to practice with generated questions? Your AI assistant is
              available in your courses to provide personalized learning support.
            </p>
          </div>
          <Button className="w-full mt-4" onClick={() => setShowChat(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </Card>
      </div>

      {/* AI Chat Popup */}
      {showChat && (
        <div className="fixed bottom-4 right-4 w-80 bg-card rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask me anything..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>Send</Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Button */}
      {!showChat && (
        <Button className="fixed bottom-4 right-4 shadow-lg" onClick={() => setShowChat(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Ask AI
        </Button>
      )}
    </div>
  )
}
