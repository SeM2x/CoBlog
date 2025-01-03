import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface User {
  id: string
  name: string
  avatar: string
}

interface InviteCollaboratorsModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (collaborators: User[]) => void
  existingCollaborators: User[]
}

const mockUsers: User[] = [
  { id: '1', name: 'Alice Johnson', avatar: '/avatars/alice-johnson.jpg' },
  { id: '2', name: 'Bob Smith', avatar: '/avatars/bob-smith.jpg' },
  { id: '3', name: 'Charlie Brown', avatar: '/avatars/charlie-brown.jpg' },
  { id: '4', name: 'Diana Prince', avatar: '/avatars/diana-prince.jpg' },
  { id: '5', name: 'Ethan Hunt', avatar: '/avatars/ethan-hunt.jpg' },
  { id: '6', name: 'Fiona Gallagher', avatar: '/avatars/fiona-gallagher.jpg' },
  { id: '7', name: 'George Lucas', avatar: '/avatars/george-lucas.jpg' },
  { id: '8', name: 'Hannah Montana', avatar: '/avatars/hannah-montana.jpg' },
]

export default function InviteModal({ isOpen, onClose, onInvite, existingCollaborators }: InviteCollaboratorsModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [availableUsers, setAvailableUsers] = useState<User[]>([])

  useEffect(() => {
    setAvailableUsers(mockUsers.filter(user => !existingCollaborators.some(c => c.id === user.id)))
  }, [existingCollaborators])

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUserSelect = (user: User) => {
    if (selectedUsers.some(u => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleInvite = () => {
    onInvite(selectedUsers)
    setSelectedUsers([])
    setSearchQuery('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Collaborators</DialogTitle>
          <DialogDescription>
            Search and select users to invite as collaborators for your blog post.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ScrollArea className="h-[300px] border rounded-md p-2">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={`user-${user.id}`}
                  checked={selectedUsers.some(u => u.id === user.id)}
                  onCheckedChange={() => handleUserSelect(user)}
                />
                <Label htmlFor={`user-${user.id}`} className="flex items-center space-x-2 cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span>{user.name}</span>
                </Label>
              </div>
            ))}
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button onClick={handleInvite} disabled={selectedUsers.length === 0}>
            Invite Selected ({selectedUsers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

