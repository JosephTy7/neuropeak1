"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, CheckCircle, Circle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { mockAssignments } from "@/lib/mock-data"

export default function AssignmentsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

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

  // Check if assignment is due soon (within 48 hours)
  const isDueSoon = (dateString: string) => {
    const dueDate = new Date(dateString)
    const now = new Date()
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffHours > 0 && diffHours < 48
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Circle className="h-5 w-5 text-amber-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in_progress":
        return "In Progress"
      default:
        return "Not Started"
    }
  }

  // Filter assignments based on selected tab
  const filteredAssignments = mockAssignments.filter((assignment) => {
    if (filter === "all") return true
    if (filter === "active") return assignment.status !== "completed"
    if (filter === "completed") return assignment.status === "completed"
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Assignments</h1>
        <p className="text-muted-foreground">View and submit your assignments</p>
      </div>

      <Tabs defaultValue="all" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>No assignments found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(assignment.status)}
                      <div>
                        <CardTitle>{assignment.title}</CardTitle>
                        <CardDescription>{assignment.course}</CardDescription>
                      </div>
                    </div>
                    <div>
                      <Badge
                        variant={
                          assignment.status === "completed"
                            ? "outline"
                            : isDueSoon(assignment.dueDate)
                              ? "destructive"
                              : "outline"
                        }
                      >
                        {assignment.status === "completed"
                          ? "Completed"
                          : isDueSoon(assignment.dueDate)
                            ? "Due Soon"
                            : getStatusText(assignment.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-3">
                    <p className="text-sm">{assignment.description}</p>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Due: {formatDate(assignment.dueDate)}</span>
                    </div>

                    {assignment.resources && assignment.resources.length > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Resources: {assignment.resources.length} file(s)</span>
                      </div>
                    )}

                    {isDueSoon(assignment.dueDate) && assignment.status !== "completed" && (
                      <div className="flex items-center text-amber-600 text-sm mt-2">
                        <AlertCircle className="mr-2 h-4 w-4" />
                        <span>This assignment is due soon!</span>
                      </div>
                    )}

                    <div className="pt-3">
                      <Button asChild>
                        <Link href={`/dashboard/assignments/${assignment.id}`}>
                          {assignment.status === "completed" ? "View Submission" : "View Assignment"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {/* Content will be filtered by the filter state */}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {/* Content will be filtered by the filter state */}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Submit all assignments before the due date to avoid penalties.</li>
            <li>Follow the formatting guidelines provided in each assignment.</li>
            <li>If you have questions, use the comments section in each assignment.</li>
            <li>You can save drafts of your work and submit when ready.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
