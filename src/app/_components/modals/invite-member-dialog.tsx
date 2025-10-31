'use client'

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { UserPlus, Loader2, Mail } from 'lucide-react'

interface InviteMemberDialogProps {
  householdId: string
  userId: string | undefined
  onMemberInvited: () => void
}

export function InviteMemberDialog({ householdId, userId, onMemberInvited }: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // try {
    //   const response = await fetch(`/api/households/${householdId}/invite`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'x-user-id': userId,
    //     },
    //     body: JSON.stringify({ email, name }),
    //   })

    //   const data = await response.json()

    //   if (response.ok) {
    //     onMemberInvited()
    //     setOpen(false)
    //     setEmail('')
    //     setName('')
    //   } else {
    //     console.error('Invite member failed:', data.error)
    //   }
    // } catch (error) {
    //   console.error('Invite member error:', error)
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Invite New Member
          </DialogTitle>
          <DialogDescription>
            Send an email invitation to add a new member to your household.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}