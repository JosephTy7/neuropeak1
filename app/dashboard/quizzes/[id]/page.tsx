"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Clock, CheckCircle, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { mockQuizzes } from "@/lib/mock-data"
import Link from "next/link"

export default function QuizDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const quizId = params.id

  // Find the quiz by ID
  const quiz = mockQuizzes.find((q) => q.id === quizId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [timeRemaining, setTimeRemaining] = useState(quiz?.timeLimit ? quiz.timeLimit * 60 : 1800) // in seconds
  const [quizSubmitted, setQuizSubmitted] = useState(quiz?.status === "completed")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)

  // If quiz not found
  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quiz Not Found</h2>
        <p className="text-muted-foreground mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/dashboard/quizzes">Back to Quizzes</Link>
        </Button>
      </div>
    )
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex]
  const totalQuestions = quiz.questions?.length || 0
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const isFirstQuestion = currentQuestionIndex === 0

  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60)
    const seconds = timeRemaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Submit quiz
  const handleSubmitQuiz = useCallback(() => {
    // Calculate score (in a real app, this would be done on the server)
    let correctAnswers = 0

    quiz.questions?.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / totalQuestions) * 100)

    // In a real app, you would send this to the server
    console.log("Quiz submitted with score:", score)

    // Update UI
    setQuizSubmitted(true)

    // Close dialog if open
    setShowConfirmDialog(false)
  }, [selectedAnswers, totalQuestions, quiz])

  // Handle timer
  useEffect(() => {
    if (quizSubmitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }

        // Show warning when 5 minutes remaining
        if (prev === 300) {
          setShowTimeWarning(true)
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizSubmitted, handleSubmitQuiz])

  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // If quiz is already completed, show results
  if (quiz.status === "completed" || quizSubmitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            <p className="text-muted-foreground">{quiz.course}</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-4 w-4" /> Completed
          </Badge>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-green-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Quiz Results</CardTitle>
              <Badge variant="secondary" className="text-lg">
                Score: {quiz.score}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your Score</span>
                  <span className="font-medium">{quiz.score}%</span>
                </div>
                <Progress value={quiz.score} className="h-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                  <p className="text-2xl font-bold">{Math.round((quiz.score / 100) * totalQuestions)}</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">Incorrect Answers</p>
                  <p className="text-2xl font-bold">
                    {totalQuestions - Math.round((quiz.score / 100) * totalQuestions)}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Feedback</h3>
                <p className="text-sm">
                  {quiz.score >= 90
                    ? "Excellent work! You've mastered this material."
                    : quiz.score >= 80
                      ? "Great job! You have a solid understanding of the concepts."
                      : quiz.score >= 70
                        ? "Good work! Review the questions you missed to improve your understanding."
                        : "You might need additional study on this topic. Consider reviewing the course materials again."}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/quizzes">Back to Quizzes</Link>
            </Button>
            <Button asChild>
              <Link href={`/dashboard/courses/${quiz.course.toLowerCase().replace(/\s+/g, "-")}`}>
                Review Course Material
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  // Active quiz view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">{quiz.course}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <Clock className="mr-1 h-4 w-4" /> Time Remaining: {formatTimeRemaining()}
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </CardTitle>
            <Badge variant="outline">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Complete</Badge>
          </div>
          <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent className="pt-6">
          {currentQuestion ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

              <RadioGroup
                value={selectedAnswers[currentQuestion.id]?.toString()}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, Number.parseInt(value))}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer py-2">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          ) : (
            <p>No questions available for this quiz.</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrevQuestion} disabled={isFirstQuestion}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {isLastQuestion ? (
              <Button onClick={() => setShowConfirmDialog(true)}>Submit Quiz</Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle>Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {quiz.questions?.map((_, index) => (
              <Button
                key={index}
                variant={
                  index === currentQuestionIndex
                    ? "default"
                    : selectedAnswers[quiz.questions[index].id] !== undefined
                      ? "secondary"
                      : "outline"
                }
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="w-10 h-10 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this quiz? You won't be able to change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="text-sm">Make sure you've answered all questions before submitting.</p>
            </div>

            <div className="mt-4">
              <p className="text-sm">
                <span className="font-medium">Questions answered:</span> {Object.keys(selectedAnswers).length} of{" "}
                {totalQuestions}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitQuiz}>Submit Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Time Warning Dialog */}
      <Dialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Time is running out!</DialogTitle>
            <DialogDescription>You have less than 5 minutes remaining to complete this quiz.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <Clock className="h-5 w-5" />
              <p className="text-sm">Please finish answering all questions and submit your quiz.</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowTimeWarning(false)}>Continue Quiz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
