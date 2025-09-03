"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow } from "date-fns"
import { useMemo, useState } from "react"
import { 
  MoreHorizontal, 
  Reply, 
  Edit2, 
  Trash2, 
  Pin, 
  Bookmark,
  MessageSquare,
  Clock,
  Check,
  CheckCheck
} from "lucide-react"

export function EnhancedMessageItem({
  id,
  userName,
  userAvatar,
  userRole,
  timestamp,
  content,
  reactions = [],
  threadCount = 0,
  lastReplyTime,
  isEdited = false,
  isPinned = false,
  isBookmarked = false,
  messageStatus = "sent",
  className,
  onReact,
  onReply,
  onEdit,
  onDelete,
  onPin,
  onBookmark
}) {
  const [hovered, setHovered] = useState(false)
  const [showReactions, setShowReactions] = useState(false)
  
  const dateIso = useMemo(() => {
    try {
      return new Date(timestamp).toISOString()
    } catch {
      return new Date().toISOString()
    }
  }, [timestamp])
  
  const dateUi = useMemo(() => {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true })
      } else {
        return format(date, "MMM d, h:mm a")
      }
    } catch {
      return "just now"
    }
  }, [timestamp])

  const quickReactions = ["👍", "❤️", "😂", "🎉", "🤔", "👀", "🚀", "💯"]

  const getStatusIcon = () => {
    switch (messageStatus) {
      case "sending":
        return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />
      case "sent":
        return <Check className="h-3 w-3 text-muted-foreground" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "group relative grid grid-cols-[48px_1fr] gap-3 px-4 py-2",
        "hover:bg-muted/30 rounded-lg transition-all duration-200",
        isPinned && "bg-primary/5 border-l-2 border-primary",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setShowReactions(false)
      }}
      role="listitem"
      aria-label={`Message from ${userName}`}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm hover-lift">
          <AvatarImage src={`/placeholder-user.jpg`} alt={userName} />
          <AvatarFallback className="bg-gradient-brand text-white font-medium">
            {userAvatar || (userName && userName.split(' ').map(n => n[0]).join('').toUpperCase()) || 'U'}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
      </div>

      {/* Message Content */}
      <div className="min-w-0 space-y-1">
        {/* Header */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-foreground hover:underline cursor-pointer">
            {userName}
          </span>
          {userRole && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {userRole}
            </Badge>
          )}
          <time className="text-xs text-muted-foreground" dateTime={dateIso}>
            {dateUi}
          </time>
          {isEdited && (
            <span className="text-xs text-muted-foreground italic">(edited)</span>
          )}
          {isPinned && (
            <Pin className="h-3 w-3 text-primary fill-primary" />
          )}
          {getStatusIcon()}

          {/* Action Buttons - Show on Hover */}
          <div className={cn(
            "ml-auto flex items-center gap-1 transition-opacity",
            hovered ? "opacity-100" : "opacity-0"
          )}>
            {/* Quick Reactions */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setShowReactions(!showReactions)}
              >
                😊
              </Button>
              {showReactions && (
                <div className="absolute top-8 right-0 z-50 flex gap-1 p-2 bg-popover rounded-lg shadow-lg border animate-in">
                  {quickReactions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onReact && onReact(emoji)
                        setShowReactions(false)
                      }}
                      className="hover:scale-125 transition-transform p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onReply && onReply()}
            >
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit && onEdit()}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPin && onPin()}>
                  <Pin className="mr-2 h-4 w-4" />
                  {isPinned ? "Unpin" : "Pin"} Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBookmark && onBookmark()}>
                  <Bookmark className="mr-2 h-4 w-4" />
                  {isBookmarked ? "Remove Bookmark" : "Bookmark"}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete && onDelete()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Message Body */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {content}
          </p>
        </div>

        {/* Reactions */}
        {reactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2" role="group" aria-label="Reactions">
            {reactions.map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => onReact && onReact(reaction.emoji)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                  "border transition-all hover-lift",
                  reaction.reactedByMe 
                    ? "bg-primary/10 border-primary text-primary" 
                    : "bg-muted/50 border-border hover:bg-muted"
                )}
                aria-pressed={!!reaction.reactedByMe}
                aria-label={`React with ${reaction.emoji}`}
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="font-medium">{reaction.count}</span>
                {reaction.users && reaction.users.length > 0 && (
                  <span className="sr-only">
                    Reacted by: {reaction.users.join(", ")}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-dashed border-border hover:bg-muted transition-colors"
              aria-label="Add reaction"
            >
              <span>+</span>
            </button>
          </div>
        )}

        {/* Thread Indicator */}
        {threadCount > 0 && (
          <button
            onClick={() => onReply && onReply()}
            className="flex items-center gap-2 mt-2 text-xs text-primary hover:underline"
          >
            <MessageSquare className="h-3 w-3" />
            <span>{threadCount} {threadCount === 1 ? "reply" : "replies"}</span>
            {lastReplyTime && (
              <span className="text-muted-foreground">
                Last reply {lastReplyTime}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
