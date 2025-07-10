"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Star, Users, Plus, Search, Filter, Trash2, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { mockCourses, mockProfile } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [courses, setCourses] = useState(mockCourses)
  const { toast } = useToast()
  const isTeacher = mockProfile.role === "teacher"

  const handleEnroll = async (courseId: string) => {
    toast({
      title: "Enrolled Successfully",
      description: "You have been enrolled in this course.",
    })
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!isTeacher) return

    try {
      setCourses(courses.filter((course) => course.id !== courseId))
      toast({
        title: "Course Deleted",
        description: "The course has been successfully deleted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the course.",
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-muted-foreground">
            {isTeacher ? "Manage your courses and create new ones" : "Explore available courses and enroll"}
          </p>
        </div>
        {isTeacher && (
          <Button asChild>
            <Link href="/dashboard/courses/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const isEnrolled = course.enrollments?.some((enrollment) => enrollment.user_id === mockProfile.id)

          return (
            <Card key={course.id} className="overflow-hidden">
              {course.cover_image && (
                <div className="aspect-video w-full overflow-hidden">
                  <img src={course.cover_image} alt={course.title} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm">{course.difficulty_level}/5</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-sm">{course.enrollments?.length || 0} enrolled</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">By {course.profiles?.full_name}</div>
                  {isTeacher ? (
                    <div className="space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/courses/${course.id}/edit`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(course.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : isEnrolled ? (
                    <Button asChild>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <Button onClick={() => handleEnroll(course.id)}>Enroll Now</Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
