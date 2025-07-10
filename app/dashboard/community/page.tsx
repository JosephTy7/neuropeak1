"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Users, MessageSquare, Heart, Share2, Search, Filter } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { mockCommunityPosts } from "@/lib/mock-data"

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState(mockCommunityPosts)
  const [searchQuery, setSearchQuery] = useState("")

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim()) return

    const newPostObj = {
      id: posts.length + 1,
      author: {
        name: "You",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        role: "Student",
      },
      content: newPost,
      likes: 0,
      comments: 0,
      timeAgo: "Just now",
    }

    setPosts([newPostObj, ...posts])
    setNewPost("")
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-muted-foreground">Connect with fellow learners and share your journey</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search discussions..."
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

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <form onSubmit={handlePost}>
              <Textarea
                placeholder="Share your thoughts or ask a question..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="mb-4"
              />
              <div className="flex justify-end">
                <Button type="submit">Post</Button>
              </div>
            </form>
          </Card>

          {posts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{post.author.name}</h3>
                    <span className="text-sm text-muted-foreground">{post.author.role}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{post.timeAgo}</p>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Community Stats</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-bold">1,234</p>
                <p className="text-sm text-muted-foreground">Active Learners</p>
              </div>
              <div>
                <p className="text-2xl font-bold">56</p>
                <p className="text-sm text-muted-foreground">Online Now</p>
              </div>
              <div>
                <p className="text-2xl font-bold">789</p>
                <p className="text-sm text-muted-foreground">Posts This Week</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Popular Topics</h3>
            <div className="space-y-2">
              {["Machine Learning", "Neural Networks", "Data Science", "Python", "AI Ethics"].map((topic) => (
                <Button key={topic} variant="outline" className="w-full justify-start">
                  #{topic.toLowerCase().replace(" ", "")}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
