"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Send, 
  Paperclip, 
  Smile, 
  Search, 
  Settings, 
  Plus, 
  Hash, 
  Lock, 
  Users, 
  ChevronDown,
  Menu,
  X,
  Bell,
  UserPlus,
  LogOut,
  Moon,
  Sun,
  Mic,
  Video,
  Phone,
  MoreVertical,
  Star,
  Pin,
  Archive,
  Trash2,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { EnhancedMessageItem as MessageItem } from "@/components/enhanced-message-item"
import { getChannels, getMessages, getDirectMessages, authenticateUser } from "@/lib/dummy-data"

export default function HomePage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [user, setUser] = useState(null)
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [selectedDM, setSelectedDM] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [channels, setChannels] = useState([])
  const [directMessages, setDirectMessages] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef(null)

  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    visibility: "private"
  })

  const [newChannel, setNewChannel] = useState({
    name: "",
    description: "",
    isPrivate: false
  })

  const [userSettings, setUserSettings] = useState({
    notifications: true,
    soundEnabled: true,
    darkMode: theme === "dark",
    compactMode: false,
    showAvatars: true
  })

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Check localStorage for user
          const storedUser = localStorage.getItem("user")
          if (storedUser) {
            setUser(JSON.parse(storedUser))
          } else {
            router.push("/login")
          }
        }
      } catch (error) {
        // Fallback to localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          router.push("/login")
        }
      }
    }

    checkAuth()
    
    // Load initial data
    const loadedChannels = getChannels()
    const loadedDMs = getDirectMessages()
    setChannels(loadedChannels)
    setDirectMessages(loadedDMs)
    
    // Select first channel by default
    if (loadedChannels.length > 0) {
      handleChannelSelect(loadedChannels[0])
    }
  }, [router])

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel)
    setSelectedDM(null)
    const channelMessages = getMessages(channel.id)
    setMessages(channelMessages)
  }

  const handleDMSelect = (dm) => {
    setSelectedDM(dm)
    setSelectedChannel(null)
    // Load DM messages (using channel messages as placeholder)
    const dmMessages = getMessages(1).map(msg => ({
      ...msg,
      user: dm
    }))
    setMessages(dmMessages)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: `msg-${Date.now()}`,
      user: user || { name: "You", avatarUrl: null },
      timestamp: new Date().toISOString(),
      bodyMarkdown: newMessage,
      reactions: []
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Logout error:", error)
    }
    localStorage.removeItem("user")
    router.push("/login")
  }

  const handleCreateTeam = () => {
    // In a real app, this would create a team in the backend
    console.log("Creating team:", newTeam)
    setIsCreateTeamOpen(false)
    setNewTeam({ name: "", description: "", visibility: "private" })
  }

  const handleCreateChannel = () => {
    const channel = {
      id: channels.length + 1,
      name: newChannel.name,
      description: newChannel.description,
      isPrivate: newChannel.isPrivate,
      memberCount: 1,
      isActive: false
    }
    setChannels([...channels, channel])
    setIsCreateChannelOpen(false)
    setNewChannel({ name: "", description: "", isPrivate: false })
    handleChannelSelect(channel)
  }

  const handleSaveSettings = () => {
    setTheme(userSettings.darkMode ? "dark" : "light")
    // Save other settings to backend/localStorage
    localStorage.setItem("userSettings", JSON.stringify(userSettings))
    setIsSettingsOpen(false)
  }

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredDMs = directMessages.filter(dm =>
    dm.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentChannelOrDM = selectedChannel || selectedDM

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border hover:bg-accent"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 fixed lg:relative z-40 w-64 h-full bg-card border-r
        transition-transform duration-300 ease-in-out flex flex-col
      `}>
        {/* Team Header */}
        <div className="p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="font-semibold">SecureTeam</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Team Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreateTeamOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Invite People
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Team Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Switch Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search channels and DMs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* Channels & DMs */}
        <ScrollArea className="flex-1">
          <div className="p-3">
            {/* Channels Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Channels
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => setIsCreateChannelOpen(true)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {filteredChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => handleChannelSelect(channel)}
                    className={`
                      w-full text-left px-2 py-1.5 rounded-md text-sm
                      hover:bg-accent transition-colors
                      ${selectedChannel?.id === channel.id ? 'bg-accent' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {channel.isPrivate ? (
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span>{channel.name}</span>
                      {channel.unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messages Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  Direct Messages
                </span>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                {filteredDMs.map((dm) => (
                  <button
                    key={dm.id}
                    onClick={() => handleDMSelect(dm)}
                    className={`
                      w-full text-left px-2 py-1.5 rounded-md text-sm
                      hover:bg-accent transition-colors
                      ${selectedDM?.id === dm.id ? 'bg-accent' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={dm.avatarUrl} />
                          <AvatarFallback className="text-xs">
                            {dm.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {dm.isOnline && (
                          <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-500 rounded-full border border-background" />
                        )}
                      </div>
                      <span className="truncate">{dm.name}</span>
                      {dm.unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                          {dm.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* User Footer */}
        <div className="p-3 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-xs text-muted-foreground">
                    {user?.role === 'admin' ? 'Admin' : 'Active'}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem onClick={() => router.push('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? (
                  <Sun className="mr-2 h-4 w-4" />
                ) : (
                  <Moon className="mr-2 h-4 w-4" />
                )}
                Toggle Theme
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Channel Header */}
        <header className="h-14 border-b px-4 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <h1 className="font-semibold text-lg">
              {currentChannelOrDM ? (
                <>
                  {selectedChannel && (
                    <>
                      {selectedChannel.isPrivate ? (
                        <Lock className="inline h-4 w-4 mr-1" />
                      ) : (
                        <Hash className="inline h-4 w-4 mr-1" />
                      )}
                      {selectedChannel.name}
                    </>
                  )}
                  {selectedDM && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedDM.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {selectedDM.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {selectedDM.name}
                    </div>
                  )}
                </>
              ) : (
                'Select a channel'
              )}
            </h1>
            {currentChannelOrDM && (
              <Badge variant="secondary" className="text-xs">
                {selectedChannel ? `${selectedChannel.memberCount} members` : 'Direct Message'}
              </Badge>
            )}
          </div>

          {currentChannelOrDM && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Pin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          )}
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          {currentChannelOrDM ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageItem
                  key={message.id}
                  {...message}
                  onReact={(emoji) => console.log('React:', emoji)}
                  onReply={() => console.log('Reply')}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a channel or direct message to start chatting
            </div>
          )}
        </ScrollArea>

        {/* Message Composer */}
        {currentChannelOrDM && (
          <form onSubmit={handleSendMessage} className="p-4 border-t bg-card">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message ${selectedChannel ? '#' + selectedChannel.name : selectedDM?.name}`}
                  className="min-h-[44px] max-h-32 resize-none pr-24"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        )}
      </main>

      {/* Create Team Dialog */}
      <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Teams are separate workspaces for different groups or projects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={newTeam.name}
                onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                placeholder="e.g., Marketing Team"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-description">Description</Label>
              <Textarea
                id="team-description"
                value={newTeam.description}
                onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                placeholder="What's this team about?"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={newTeam.visibility === 'private'}
                    onChange={(e) => setNewTeam({...newTeam, visibility: e.target.value})}
                    className="w-4 h-4"
                  />
                  <Lock className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-xs text-muted-foreground">Only invited members can join</div>
                  </div>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={newTeam.visibility === 'public'}
                    onChange={(e) => setNewTeam({...newTeam, visibility: e.target.value})}
                    className="w-4 h-4"
                  />
                  <Users className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-xs text-muted-foreground">Anyone in the organization can join</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam}>Create Team</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Channel Dialog */}
      <Dialog open={isCreateChannelOpen} onOpenChange={setIsCreateChannelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Channel</DialogTitle>
            <DialogDescription>
              Channels are where your team communicates. They're best when organized around a topic.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="channel-name">Channel Name</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="channel-name"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                  placeholder="e.g., project-alpha"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel-description">Description (optional)</Label>
              <Input
                id="channel-description"
                value={newChannel.description}
                onChange={(e) => setNewChannel({...newChannel, description: e.target.value})}
                placeholder="What's this channel about?"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="channel-private"
                checked={newChannel.isPrivate}
                onCheckedChange={(checked) => setNewChannel({...newChannel, isPrivate: checked})}
              />
              <Label htmlFor="channel-private" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Make private
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateChannelOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateChannel}>Create Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Customize your SecureTeam experience
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label>Profile</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <Switch
                  id="notifications"
                  checked={userSettings.notifications}
                  onCheckedChange={(checked) => setUserSettings({...userSettings, notifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sound">Sound Effects</Label>
                <Switch
                  id="sound"
                  checked={userSettings.soundEnabled}
                  onCheckedChange={(checked) => setUserSettings({...userSettings, soundEnabled: checked})}
                />
              </div>
            </TabsContent>
            <TabsContent value="appearance" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch
                  id="dark-mode"
                  checked={userSettings.darkMode}
                  onCheckedChange={(checked) => setUserSettings({...userSettings, darkMode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="compact">Compact Mode</Label>
                <Switch
                  id="compact"
                  checked={userSettings.compactMode}
                  onCheckedChange={(checked) => setUserSettings({...userSettings, compactMode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="avatars">Show Avatars</Label>
                <Switch
                  id="avatars"
                  checked={userSettings.showAvatars}
                  onCheckedChange={(checked) => setUserSettings({...userSettings, showAvatars: checked})}
                />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  )
}
