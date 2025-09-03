"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  Server,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart,
  PieChart,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  RefreshCw
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalTeams: 48,
    totalMessages: 124500,
    serverStatus: 'operational',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38
  })

  const [timeRange, setTimeRange] = useState('7d')
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      // Update stats with new random values for demo
      setStats(prev => ({
        ...prev,
        activeUsers: Math.floor(Math.random() * 200) + 800,
        cpuUsage: Math.floor(Math.random() * 30) + 40,
        memoryUsage: Math.floor(Math.random() * 20) + 50,
      }))
    }, 1000)
  }

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new team', time: '2 minutes ago', type: 'success' },
    { id: 2, user: 'Sarah Chen', action: 'Deleted channel #old-project', time: '15 minutes ago', type: 'warning' },
    { id: 3, user: 'Mike Wilson', action: 'Updated user permissions', time: '1 hour ago', type: 'info' },
    { id: 4, user: 'Emma Davis', action: 'Exported message logs', time: '2 hours ago', type: 'info' },
    { id: 5, user: 'System', action: 'Automated backup completed', time: '3 hours ago', type: 'success' },
  ]

  const topChannels = [
    { name: '#general', messages: 3420, members: 125, growth: 12 },
    { name: '#engineering', messages: 2890, members: 48, growth: -5 },
    { name: '#product', messages: 2100, members: 32, growth: 18 },
    { name: '#design', messages: 1560, members: 24, growth: 8 },
    { name: '#marketing', messages: 1230, members: 18, growth: 22 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">8% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Teams
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeams}</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDown className="h-3 w-3 text-red-500" />
              <span className="text-xs text-red-500">2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Messages
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.totalMessages / 1000).toFixed(1)}k</div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-500">25% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>System Status</CardTitle>
            <Badge variant={stats.serverStatus === 'operational' ? 'default' : 'destructive'} 
                   className={stats.serverStatus === 'operational' ? 'bg-green-500' : ''}>
              <CheckCircle className="h-3 w-3 mr-1" />
              {stats.serverStatus === 'operational' ? 'Operational' : 'Issues Detected'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">CPU Usage</span>
                <span className="font-medium">{stats.cpuUsage}%</span>
              </div>
              <Progress value={stats.cpuUsage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Memory Usage</span>
                <span className="font-medium">{stats.memoryUsage}%</span>
              </div>
              <Progress value={stats.memoryUsage} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Disk Usage</span>
                <span className="font-medium">{stats.diskUsage}%</span>
              </div>
              <Progress value={stats.diskUsage} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest actions performed in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`
                    h-2 w-2 rounded-full mt-1.5
                    ${activity.type === 'success' ? 'bg-green-500' : ''}
                    ${activity.type === 'warning' ? 'bg-yellow-500' : ''}
                    ${activity.type === 'info' ? 'bg-blue-500' : ''}
                  `} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {activity.action}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Top Channels</CardTitle>
            <CardDescription>Most active channels by message count</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Messages</TableHead>
                  <TableHead className="text-right">Members</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topChannels.map((channel) => (
                  <TableRow key={channel.name}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell className="text-right">{channel.messages.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{channel.members}</TableCell>
                    <TableCell className="text-right">
                      <span className={`
                        inline-flex items-center gap-1 text-xs font-medium
                        ${channel.growth > 0 ? 'text-green-600' : 'text-red-600'}
                      `}>
                        {channel.growth > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                        {Math.abs(channel.growth)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Create Channel
            </Button>
            <Button variant="outline" className="justify-start">
              <Server className="h-4 w-4 mr-2" />
              Backup Data
            </Button>
            <Button variant="outline" className="justify-start">
              <AlertCircle className="h-4 w-4 mr-2" />
              View Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
