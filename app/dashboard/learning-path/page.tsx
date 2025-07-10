"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, BookOpen, TrendingUp, Target, Award } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { mockLearningPath, mockCourses } from "@/lib/mock-data"
import type { Course, LearningPath } from "@/lib/mock-data"

export default function LearningPathPage() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLearningPath() {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setLearningPath(mockLearningPath)

        // Filter recommended courses
        const recommended = mockCourses.filter((course) =>
          Object.keys(mockLearningPath.recommended_courses).includes(course.id),
        )
        setRecommendedCourses(recommended)
      } catch (error) {
        console.error("Error loading learning path:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLearningPath()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Learning Path</h1>
        <p className="text-muted-foreground">Personalized recommendations based on your progress and goals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Learning Goals</h3>
              <p className="text-sm text-muted-foreground">Track your progress towards your goals</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Complete AI Basics</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Master ML Concepts</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">AI Insights</h3>
              <p className="text-sm text-muted-foreground">Personalized learning recommendations</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm">
              {learningPath?.ai_insights ||
                "Based on your progress, we recommend focusing on fundamental AI concepts before moving to advanced topics."}
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Recommended Courses</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recommendedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              {course.cover_image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img src={course.cover_image} alt={course.title} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                <Button className="w-full">Start Learning</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Achievements</h3>
            <p className="text-sm text-muted-foreground">Your learning milestones</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: "Course Completed", count: 3 },
            { icon: Brain, label: "Skills Mastered", count: 12 },
            { icon: TrendingUp, label: "Current Streak", count: 7 },
            { icon: Award, label: "Badges Earned", count: 5 },
          ].map((achievement, i) => (
            <div key={i} className="text-center">
              <achievement.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{achievement.count}</div>
              <div className="text-sm text-muted-foreground">{achievement.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
