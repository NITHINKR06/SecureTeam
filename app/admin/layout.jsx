"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { 
  Users, 
  MessageSquare, 
  Settings, 
  Shield, 
  BarChart3, 
  FileText,
  Menu,
  X,
  LogOut,
  Home,
  Database,
  Activity,
  Bell,
  Search,
  ChevronDown,
  UserCog,
  FolderOpen,
  Key,
  Globe
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // Check if user is admin
    const checkAdminAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          if (data.user?.role !== 'admin') {
            router.push('/login')
          } else {
            setUser(data.user)
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        router.push('/login')
      }
    }
    
    checkAdminAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }
    localStorage.removeItem("user")
    router.push("/login")
  }

  const menuItems = [
    { 
      title: "Dashboard", 
      icon: Home, 
      href: "/admin",
      badge: null 
    },
    { 
      title: "Users", 
      icon: Users, 
      href: "/admin/users",
      badge: "125" 
    },
    { 
      title: "Teams", 
      icon: FolderOpen, 
      href: "/admin/teams",
      badge: "12" 
    },
    { 
      title: "Channels", 
      icon: MessageSquare, 
      href: "/admin/channels",
      badge: "48" 
    },
    { 
      title: "Messages", 
      icon: FileText, 
      href: "/admin/messages",
      badge: "1.2k" 
    },
    { 
      title: "Analytics", 
      icon: BarChart3, 
      href: "/admin/analytics",
      badge: null 
    },
    { 
      title: "Security", 
      icon: Shield, 
      href: "/admin/security",
      badge: "3" 
    },
    { 
      title: "Database", 
      icon: Database, 
      href: "/admin/database",
      badge: null 
    },
    { 
      title: "API Keys", 
      icon: Key, 
      href: "/admin/api-keys",
      badge: null 
    },
    { 
      title: "Settings", 
      icon: Settings, 
      href: "/admin/settings",
      badge: null 
    }
  ]

  const isActive = (href) => pathname === href

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Django-style Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-600 dark:from-green-800 dark:to-green-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-white/20 rounded flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">SecureTeam Admin</h1>
                <p className="text-xs opacity-90">Django-style Administration</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-200" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/20 border-white/30 text-white placeholder:text-green-100 focus:bg-white/30 focus:border-white/50 w-64"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded hover:bg-green-600 dark:hover:bg-green-700 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            </button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-green-600 dark:hover:bg-green-700">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-green-500 text-white">
                      {user?.name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">{user?.name || 'Admin'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCog className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="mr-2 h-4 w-4" />
                  Activity Log
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  View Site
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-200" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/20 border-white/30 text-white placeholder:text-green-100 focus:bg-white/30 focus:border-white/50 w-full"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out
          mt-[73px] lg:mt-0 h-[calc(100vh-73px)] lg:h-screen overflow-y-auto
        `}>
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200
                    ${active 
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium shadow-sm' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${active ? 'text-green-600 dark:text-green-400' : ''}`} />
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge 
                      variant={active ? "default" : "secondary"}
                      className={active ? "bg-green-600 dark:bg-green-500" : ""}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Activity className="h-3 w-3" />
              <span>System Status: </span>
              <span className="text-green-600 dark:text-green-400 font-medium">Operational</span>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
