"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Calendar, FileText, Download, Upload, CheckCircle, AlertTriangle } from "lucide-react"
import { mockAssignments } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const assignmentId = params.id as string

  // Find the assignment from mock data
  const assignment = mockAssignments.find((a) => a.id === assignmentId)

  const [submissionText, setSubmissionText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  // Handle assignment submission
  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Assignment Submitted",
        description: "Your assignment has been submitted successfully.",
      })

      // In a real app, we would save the submission to the database here
      router.push("/dashboard/assignments")
    }, 2000)
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

  // Check if assignment is due soon (within 48 hours)
  const isDueSoon = (dateString: string) => {
    const dueDate = new Date(dateString)
    const now = new Date()
    const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffHours > 0 && diffHours < 48
  }

  // If assignment not found
  if (!assignment) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Assignment Not Found</CardTitle>
            <CardDescription>The assignment you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/dashboard/assignments")}>Back to Assignments</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{assignment.title}</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/assignments")}>
          Back to Assignments
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Assignment Details</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              <CardDescription>{assignment.course}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{assignment.description}</p>

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                <span>Due: {formatDate(assignment.dueDate)}</span>
              </div>

              {isDueSoon(assignment.dueDate) && assignment.status !== "completed" && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Due Soon</AlertTitle>
                  <AlertDescription>
                    This assignment is due soon. Make sure to submit your work on time.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {assignment.resources && assignment.resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {assignment.resources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
                        <span>{resource.name}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submission" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Assignment</CardTitle>
              <CardDescription>Upload your files and add any notes for your submission</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="submission-notes">Submission Notes</Label>
                <Textarea
                  id="submission-notes"
                  placeholder="Add any notes or comments about your submission..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload Files</Label>
                <div className="grid w-full items-center gap-1.5">
                  <Input id="file-upload" type="file" multiple onChange={handleFileChange} />
                  <p className="text-sm text-muted-foreground">
                    Accepted file types: PDF, DOCX, ZIP, JPG, PNG (Max 10MB per file)
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files</Label>
                  <div className="space-y-2">
                    {Array.from(files).map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Assignment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Submission Guidelines</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Make sure all files are properly named according to the assignment guidelines.</li>
                <li>Double-check your submission before finalizing.</li>
                <li>
                  You can submit multiple times before the deadline, but only the latest submission will be graded.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
