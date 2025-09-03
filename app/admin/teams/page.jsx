"use client"

import { useState } from "react"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  MoreVertical,
  Search,
  Building,
  UserPlus,
  Settings,
  Shield,
  Globe,
  Lock,
  Unlock,
  Hash,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([
    {
      id: 1,
      name: "Engineering",
      description: "Product development and technical infrastructure",
      members: 48,
      channels: 12,
      owner: "John Doe",
      visibility: "private",
      created: "2024-01-15",
      storage: 2.4,
      maxStorage: 10,
      active: true
    },
    {
      id: 2,
      name: "Marketing",
      description: "Brand management and growth strategies",
      members: 24,
      channels: 8,
      owner: "Sarah Chen",
      visibility: "public",
      created: "2024-01-10",
      storage: 1.2,
      maxStorage: 5,
      active: true
    },
    {
      id: 3,
      name: "Design",
      description: "UI/UX and creative design team",
      members: 18,
      channels: 6,
      owner: "Emma Davis",
      visibility: "private",
      created: "2023-12-20",
      storage: 3.8,
      maxStorage: 5,
      active: true
    },
    {
      id: 4,
      name: "Product",
      description: "Product management and strategy",
      members: 15,
      channels: 5,
      owner: "Mike Wilson",
      visibility: "public",
      created: "2023-11-15",
      storage: 0.8,
      maxStorage: 5,
      active: false
    }
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)

  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    owner: "",
    visibility: "private",
    maxStorage: 5
  })

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateTeam = () => {
    const team = {
      id: teams.length + 1,
      ...newTeam,
      members: 1,
      channels: 0,
      created: new Date().toISOString().split('T')[0],
      storage: 0,
      active: true
    }
    setTeams([team, ...teams])
    setIsCreateTeamOpen(false)
    setNewTeam({
      name: "",
      description: "",
      owner: "",
      visibility: "private",
      maxStorage: 5
    })
  }

  const handleDeleteTeam = (teamId) => {
    setTeams(teams.filter(t => t.id !== teamId))
  }

  const handleToggleTeamStatus = (teamId) => {
    setTeams(teams.map(t => 
      t.id === teamId ? { ...t, active: !t.active } : t
    ))
  }

  const getVisibilityBadge = (visibility) => {
    if (visibility === 'public') {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <Globe className="h-3 w-3 mr-1" />
          Public
        </Badge>
      )
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">
        <Lock className="h-3 w-3 mr-1" />
        Private
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teams Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage teams, channels, and team settings
          </p>
        </div>
        
        <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>
                Set up a new team workspace with channels and members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                  placeholder="e.g., Engineering"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({...newTeam, description: e.target.value})}
                  placeholder="Brief description of the team's purpose..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-owner">Team Owner</Label>
                <Input
                  id="team-owner"
                  value={newTeam.owner}
                  onChange={(e) => setNewTeam({...newTeam, owner: e.target.value})}
                  placeholder="Select team owner..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-visibility">Visibility</Label>
                <Select 
                  value={newTeam.visibility} 
                  onValueChange={(value) => setNewTeam({...newTeam, visibility: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Public - Anyone can join
                      </div>
                    </SelectItem>
                    <SelectItem value="private">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Private - Invite only
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-storage">Storage Limit (GB)</Label>
                <Input
                  id="team-storage"
                  type="number"
                  value={newTeam.maxStorage}
                  onChange={(e) => setNewTeam({...newTeam, maxStorage: parseInt(e.target.value)})}
                  min="1"
                  max="100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTeamOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam} className="bg-green-600 hover:bg-green-700">
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Across all departments
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.filter(t => t.active).length}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Currently operational
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((sum, t) => sum + t.members, 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Across all teams
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Channels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teams.reduce((sum, t) => sum + t.channels, 0)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Communication channels
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className={`relative ${!team.active ? 'opacity-60' : ''}`}>
            {!team.active && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              </div>
            )}
            
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {team.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getVisibilityBadge(team.visibility)}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedTeam(team)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Members
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleToggleTeamStatus(team.id)}>
                      {team.active ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <CardDescription className="mt-2">
                {team.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </div>
                  <div className="font-semibold mt-1">{team.members}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Hash className="h-4 w-4" />
                    <span>Channels</span>
                  </div>
                  <div className="font-semibold mt-1">{team.channels}</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Storage Used</span>
                  <span className="font-medium">{team.storage}GB / {team.maxStorage}GB</span>
                </div>
                <Progress value={(team.storage / team.maxStorage) * 100} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {team.owner.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {team.owner}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  Created {team.created}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Settings Dialog */}
      {selectedTeam && (
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Team Settings - {selectedTeam.name}</DialogTitle>
              <DialogDescription>
                Configure team settings, permissions, and preferences.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">General Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Team Name</Label>
                    <Input defaultValue={selectedTeam.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Team Owner</Label>
                    <Input defaultValue={selectedTeam.owner} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea defaultValue={selectedTeam.description} rows={3} />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Privacy & Access</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Team Visibility</Label>
                    <p className="text-sm text-gray-500">
                      Control who can discover and join this team
                    </p>
                  </div>
                  <Select defaultValue={selectedTeam.visibility}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Guest Access</Label>
                    <p className="text-sm text-gray-500">
                      Allow external users to join as guests
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Resource Limits</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Storage Limit (GB)</Label>
                    <Input type="number" defaultValue={selectedTeam.maxStorage} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Channels</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTeam(null)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
