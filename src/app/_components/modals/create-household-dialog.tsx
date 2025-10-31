'use client'

import { useState } from 'react'
import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Label } from '@/app/_components/ui/label'
import { Textarea } from '@/app/_components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'

interface CreateHouseholdDialogProps {
  onHouseholdCreated: (household: any) => void
  userId: string | undefined
}

export function CreateHouseholdDialog({ onHouseholdCreated, userId }: CreateHouseholdDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // try {
    //   const response = await fetch('/api/households', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'x-user-id': userId,
    //     },
    //     body: JSON.stringify({ name, description }),
    //   })

    //   const data = await response.json()

    //   if (response.ok) {
    //     onHouseholdCreated(data.household)
    //     setOpen(false)
    //     setName('')
    //     setDescription('')
    //   } else {
    //     console.error('Create household failed:', data.error)
    //   }
    // } catch (error) {
    //   console.error('Create household error:', error)
    // } finally {
    //   setLoading(false)
    // }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Household
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Household</DialogTitle>
          <DialogDescription>
            Create a new household to share lists, tasks, and events with family members.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Household Name</Label>
            <Input
              id="name"
              placeholder="e.g., Smith Family, Apartment 4B"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your household"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
                  Creating...
                </>
              ) : (
                'Create Household'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}