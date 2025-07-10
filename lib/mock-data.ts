export interface User {
  id: string
  email: string
  full_name: string | null
  role: "admin" | "teacher" | "student"
  avatar_url: string | null
}

export interface Course {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  created_by: string
  difficulty_level: number
  is_published: boolean
  profiles?: {
    full_name: string
  }
  enrollments?: Array<{ user_id: string }>
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  order_index: number
}

export interface Progress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  completed_at: string | null
}

export interface QuizAttempt {
  id: string
  user_id: string
  lesson_id: string
  score: number
  answers: Record<string, any>
}

export interface LearningPath {
  id: string
  user_id: string
  recommended_courses: Record<string, any>
  ai_insights: string
}

// Mock users with different roles
export const mockUsers = {
  admin: {
    id: "1",
    email: "admin@neuropeak.com",
    password: "admin123", // In a real app, passwords would be hashed
    full_name: "Joseph Mwamba",
    role: "admin",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  },
  teacher: {
    id: "2",
    email: "teacher@neuropeak.com",
    password: "teacher123",
    full_name: "Taizya Simunza",
    role: "teacher",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  student: {
    id: "3",
    email: "student@neuropeak.com",
    password: "student123",
    full_name: "Narco",
    role: "student",
    avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
  },
}

// Initialize with a default profile, but this will be updated on login
// IMPORTANT: This is now a let instead of const so it can be updated
export let mockProfile = mockUsers.student

export const mockLearningPath = {
  id: "1",
  user_id: "3", // For student Narco
  recommended_courses: {
    "1": { priority: 1 },
    "2": { priority: 2 },
    "3": { priority: 3 },
  },
  ai_insights: "Based on your progress, we recommend focusing on neural networks next.",
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning and AI algorithms",
    cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    created_by: "2", // Created by teacher Taizya Simunza
    difficulty_level: 2,
    is_published: true,
    profiles: {
      full_name: "Taizya Simunza",
    },
    enrollments: [
      { user_id: "3" }, // Enrolled by student Narco
    ],
  },
  {
    id: "2",
    title: "Deep Learning Fundamentals",
    description: "Master neural networks and deep learning concepts",
    cover_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    created_by: "2",
    difficulty_level: 3,
    is_published: true,
    profiles: {
      full_name: "Taizya Simunza",
    },
    enrollments: [],
  },
  {
    id: "3",
    title: "AI Ethics and Society",
    description: "Explore the ethical implications of artificial intelligence",
    cover_image: "https://images.unsplash.com/photo-1655720828018-edd2daec9349",
    created_by: "2",
    difficulty_level: 1,
    is_published: true,
    profiles: {
      full_name: "Taizya Simunza",
    },
    enrollments: [],
  },
]

export const mockEnrolledCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    description: "Learn the fundamentals of machine learning and AI algorithms",
    cover_image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    difficulty_level: 2,
  },
]

