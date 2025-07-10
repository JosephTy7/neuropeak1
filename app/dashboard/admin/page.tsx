"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Users,
  Settings,
  Shield,
  Database,
  FileText,
  AlertCircle,
  TrendingUp,
  Activity,
  Globe,
  Lock,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  mockUsers,
  mockUserGrowthData,
  mockUserRoleData,
  mockSystemActivityData,
  mockResourceUsageData,
  mockGeographicData,
  mockLoginActivityData,
  mockCourseEngagementData,
} from "@/lib/mock-data"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  const [systemStats] = useState({
    totalUsers: Object.keys(mockUsers).length,
    systemHealth: "Optimal",
    activeUsers: 145,
    totalCourses: 28,
    totalQuizzes: 56,
    totalAssignments: 42,
  })

  const [systemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 82,
    storageUsage: 65,
    networkHealth: 98,
    diskIOPS: 1250,
    bandwidthUsage: 72,
  })

  const [recentActions] = useState([
    {
      type: "User",
      action: "Account suspended",
      user: "john.doe@example.com",
      time: "2 hours ago",
    },
    {
      type: "System",
      action: "Backup completed",
      user: "system",
      time: "4 hours ago",
    },
    {
      type: "Security",
      action: "API key rotated",
      user: "admin@neuropeak.com",
      time: "5 hours ago",
    },
  ])

  const [securityAlerts] = useState([
    {
      type: "Critical",
      message: "Multiple failed login attempts detected",
      time: "2 hours ago",
    },
    {
      type: "Warning",
      message: "Unusual system access pattern detected",
      time: "5 hours ago",
    },
    {
      type: "Info",
      message: "System backup scheduled",
      time: "1 day ago",
    },
  ])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Administration</h1>
          <p className="text-muted-foreground">Monitor and manage system performance</p>
        </div>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/dashboard/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              System Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">System Status</p>
              <h3 className="text-2xl font-bold">{systemStats.systemHealth}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Database className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Storage Usage</p>
              <h3 className="text-2xl font-bold">{systemMetrics.storageUsage}%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{systemStats.totalUsers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Activity className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <h3 className="text-2xl font-bold">{systemStats.activeUsers}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* User Growth Chart */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Growth</h2>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                users: { color: "#8884d8" },
              }}
            >
              <AreaChart data={mockUserGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ChartContainer>
          </div>
        </Card>

        {/* User Role Distribution */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Role Distribution</h2>
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                Students: { color: "#0088FE" },
                Teachers: { color: "#00C49F" },
                Admins: { color: "#FFBB28" },
              }}
            >
              <PieChart>
                <Pie
                  data={mockUserRoleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mockUserRoleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* System Activity and Resource Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">System Activity (Last 7 Days)</h2>
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                logins: { color: "#8884d8" },
                apiCalls: { color: "#82ca9d" },
                downloads: { color: "#ffc658" },
              }}
            >
              <LineChart data={mockSystemActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="logins" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line yAxisId="left" type="monotone" dataKey="downloads" stroke="#ffc658" />
                <Line yAxisId="right" type="monotone" dataKey="apiCalls" stroke="#82ca9d" />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Resource Usage (24 Hours)</h2>
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                cpu: { color: "#8884d8" },
                memory: { color: "#82ca9d" },
                storage: { color: "#ffc658" },
              }}
            >
              <LineChart data={mockResourceUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="memory" stroke="#82ca9d" />
                <Line type="monotone" dataKey="storage" stroke="#ffc658" />
              </LineChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* Geographic Distribution and Login Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Geographic Distribution</h2>
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                users: { color: "#8884d8" },
              }}
            >
              <BarChart data={mockGeographicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="country" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Login Activity (Last 7 Days)</h2>
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                successful: { color: "#82ca9d" },
                failed: { color: "#ff8042" },
              }}
            >
              <BarChart data={mockLoginActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="successful" stackId="a" fill="#82ca9d" />
                <Bar dataKey="failed" stackId="a" fill="#ff8042" />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
      </div>

      {/* Course Engagement and System Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Course Engagement</h2>
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div className="h-80">
            <ChartContainer
              config={{
                created: { color: "#8884d8" },
                enrolled: { color: "#82ca9d" },
              }}
            >
              <BarChart data={mockCourseEngagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="created" fill="#8884d8" />
                <Bar dataKey="enrolled" fill="#82ca9d" />
              </BarChart>
            </ChartContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">System Performance</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.cpuUsage}%</span>
              </div>
              <Progress value={systemMetrics.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.memoryUsage}%</span>
              </div>
              <Progress value={systemMetrics.memoryUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.storageUsage}%</span>
              </div>
              <Progress value={systemMetrics.storageUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Network Health</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.networkHealth}%</span>
              </div>
              <Progress value={systemMetrics.networkHealth} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Disk IOPS</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.diskIOPS}</span>
              </div>
              <Progress value={systemMetrics.diskIOPS / 20} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Bandwidth Usage</span>
                <span className="text-sm text-muted-foreground">{systemMetrics.bandwidthUsage}%</span>
              </div>
              <Progress value={systemMetrics.bandwidthUsage} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* Security and Maintenance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Security Alerts</h2>
          <div className="space-y-4">
            {securityAlerts.map((alert, i) => (
              <div key={i} className="flex items-center space-x-4">
                <AlertCircle
                  className={`h-5 w-5 ${
                    alert.type === "Critical"
                      ? "text-red-500"
                      : alert.type === "Warning"
                        ? "text-yellow-500"
                        : "text-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{alert.type}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <span className="text-sm text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Actions</h2>
          <div className="space-y-4">
            {recentActions.map((action, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {action.type === "User" ? (
                    <Users className="h-5 w-5 text-primary" />
                  ) : action.type === "Security" ? (
                    <Shield className="h-5 w-5 text-primary" />
                  ) : (
                    <Settings className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium">{action.action}</p>
                    <p className="text-sm text-muted-foreground">by {action.user}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{action.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Maintenance */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">System Maintenance</h2>
        <Tabs defaultValue="scheduled">
          <TabsList className="mb-4">
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="scheduled">
            <div className="space-y-4">
              {[
                {
                  title: "Database Backup",
                  description: "Full system backup",
                  time: "Today at 23:00",
                  icon: Database,
                },
                {
                  title: "User Data Cleanup",
                  description: "Remove inactive accounts",
                  time: "Tomorrow at 02:00",
                  icon: Users,
                },
                {
                  title: "Security Patches",
                  description: "Apply latest security updates",
                  time: "May 25 at 01:00",
                  icon: Shield,
                },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <task.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block">{task.time}</span>
                    <span className="text-sm px-2 py-1 rounded bg-yellow-100 text-yellow-800">Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inProgress">
            <div className="space-y-4">
              {[
                {
                  title: "Security Audit",
                  description: "Comprehensive system security review",
                  time: "Completes in 2 hours",
                  icon: Shield,
                },
                {
                  title: "Database Optimization",
                  description: "Performance tuning",
                  time: "Completes in 45 minutes",
                  icon: Database,
                },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <task.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block">{task.time}</span>
                    <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">In Progress</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="space-y-4">
              {[
                {
                  title: "Log Rotation",
                  description: "System logs archived",
                  time: "4 hours ago",
                  icon: FileText,
                },
                {
                  title: "Cache Clearing",
                  description: "System cache refreshed",
                  time: "Yesterday at 15:30",
                  icon: Settings,
                },
                {
                  title: "Weekly Backup",
                  description: "Full system backup completed",
                  time: "May 19 at 23:15",
                  icon: Database,
                },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <task.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block">{task.time}</span>
                    <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">Completed</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
