"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { CalendarIcon, Clock, Loader2, PlusCircle, TrashIcon, Upload } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Lecture title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Lecture description must be at least 10 characters.",
  }),
  courseId: z.string().min(1, {
    message: "Please select a course.",
  }),
  lectureDate: z.date({
    required_error: "A lecture date is required.",
  }),
  duration: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Duration must be a positive number.",
  }),
  isLive: z.boolean().default(false),
  liveStartTime: z.string().optional(),
  liveEndTime: z.string().optional(),
  livePlatform: z.string().optional(),
  liveUrl: z.string().optional(),
  isRecorded: z.boolean().default(false),
  isPublished: z.boolean().default(false),
})

interface LectureMaterial {
  id: string
  type: "document" | "video" | "link" | "other"
  title: string
  description?: string
  url?: string
  file?: File
}

export default function CreateLecturePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [materials, setMaterials] = useState<LectureMaterial[]>([])
  const [currentMaterial, setCurrentMaterial] = useState<LectureMaterial>({
    id: Math.random().toString(36).substring(2, 9),
    type: "document",
    title: "",
    description: "",
  })
  const [lectureType, setLectureType] = useState<"recorded" | "live" | "document">("recorded")
  const [videoFile, setVideoFile] = useState<File | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      duration: "60",
      isLive: false,
      liveStartTime: "",
      liveEndTime: "",
      livePlatform: "zoom",
      liveUrl: "",
      isRecorded: true,
      isPublished: false,
    },
  })

  const watchIsLive = form.watch("isLive")

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (lectureType === "recorded" && !videoFile && materials.length === 0) {
      toast({
        title: "Missing content",
        description: "Please upload a video or add materials for your lecture.",
        variant: "destructive",
      })
      return
    }

    if (lectureType === "live" && !values.liveUrl) {
      toast({
        title: "Missing live URL",
        description: "Please provide a URL for the live session.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log({
        ...values,
        lectureType,
        videoFile: videoFile ? videoFile.name : null,
        materials,
      })
      toast({
        title: "Lecture created successfully",
        description: `${values.title} has been created and is now ${values.isPublished ? "published" : "saved as draft"}.`,
      })
      setIsSubmitting(false)
      router.push("/dashboard/teacher/lectures")
    }, 1500)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleMaterialFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentMaterial({
        ...currentMaterial,
        file: e.target.files[0],
        title: e.target.files[0].name,
      })
    }
  }

  const handleAddMaterial = () => {
    if (!currentMaterial.title.trim()) {
      toast({
        title: "Material title required",
        description: "Please enter a title for the material.",
        variant: "destructive",
      })
      return
    }

    if (currentMaterial.type === "link" && !currentMaterial.url) {
      toast({
        title: "URL required",
        description: "Please enter a URL for the link material.",
        variant: "destructive",
      })
      return
    }

    if ((currentMaterial.type === "document" || currentMaterial.type === "video") && !currentMaterial.file) {
      toast({
        title: "File required",
        description: `Please upload a file for the ${currentMaterial.type} material.`,
        variant: "destructive",
      })
      return
    }

    setMaterials([...materials, currentMaterial])

    // Reset current material
    setCurrentMaterial({
      id: Math.random().toString(36).substring(2, 9),
      type: "document",
      title: "",
      description: "",
    })
  }

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((m) => m.id !== id))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Lecture</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/teacher/lectures")}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lecture Details</CardTitle>
              <CardDescription>
                Fill in the details below to create a new lecture. All fields marked with * are required.
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
                          <FormLabel>Lecture Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Introduction to Neural Networks" {...field} />
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
                              <SelectItem value="course-3">Neural Networks and Deep Learning</SelectItem>
                              <SelectItem value="course-4">Brain Development</SelectItem>
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
                        <FormLabel>Lecture Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a description of the lecture content and learning objectives."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="lectureDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Lecture Date *</FormLabel>
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
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes) *</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <Input type="number" min="1" {...field} />
                              <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Lecture Content</h3>

                    <Tabs defaultValue="recorded" onValueChange={(value) => setLectureType(value as any)}>
                      <TabsList className="w-full justify-start mb-4">
                        <TabsTrigger value="recorded" className="flex-1 sm:flex-none">
                          Recorded Video
                        </TabsTrigger>
                        <TabsTrigger value="live" className="flex-1 sm:flex-none">
                          Live Session
                        </TabsTrigger>
                        <TabsTrigger value="document" className="flex-1 sm:flex-none">
                          Document-based
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="recorded" className="space-y-4">
                        <div className="space-y-4">
                          <FormLabel>Upload Video</FormLabel>
                          <div className="border-2 border-dashed rounded-md p-6 text-center">
                            <Input
                              type="file"
                              accept="video/*"
                              onChange={handleVideoFileChange}
                              className="hidden"
                              id="video-upload"
                            />
                            <label
                              htmlFor="video-upload"
                              className="flex flex-col items-center justify-center cursor-pointer"
                            >
                              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-sm font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4, WebM, or MOV (max. 2GB)</p>
                            </label>
                            {videoFile && (
                              <div className="mt-4 text-sm">
                                <p className="font-medium">{videoFile.name}</p>
                                <p className="text-muted-foreground">
                                  {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="isRecorded"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Make Available for Download</FormLabel>
                                <FormDescription>
                                  Allow students to download the video for offline viewing
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="live" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="isLive"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">Schedule Live Session</FormLabel>
                                <FormDescription>
                                  Set up a live streaming session for real-time interaction
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {watchIsLive && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="liveStartTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Time *</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="liveEndTime"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Time *</FormLabel>
                                    <FormControl>
                                      <Input type="time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="livePlatform"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Platform *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select platform" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="zoom">Zoom</SelectItem>
                                      <SelectItem value="google-meet">Google Meet</SelectItem>
                                      <SelectItem value="microsoft-teams">Microsoft Teams</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="liveUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Meeting URL *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://zoom.us/j/123456789" type="url" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="document" className="space-y-4">
                        <p className="text-sm text-muted-foreground mb-4">
                          Create a document-based lecture by adding materials below. You should add at least one
                          document.
                        </p>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Supplementary Materials</h3>
                      <p className="text-sm text-muted-foreground">Optional resources for students</p>
                    </div>

                    {materials.length > 0 && (
                      <div className="space-y-4 mb-6">
                        {materials.map((material) => (
                          <div key={material.id} className="flex items-start justify-between border rounded-md p-4">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium">{material.title}</span>
                                <Badge variant="outline" className="ml-2">
                                  {material.type}
                                </Badge>
                              </div>
                              {material.description && (
                                <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                              )}
                              {material.file && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {(material.file.size / 1024).toFixed(2)} KB
                                </p>
                              )}
                              {material.url && (
                                <p className="text-xs text-muted-foreground mt-1 truncate max-w-md">{material.url}</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMaterial(material.id)}
                              className="h-8 w-8"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-4 border rounded-md p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormLabel>Material Type</FormLabel>
                          <Select
                            value={currentMaterial.type}
                            onValueChange={(value) => setCurrentMaterial({ ...currentMaterial, type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="document">Document</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                              <SelectItem value="link">Link</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <FormLabel>Material Title</FormLabel>
                          <Input
                            value={currentMaterial.title}
                            onChange={(e) => setCurrentMaterial({ ...currentMaterial, title: e.target.value })}
                            placeholder="Reading material, Additional video, etc."
                          />
                        </div>
                      </div>

                      <div>
                        <FormLabel>Description (Optional)</FormLabel>
                        <Textarea
                          value={currentMaterial.description || ""}
                          onChange={(e) => setCurrentMaterial({ ...currentMaterial, description: e.target.value })}
                          placeholder="Brief description of this material"
                          rows={2}
                        />
                      </div>

                      {currentMaterial.type === "link" ? (
                        <div>
                          <FormLabel>URL</FormLabel>
                          <Input
                            type="url"
                            value={currentMaterial.url || ""}
                            onChange={(e) => setCurrentMaterial({ ...currentMaterial, url: e.target.value })}
                            placeholder="https://example.com"
                          />
                        </div>
                      ) : (
                        <div>
                          <FormLabel>Upload File</FormLabel>
                          <Input
                            type="file"
                            onChange={handleMaterialFileChange}
                            accept={
                              currentMaterial.type === "document"
                                ? ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                                : currentMaterial.type === "video"
                                  ? "video/*"
                                  : "*/*"
                            }
                          />
                        </div>
                      )}

                      <Button type="button" onClick={handleAddMaterial} variant="outline" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Material
                      </Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Publish Immediately</FormLabel>
                          <FormDescription>
                            Make this lecture available to students right away, or save as draft
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <CardFooter className="flex justify-end px-0 pb-0">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Lecture
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Lecture Guidelines</CardTitle>
              <CardDescription>Best practices for creating effective lectures</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Structure Your Content</h4>
                <p className="text-sm text-muted-foreground">
                  Organize your lecture with a clear introduction, main content sections, and conclusion.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Optimal Duration</h4>
                <p className="text-sm text-muted-foreground">
                  Keep video lectures between 10-15 minutes per segment to maintain student attention.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Supplementary Materials</h4>
                <p className="text-sm text-muted-foreground">
                  Provide additional resources like readings, practice exercises, and reference materials.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Live Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Schedule live sessions for interactive discussions, Q&A, and real-time feedback.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Accessibility</h4>
                <p className="text-sm text-muted-foreground">
                  Include transcripts or captions for video content to improve accessibility.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
