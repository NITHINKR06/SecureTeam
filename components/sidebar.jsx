"use client"

import * as React from "react"
import { 
  ChevronDown, 
  Hash, 
  Lock, 
  Plus, 
  Search, 
  Settings, 
  Users, 
  Volume2,
  MessageSquare,
  Bell,
  Star,
  MoreVertical,
  Circle,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

const categories = [
  {
    id: "1",
    name: "General",
    expanded: true,
    channels: [
      { id: "1", name: "general", type: "public", unread: 3, active: true },
      { id: "2", name: "announcements", type: "public" },
      { id: "3", name: "introductions", type: "public", unread: 12 },
    ]
  },
  {
    id: "2",
    name: "Teams",
    expanded: true,
    channels: [
      { id: "4", name: "engineering", type: "public", unread: 5 },
      { id: "5", name: "design", type: "public" },
      { id: "6", name: "product", type: "private", members: 8 },
      { id: "7", name: "marketing", type: "public", unread: 2 },
    ]
  },
  {
    id: "3",
    name: "Voice Channels",
    expanded: false,
    channels: [
      { id: "8", name: "Meeting Room 1", type: "voice", members: 3 },
      { id: "9", name: "Meeting Room 2", type: "voice" },
      { id: "10", name: "Casual", type: "voice", members: 5 },
    ]
  }
]

const directMessages = [
  { id: "1", name: "Alice Cooper", status: "online", avatar: "/placeholder-user.jpg", unread: 2 },
  { id: "2", name: "Bob Wilson", status: "busy", avatar: "/placeholder-user.jpg" },
  { id: "3", name: "Carol White", status: "offline", avatar: "/placeholder-user.jpg" },
  { id: "4", name: "David Brown", status: "online", avatar: "/placeholder-user.jpg", unread: 1 },
]

export function Sidebar({ className }) {
  const [expandedCategories, setExpandedCategories] = React.useState(["1", "2"])
  const [showDMs, setShowDMs] = React.useState(true)

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "busy": return "bg-yellow-500"
      case "offline": return "bg-gray-400"
      default: return "bg-gray-400"
    }
  }

  return (
    <aside className={cn(
      "flex h-full w-64 flex-col border-r border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "dark:bg-background/50 dark:backdrop-blur-xl",
      className
    )}>
      {/* Workspace Header */}
      <div className="flex h-14 items-center justify-between border-b border-border/50 px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-auto w-full justify-start p-0 hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-white">
                  <span className="text-sm font-bold">ST</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">SecureTeam</span>
                  <span className="text-xs text-muted-foreground">Pro Workspace</span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Workspace Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Invite People
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              Create Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-muted/50 hover:bg-muted"
        >
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search</span>
        </Button>
      </div>

      {/* Channels */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-4 pb-4">
          {categories.map((category) => (
            <Collapsible
              key={category.id}
              open={expandedCategories.includes(category.id)}
              onOpenChange={() => toggleCategory(category.id)}
            >
              <CollapsibleTrigger asChild>
                <div
                  className="h-7 w-full flex items-center justify-between p-0 px-1 hover:bg-transparent cursor-pointer"
                >
                  <div className="flex items-center gap-1">
                    <ChevronRight className={cn(
                      "h-3 w-3 transition-transform",
                      expandedCategories.includes(category.id) && "rotate-90"
                    )} />
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      {category.name}
                    </span>
                  </div>
                  <div
                    className="h-5 w-5 flex items-center justify-center hover:bg-muted rounded"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Add new channel logic
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-0.5">
                {category.channels.map((channel) => (
                  <Button
                    key={channel.id}
                    variant="ghost"
                    className={cn(
                      "h-8 w-full justify-start gap-2 px-2 font-normal",
                      channel.active && "bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {channel.type === "public" && <Hash className="h-4 w-4 text-muted-foreground" />}
                      {channel.type === "private" && <Lock className="h-3 w-3 text-muted-foreground" />}
                      {channel.type === "voice" && <Volume2 className="h-4 w-4 text-muted-foreground" />}
                      <span className="text-sm">{channel.name}</span>
                    </div>
                    {channel.unread && (
                      <Badge 
                        variant="default" 
                        className="ml-auto h-5 min-w-[20px] rounded-full bg-destructive px-1.5 text-[10px]"
                      >
                        {channel.unread}
                      </Badge>
                    )}
                    {channel.type === "voice" && channel.members && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {channel.members} <Users className="inline h-3 w-3" />
                      </span>
                    )}
                  </Button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}

          {/* Direct Messages */}
          <Collapsible open={showDMs} onOpenChange={setShowDMs}>
            <CollapsibleTrigger asChild>
              <div
                className="h-7 w-full flex items-center justify-between p-0 px-1 hover:bg-transparent cursor-pointer"
              >
                <div className="flex items-center gap-1">
                  <ChevronRight className={cn(
                    "h-3 w-3 transition-transform",
                    showDMs && "rotate-90"
                  )} />
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Direct Messages
                  </span>
                </div>
                <div
                  className="h-5 w-5 flex items-center justify-center hover:bg-muted rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add new DM logic
                  }}
                >
                  <Plus className="h-3 w-3" />
                </div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1 space-y-0.5">
              {directMessages.map((dm) => (
                <Button
                  key={dm.id}
                  variant="ghost"
                  className="h-8 w-full justify-start gap-2 px-2 font-normal"
                >
                  <div className="relative">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={dm.avatar} />
                      <AvatarFallback className="text-[10px]">
                        {dm.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background",
                      getStatusColor(dm.status)
                    )} />
                  </div>
                  <span className="text-sm">{dm.name}</span>
                  {dm.unread && (
                    <Badge 
                      variant="default" 
                      className="ml-auto h-5 min-w-[20px] rounded-full bg-destructive px-1.5 text-[10px]"
                    >
                      {dm.unread}
                    </Badge>
                  )}
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* User Footer */}
      <div className="border-t border-border/50 p-2">
        <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-muted/50">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>YU</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium">Your Name</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-green-500 text-green-500" />
                Online
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-yellow-500 text-yellow-500" />
                Away
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Circle className="mr-2 h-3 w-3 fill-red-500 text-red-500" />
                Do Not Disturb
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
