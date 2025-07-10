"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Clock, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Assignment title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Assignment description must be at least 10 characters.",
  }),
  courseId: z.string().min(1, {
    message: "Please select a course.",
  }),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  dueTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Please enter a valid time in 24-hour format (HH:MM).",
  }),
  totalPoints: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Total points must be a positive number.",
  }),
  allowLateSubmissions: z.boolean().default(false),
  latePenalty: z.string().optional(),
  submissionType: z.enum(["file", "text", "link", "mixed"]),
  allowedFileTypes: z.string().optional(),
  maxFileSize: z.string().optional(),
  groupAssignment: z.boolean().default(false),
  maxGroupSize: z.string().optional(),
  rubricEnabled: z.boolean().default(false),
})

interface RubricCriterion {
  id: string
  name: string
  description: string
  points: number
  levels: {
    id: string
    name: string
    points: number
    description: string
  }[]
}

export default function CreateAssignmentPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([])
  const [currentCriterion, setCurrentCriterion] = useState<RubricCriterion>({
    id: Math.random().toString(36).substring(2, 9),
    name: "",
    description: "",
    points: 10,
    levels: [
      {
        id: Math.random().toString(36).substring(2, 9),
        name: "Excellent",
        points: 10,
        description: "Exceeds expectations",
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        name: "Good",
        points: 8,
        description: "Meets expectations",
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        name: "Satisfactory",
        points: 6,
        description: "Partially meets expectations",
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        name: "Needs Improvement",
        points: 3,
        description: "Below expectations",
      },
    ],
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      dueTime: "23:59",
      totalPoints: "100",
      allowLateSubmissions: false,
      latePenalty: "10",
      submissionType: "file",
      allowedFileTypes: ".pdf,.doc,.docx",
      maxFileSize: "10",
      groupAssignment: false,
      maxGroupSize: "4",
      rubricEnabled: false,
    },
  })

  const watchAllowLate = form.watch("allowLateSubmissions")
  const watchSubmissionType = form.watch("submissionType")
  const watchGroupAssignment = form.watch("groupAssignment")
  const watchRubricEnabled = form.watch("rubricEnabled")

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log({
        ...values,
        attachmentFile: attachmentFile ? attachmentFile.name : null,
        rubricCriteria: watchRubricEnabled ? rubricCriteria : [],
      })
      toast({
        title: "Assignment created successfully",
        description: `${values.title} has been created and is now available.`,
      })
      setIsSubmitting(false)
      router.push("/dashboard/teacher/assignments")
    }, 1500)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentFile(e.target.files[0])
    }
  }

  const handleAddCriterion = () => {
    if (!currentCriterion.name.trim()) {
      toast({
        title: "Criterion name required",
        description: "Please enter a name for the criterion.",
        variant: "destructive",
      })
      return
    }

    setRubricCriteria([...rubricCriteria, currentCriterion])

    // Reset current criterion
    setCurrentCriterion({
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      description: "",
      points: 10,
      levels: [
        {
          id: Math.random().toString(36).substring(2, 9),
          name: "Excellent",
          points: 10,
          description: "Exceeds expectations",
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          name: "Good",
          points: 8,
          description: "Meets expectations",
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          name: "Satisfactory",
          points: 6,
          description: "Partially meets expectations",
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          name: "Needs Improvement",
          points: 3,
          description: "Below expectations",
        },
      ],
    })
  }

  const removeCriterion = (id: string) => {
    setRubricCriteria(rubricCriteria.filter((c) => c.id !== id))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Assignment</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/teacher/assignments")}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new assignment. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Research Paper" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Associated Course *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="course-1">Introduction to Neuroscience</SelectItem>
                          <SelectItem value="course-2">Cognitive Psychology</SelectItem>
                          <SelectItem value="course-3">Brain Development</SelectItem>
                          <SelectItem value="course-4">Neural Networks</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide detailed instructions for the assignment."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dueTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Time *</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <Input type="time" {...field} />
                            <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Points *</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="submissionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Submission Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select submission type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="file">File Upload</SelectItem>
                          <SelectItem value="text">Text Entry</SelectItem>
                          <SelectItem value="link">Website URL</SelectItem>
                          <SelectItem value="mixed">Mixed (Multiple Types)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {(watchSubmissionType === "file" || watchSubmissionType === "mixed") && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="allowedFileTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowed File Types</FormLabel>
                        <FormControl>
                          <Input placeholder=".pdf,.doc,.docx" {...field} />
                        </FormControl>
                        <FormDescription>Enter file extensions separated by commas</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxFileSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max File Size (MB)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-4">
                <FormLabel>Assignment Instructions File (Optional)</FormLabel>
                <div className="flex items-center gap-4">
                  <Input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="max-w-md" />
                  {attachmentFile && (
                    <div className="text-sm text-muted-foreground">
                      {attachmentFile.name} ({Math.round(attachmentFile.size / 1024)} KB)
                    </div>
                  )}
                </div>
                <FormDescription>Upload detailed instructions or supplementary materials</FormDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="allowLateSubmissions"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Allow Late Submissions</FormLabel>
                        <FormDescription>Students can submit after the due date with penalty</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {watchAllowLate && (
                  <FormField
                    control={form.control}
                    name="latePenalty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Late Penalty (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>Percentage deducted per day late</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="groupAssignment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Group Assignment</FormLabel>
                        <FormDescription>Students can work in groups for this assignment</FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {watchGroupAssignment && (
                  <FormField
                    control={form.control}
                    name="maxGroupSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Group Size</FormLabel>
                        <FormControl>
                          <Input type="number" min="2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="rubricEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Grading Rubric</FormLabel>
                      <FormDescription>Create a detailed rubric for grading this assignment</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {watchRubricEnabled && (
                <div className="border rounded-md p-4 space-y-6">
                  <h3 className="text-lg font-medium">Grading Rubric</h3>

                  {rubricCriteria.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {rubricCriteria.map((criterion, index) => (
                        <div key={criterion.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-medium">{criterion.name}</span>
                              <span className="ml-2 text-sm text-muted-foreground">({criterion.points} points)</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeCriterion(criterion.id)}>
                              <Loader2 className="h-4 w-4" />
                            </Button>
                          </div>
                          {criterion.description && (
                            <p className="text-sm text-muted-foreground mb-2">{criterion.description}</p>
                          )}

                          <div className="mt-2 space-y-1">
                            <div className="text-sm font-medium">Rating Levels:</div>
                            {criterion.levels.map((level) => (
                              <div key={level.id} className="ml-4 text-sm">
                                <span className="font-medium">{level.name}</span>
                                <span className="text-muted-foreground"> - {level.points} points</span>
                                <p className="text-xs text-muted-foreground">{level.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormLabel>Criterion Name</FormLabel>
                        <Input
                          value={currentCriterion.name}
                          onChange={(e) =>
                            setCurrentCriterion({
                              ...currentCriterion,
                              name: e.target.value,
                            })
                          }
                          placeholder="e.g., Content Quality"
                        />
                      </div>
                      <div>
                        <FormLabel>Points</FormLabel>
                        <Input
                          type="number"
                          min="1"
                          value={currentCriterion.points}
                          onChange={(e) =>
                            setCurrentCriterion({
                              ...currentCriterion,
                              points: Number.parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <FormLabel>Description (Optional)</FormLabel>
                      <Textarea
                        value={currentCriterion.description}
                        onChange={(e) =>
                          setCurrentCriterion({
                            ...currentCriterion,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe what this criterion evaluates"
                      />
                    </div>

                    <Button type="button" onClick={handleAddCriterion} variant="outline">
                      Add Criterion
                    </Button>
                  </div>
                </div>
              )}

              <CardFooter className="flex justify-end px-0 pb-0">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Assignment
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
