"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { PlayCircle, Edit, Trash2, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"

export default function LecturesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [lectures] = useState([
    {
      id: "1",
      title: "Introduction to Machine Learning",
      course: "AI Fundamentals",
      duration: "45 mins",
      instructor: "Dr. Sarah Chen",
      date: "2024-03-30",
    },
    {
      id: "2",
      title: "Neural Networks Basics",
      course: "Deep Learning",
      duration: "60 mins",
      instructor: "Prof. David Kumar",
      date: "2024-03-29",
    },
    {
      id: "3",
      title: "Ethics in AI",
      course: "AI Ethics",
      duration: "50 mins",
      instructor: "Dr. Maria Rodriguez",
      date: "2024-03-28",
    },
  ])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lectures</h1>
          <p className="text-muted-foreground">Manage and organize your course lectures</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/lectures/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Lecture
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search lectures..."
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

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lectures.map((lecture) => (
                <TableRow key={lecture.id}>
                  <TableCell className="font-medium">{lecture.title}</TableCell>
                  <TableCell>{lecture.course}</TableCell>
                  <TableCell>{lecture.duration}</TableCell>
                  <TableCell>{lecture.instructor}</TableCell>
                  <TableCell>{lecture.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost">
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