// Mock quizzes data
export const mockQuizzes = [
  {
    id: "1",
    title: "Neural Networks Fundamentals",
    course: "Deep Learning",
    dueDate: "2025-05-22T15:00:00",
    timeLimit: 30, // minutes
    status: "not_started",
    questions: [
      {
        id: "q1",
        question: "Which of the following is NOT a type of neural network?",
        options: [
          "Convolutional Neural Network (CNN)",
          "Recurrent Neural Network (RNN)",
          "Quantum Neural Network (QNN)",
          "Distributed Processing Network (DPN)",
        ],
        correctAnswer: 3,
      },
      {
        id: "q2",
        question: "What activation function outputs values between 0 and 1?",
        options: ["ReLU", "Sigmoid", "Tanh", "Leaky ReLU"],
        correctAnswer: 1,
      },
      {
        id: "q3",
        question: "What is backpropagation used for in neural networks?",
        options: [
          "To initialize weights",
          "To calculate the output of neurons",
          "To update weights based on error",
          "To normalize input data",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "2",
    title: "AI Ethics Mid-term",
    course: "AI Ethics",
    dueDate: "2025-05-24T23:59:00",
    timeLimit: 45,
    status: "not_started",
    questions: [
      {
        id: "q1",
        question: "Which of the following is a key concern in AI ethics?",
        options: ["Processing speed", "Algorithm bias", "Memory usage", "Programming language choice"],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "3",
    title: "Machine Learning Basics",
    course: "Introduction to Machine Learning",
    dueDate: "2025-05-20T12:00:00",
    timeLimit: 20,
    status: "completed",
    score: 85,
    questions: [],
  },
]

// Mock assignments data
export const mockAssignments = [
  {
    id: "1",
    title: "Neural Network Implementation",
    course: "Deep Learning",
    description: "Implement a simple neural network for image classification using TensorFlow or PyTorch.",
    dueDate: "2025-05-25T23:59:00",
    status: "not_started",
    resources: [
      { name: "Assignment Guidelines", type: "pdf", url: "#" },
      { name: "Dataset", type: "zip", url: "#" },
    ],
  },
  {
    id: "2",
    title: "Ethics Case Study Analysis",
    course: "AI Ethics",
    description: "Analyze the ethical implications of facial recognition technology in public spaces.",
    dueDate: "2025-05-23T23:59:00",
    status: "in_progress",
    resources: [
      { name: "Case Study Document", type: "pdf", url: "#" },
      { name: "Analysis Template", type: "docx", url: "#" },
    ],
  },
  {
    id: "3",
    title: "Final Project Proposal",
    course: "Introduction to Machine Learning",
    description:
      "Submit a proposal for your final project, including problem statement, methodology, and expected outcomes.",
    dueDate: "2025-05-30T23:59:00",
    status: "not_started",
    resources: [{ name: "Proposal Template", type: "pdf", url: "#" }],
  },
]

export const mockCommunityPosts = [
  {
    id: 1,
    author: {
      name: "Taizya Simunza",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      role: "Teacher",
    },
    content:
      "Just published a new course on Machine Learning Basics! Check it out and let me know if you have any questions.",
    likes: 24,
    comments: 8,
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    author: {
      name: "Narco",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
      role: "Student",
    },
    content: "The Neural Networks module was incredibly helpful! Thanks for the clear explanations, Professor Simunza.",
    likes: 45,
    comments: 12,
    timeAgo: "5 hours ago",
  },
]

// Helper function to get user from localStorage
export function getCurrentUser() {
  if (typeof window !== "undefined") {
    const storedEmail = localStorage.getItem("userEmail")
    const storedRole = localStorage.getItem("userRole")

    if (storedEmail) {
      // Find the user by email
      for (const key in mockUsers) {
        if (mockUsers[key as keyof typeof mockUsers].email === storedEmail) {
          return mockUsers[key as keyof typeof mockUsers]
        }
      }
    }

    // If we have a role but couldn't find the user by email
    if (storedRole) {
      if (storedRole === "teacher") return mockUsers.teacher
      if (storedRole === "admin") return mockUsers.admin
      return mockUsers.student
    }
  }

  return mockProfile // Default fallback
}

// Helper function to check if user is a teacher
export function isTeacher() {
  const currentUser = getCurrentUser()
  return currentUser.role === "teacher" || currentUser.role === "admin"
}

// Helper function to check if user is a student
export function isStudent() {
  const currentUser = getCurrentUser()
  return currentUser.role === "student"
}

class MockAuthService {
  async login(email: string, password: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check credentials against mock users
    let foundUser = null

    // Find the user by email
    for (const key in mockUsers) {
      if (mockUsers[key as keyof typeof mockUsers].email === email) {
        foundUser = mockUsers[key as keyof typeof mockUsers]
        break
      }
    }

    if (foundUser) {
      // In a real app, we would properly compare hashed passwords
      if (foundUser.password === password) {
        // Update the mockProfile to the logged-in user
        mockProfile = foundUser

        // Store user info in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("userEmail", email)
          localStorage.setItem("userRole", foundUser.role)

          // Set cookies for middleware
          document.cookie = `isAuthenticated=true; path=/; max-age=86400`
          document.cookie = `userRole=${foundUser.role}; path=/; max-age=86400`
          document.cookie = `userEmail=${email}; path=/; max-age=86400`
        }

        return { user: foundUser }
      }
    }

    throw new Error("Invalid credentials")
  }

  async register(email: string, password: string, fullName: string) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email && password && fullName) {
      const newUser = {
        id: String(Date.now()),
        email,
        full_name: fullName,
        role: "student" as const,
        avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        password: password, // In a real app, this would be hashed
      }
      return { user: newUser }
    }
    throw new Error("Registration failed")
  }

  async logout() {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Reset mockProfile to default
    mockProfile = mockUsers.student

    // Clear localStorage and cookies
    if (typeof window !== "undefined") {
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userRole")

      // Clear cookies
      document.cookie = "isAuthenticated=; path=/; max-age=0"
      document.cookie = "userRole=; path=/; max-age=0"
      document.cookie = "userEmail=; path=/; max-age=0"
    }

    return { success: true }
  }

  // Method to check if user is authenticated and get current user
  async getUser() {
    const currentUser = getCurrentUser()
    return { user: currentUser }
  }
}

export const mockAuth = new MockAuthService()

// Add this new mock data for admin dashboard charts at the end of the file

// Mock data for user growth chart
export const mockUserGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 145 },
  { month: "Mar", users: 162 },
  { month: "Apr", users: 190 },
  { month: "May", users: 210 },
  { month: "Jun", users: 252 },
  { month: "Jul", users: 265 },
  { month: "Aug", users: 280 },
  { month: "Sep", users: 310 },
  { month: "Oct", users: 325 },
  { month: "Nov", users: 340 },
  { month: "Dec", users: 375 },
]

