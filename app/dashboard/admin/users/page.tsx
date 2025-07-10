"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Search, UserPlus, Trash2, Ban, CheckCircle, Filter } from "lucide-react"
import Link from "next/link"

export default function UsersPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [users] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "student",
      status: "active",
      joinDate: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "teacher",
      status: "suspended",
      joinDate: "2024-02-01",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "student",
      status: "active",
      joinDate: "2024-03-10",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    },
  ])

  const handleStatusChange = async (userId: string, newStatus: string) => {
    toast({
      title: "User status updated",
      description: `User status has been changed to ${newStatus}`,
    })
  }

  const handleDeleteUser = async (userId: string) => {
    toast({
      title: "User deleted",
      description: "User has been permanently deleted from the system",
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage and monitor system users</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/users/create">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
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
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => {
                        toast({
                          title: "Role updated",
                          description: `User role has been changed to ${value}`,
                        })
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {user.status === "active" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Ban className="h-4 w-4 text-red-500" />
                      )}
                      <span className={user.status === "active" ? "text-green-500" : "text-red-500"}>
                        {user.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(user.id, user.status === "active" ? "suspended" : "active")}
                      >
                        {user.status === "active" ? "Suspend" : "Activate"}
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>
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
