"use client"

import * as React from "react"
import {
  Hash,
  Star,
  Bell,
  Pin,
  Users,
  Search,
  Info,
  Phone,
  Video,
  MoreVertical,
  Settings,
  BellOff,
  UserPlus,
  Archive,
  Trash2,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle.jsx"

export function ChannelHeader({
  channelName = "general",
  channelDescription = "Company-wide announcements and work-based matters",
  memberCount = 42,
  isStarred = false,
  isMuted = false,
  onSearch,
  onShowMembers,
  onShowPins,
  onShowInfo,
  className
}) {
  const [starred, setStarred] = React.useState(isStarred)
  const [muted, setMuted] = React.useState(isMuted)

  return (
    <TooltipProvider>
      <header className={cn(
        "flex h-14 items-center justify-between border-b border-border/50 bg-background/95 px-4",
        "backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "dark:bg-background/50 dark:backdrop-blur-xl",
        className
      )}>
        {/* Channel Info */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-base font-semibold">{channelName}</h1>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6 hover:bg-transparent",
                    starred && "text-yellow-500"
                  )}
                  onClick={() => setStarred(!starred)}
                >
                  <Star className={cn("h-4 w-4", starred && "fill-current")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {starred ? "Remove from starred" : "Add to starred"}
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator orientation="vertical" className="h-4" />

          <div className="hidden items-center gap-4 text-sm text-muted-foreground md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                  onClick={onShowMembers}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>{memberCount}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>View members</TooltipContent>
            </Tooltip>

            <span className="hidden lg:block truncate max-w-md">
              {channelDescription}
            </span>
          </div>
        </div>

        {/* Channel Actions */}
        <div className="flex items-center gap-1">
          {/* Call Actions - Desktop Only */}
          <div className="hidden md:flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start voice call</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start video call</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="mx-1 h-4" />
          </div>

          {/* Main Actions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onShowPins}
              >
                <Pin className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pinned messages</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onShowMembers}
              >
                <Users className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Show member list</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 relative"
              >
                {muted ? (
                  <BellOff className="h-4 w-4" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                {!muted && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {muted ? "Unmute channel" : "Mute channel"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Search in channel</TooltipContent>
          </Tooltip>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={onShowInfo}>
                <Info className="mr-2 h-4 w-4" />
                Channel details
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem
                checked={starred}
                onCheckedChange={setStarred}
              >
                <Star className="mr-2 h-4 w-4" />
                Starred
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={muted}
                onCheckedChange={setMuted}
              >
                {muted ? (
                  <>
                    <Bell className="mr-2 h-4 w-4" />
                    Unmute channel
                  </>
                ) : (
                  <>
                    <BellOff className="mr-2 h-4 w-4" />
                    Mute channel
                  </>
                )}
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                Add people
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Channel settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive channel
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Leave channel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}
