"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Loader2, PlusCircle, TrashIcon } from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Quiz title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Quiz description must be at least 10 characters.",
  }),
  courseId: z.string().min(1, {
    message: "Please select a course.",
  }),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  timeLimit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Time limit must be a positive number.",
  }),
  passingScore: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
    message: "Passing score must be between 0 and 100.",
  }),
  attemptsAllowed: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Attempts allowed must be a positive number.",
  }),
})

type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "essay"

interface Question {
  id: string
  type: QuestionType
  text: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "multiple-choice",
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 10,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      courseId: "",
      timeLimit: "60",
      passingScore: "70",
      attemptsAllowed: "2",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (questions.length === 0) {
      toast({
        title: "No questions added",
        description: "Please add at least one question to the quiz.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log({ ...values, questions })
      toast({
        title: "Quiz created successfully",
        description: `${values.title} has been created and is now available.`,
      })
      setIsSubmitting(false)
      router.push("/dashboard/teacher/quizzes")
    }, 1500)
  }

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      text: e.target.value,
    })
  }

  const handleQuestionTypeChange = (type: QuestionType) => {
    const newQuestion: Question = {
      ...currentQuestion,
      type,
      correctAnswer: type === "multiple-choice" ? "" : type === "true-false" ? "true" : "",
    }

    if (type === "multiple-choice") {
      newQuestion.options = ["", "", "", ""]
    } else if (type === "true-false") {
      newQuestion.options = ["True", "False"]
    } else {
      delete newQuestion.options
    }

    setCurrentQuestion(newQuestion)
  }

  const handleOptionChange = (index: number, value: string) => {
    if (currentQuestion.options) {
      const newOptions = [...currentQuestion.options]
      newOptions[index] = value
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      })
    }
  }

  const handleCorrectAnswerChange = (value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: value,
    })
  }

  const handleMultipleCorrectAnswers = (option: string) => {
    const currentAnswers = Array.isArray(currentQuestion.correctAnswer) ? currentQuestion.correctAnswer : []

    const newAnswers = currentAnswers.includes(option)
      ? currentAnswers.filter((a) => a !== option)
      : [...currentAnswers, option]

    setCurrentQuestion({
      ...currentQuestion,
      correctAnswer: newAnswers,
    })
  }

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = Number.parseInt(e.target.value) || 0
    setCurrentQuestion({
      ...currentQuestion,
      points: points > 0 ? points : 0,
    })
  }

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      toast({
        title: "Question text required",
        description: "Please enter text for the question.",
        variant: "destructive",
      })
      return
    }

    if (
      currentQuestion.type === "multiple-choice" &&
      (!currentQuestion.options?.some((o) => o.trim()) || !currentQuestion.correctAnswer)
    ) {
      toast({
        title: "Incomplete question",
        description: "Please add at least one option and select a correct answer.",
        variant: "destructive",
      })
      return
    }

    const newQuestion = {
      ...currentQuestion,
      id: Math.random().toString(36).substring(2, 9),
    }

    setQuestions([...questions, newQuestion])

    // Reset current question
    setCurrentQuestion({
      id: "",
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
    })
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create New Quiz</h1>
        <Button variant="outline" onClick={() => router.push("/dashboard/teacher/quizzes")}>
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>
                Fill in the details below to create a new quiz. All fields marked with * are required.
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
                          <FormLabel>Quiz Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Midterm Assessment" {...field} />
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
                        <FormLabel>Quiz Description *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a description of the quiz content and objectives."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="timeLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time Limit (minutes) *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>Set to 0 for no time limit</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="passingScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passing Score (%) *</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="attemptsAllowed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attempts Allowed *</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                                  "w-full md:w-[240px] pl-3 text-left font-normal",
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

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Questions ({questions.length})</h3>

                    {questions.length > 0 ? (
                      <div className="space-y-4 mb-6">
                        {questions.map((q, index) => (
                          <div key={q.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-medium">Question {index + 1}</span>
                                <span className="ml-2 text-sm text-muted-foreground">
                                  ({q.type}) - {q.points} points
                                </span>
                              </div>
                              <Button variant="ghost" size="icon" onClick={() => removeQuestion(q.id)}>
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="mb-2">{q.text}</p>

                            {q.options && (
                              <div className="ml-4 space-y-1">
                                {q.options.map((option, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <div
                                      className={cn(
                                        "w-2 h-2 rounded-full",
                                        q.correctAnswer === option ||
                                          (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(option))
                                          ? "bg-green-500"
                                          : "bg-gray-300",
                                      )}
                                    />
                                    <span>{option || `(Empty option ${i + 1})`}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {q.type === "short-answer" && (
                              <div className="ml-4 text-sm text-muted-foreground">
                                <span>Expected answer: </span>
                                <span className="font-medium">{q.correctAnswer || "(Not specified)"}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border rounded-md bg-muted/50">
                        <p className="text-muted-foreground">No questions added yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use the question editor to add questions to your quiz
                        </p>
                      </div>
                    )}
                  </div>

                  <CardFooter className="flex justify-end px-0 pb-0">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Quiz
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
              <CardTitle>Question Editor</CardTitle>
              <CardDescription>Create questions for your quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Question Type
                  </label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value) => handleQuestionTypeChange(value as QuestionType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="short-answer">Short Answer</SelectItem>
                      <SelectItem value="essay">Essay Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Question Text
                  </label>
                  <Textarea
                    value={currentQuestion.text}
                    onChange={handleQuestionTextChange}
                    placeholder="Enter your question here"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Points
                  </label>
                  <Input type="number" min="1" value={currentQuestion.points} onChange={handlePointsChange} />
                </div>

                {currentQuestion.type === "multiple-choice" && (
                  <div className="space-y-4">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Options
                    </label>
                    <Tabs defaultValue="single" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single">Single Answer</TabsTrigger>
                        <TabsTrigger value="multiple">Multiple Answers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="single" className="space-y-4">
                        <RadioGroup
                          value={currentQuestion.correctAnswer as string}
                          onValueChange={handleCorrectAnswerChange}
                        >
                          {currentQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <RadioGroupItem value={option || `option-${index}`} id={`option-${index}`} />
                              <Input
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </TabsContent>
                      <TabsContent value="multiple" className="space-y-4">
                        {currentQuestion.options?.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox
                              id={`multi-option-${index}`}
                              checked={
                                Array.isArray(currentQuestion.correctAnswer) &&
                                currentQuestion.correctAnswer.includes(option)
                              }
                              onCheckedChange={() => handleMultipleCorrectAnswers(option)}
                            />
                            <Input
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {currentQuestion.type === "true-false" && (
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Correct Answer
                    </label>
                    <RadioGroup
                      value={currentQuestion.correctAnswer as string}
                      onValueChange={handleCorrectAnswerChange}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="true" />
                        <label htmlFor="true">True</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="false" />
                        <label htmlFor="false">False</label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {currentQuestion.type === "short-answer" && (
                  <div>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Expected Answer (Optional)
                    </label>
                    <Input
                      value={(currentQuestion.correctAnswer as string) || ""}
                      onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                      placeholder="Enter expected answer"
                    />
                    <p className="text-sm text-muted-foreground">This will be used for auto-grading</p>
                  </div>
                )}

                <Button type="button" onClick={addQuestion} className="w-full">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