// Mock data for user role distribution
export const mockUserRoleData = [
  { name: "Students", value: 320 },
  { name: "Teachers", value: 45 },
  { name: "Admins", value: 10 },
]

// Mock data for system activity
export const mockSystemActivityData = [
  { day: "Mon", logins: 145, apiCalls: 1250, downloads: 43 },
  { day: "Tue", logins: 132, apiCalls: 1100, downloads: 35 },
  { day: "Wed", logins: 156, apiCalls: 1380, downloads: 41 },
  { day: "Thu", logins: 165, apiCalls: 1420, downloads: 52 },
  { day: "Fri", logins: 142, apiCalls: 1050, downloads: 38 },
  { day: "Sat", logins: 85, apiCalls: 680, downloads: 21 },
  { day: "Sun", logins: 65, apiCalls: 520, downloads: 15 },
]

// Mock data for resource usage over time
export const mockResourceUsageData = [
  { time: "00:00", cpu: 32, memory: 65, storage: 58 },
  { time: "04:00", cpu: 25, memory: 62, storage: 58 },
  { time: "08:00", cpu: 45, memory: 72, storage: 59 },
  { time: "12:00", cpu: 65, memory: 82, storage: 60 },
  { time: "16:00", cpu: 72, memory: 85, storage: 61 },
  { time: "20:00", cpu: 55, memory: 78, storage: 62 },
  { time: "24:00", cpu: 38, memory: 70, storage: 62 },
]

// Mock data for geographic distribution
export const mockGeographicData = [
  { country: "United States", users: 145 },
  { country: "United Kingdom", users: 85 },
  { country: "Canada", users: 65 },
  { country: "Australia", users: 45 },
  { country: "Germany", users: 35 },
  { country: "France", users: 30 },
  { country: "Japan", users: 25 },
  { country: "Other", users: 120 },
]

// Mock data for login activity
export const mockLoginActivityData = [
  { day: "Mon", successful: 142, failed: 8 },
  { day: "Tue", successful: 130, failed: 12 },
  { day: "Wed", successful: 152, failed: 15 },
  { day: "Thu", successful: 160, failed: 10 },
  { day: "Fri", successful: 138, failed: 7 },
  { day: "Sat", successful: 82, failed: 5 },
  { day: "Sun", successful: 62, failed: 4 },
]

// Mock data for course engagement
export const mockCourseEngagementData = [
  { month: "Jan", created: 5, enrolled: 85 },
  { month: "Feb", created: 7, enrolled: 92 },
  { month: "Mar", created: 4, enrolled: 78 },
  { month: "Apr", created: 6, enrolled: 110 },
  { month: "May", created: 8, enrolled: 125 },
  { month: "Jun", created: 10, enrolled: 145 },
]
