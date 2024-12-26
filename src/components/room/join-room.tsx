'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '../ui/textarea'

import { joinRoom, leaveRoom } from '@/app/actions'
import type { Session } from '@/lib/auth'
import { isActionError, userIsInRoom } from '@/lib/utils'
import type { Prisma } from '@prisma/client'
import { LogInIcon, LogOutIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { MarkdownIcon } from '../icons/MarkdownIcon'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

export const joinRoomSchema = z.object({
  roomId: z.string().nonempty(),
  notes: z.string().nonempty({
    message: 'Notes are required',
  }),
})

export type JoinRoomValues = z.infer<typeof joinRoomSchema>

type Room = Prisma.RoomGetPayload<{
  include: {
    creator: true
    entries: {
      include: {
        user: true
      }
    }
  }
}>

type Props = {
  session: Session | null
  room: Room
}

export function JoinRoom({ session, room }: Props) {
  const [open, setOpen] = useState(false)
  const form = useForm({
    resolver: zodResolver(joinRoomSchema),
    defaultValues: {
      roomId: room.id,
      notes: '',
    },
  })

  async function onSubmit(values: JoinRoomValues) {
    const result = await joinRoom(values)

    if (isActionError(result)) {
      return form.setError('roomId', {
        type: 'manual',
        message: result.error,
      })
    }

    form.reset()

    setOpen(false)
  }

  async function onLeave() {
    const result = await leaveRoom(room.id)

    if (isActionError(result)) {
      return toast.error(result.error)
    }
  }

  if (room.closedAt) {
    if (!userIsInRoom(room, session?.user.id)) {
      return (
        <Button variant='default' disabled>
          <LogInIcon /> Join room
        </Button>
      )
    } else {
      return null
    }
  }

  if (room.entries.find(entry => entry.userId === session?.user.id)) {
    return (
      <Button variant='destructive' onClick={onLeave}>
        <LogOutIcon /> Leave room
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' disabled={!session}>
          <LogInIcon /> Join room
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <DialogHeader>
              <DialogTitle>Join room</DialogTitle>
              <DialogDescription>Add notes to the entry and click create</DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name='roomId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room ID</FormLabel>
                  <FormControl>
                    <Input {...field} value={room.id} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='notes'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={8} />
                  </FormControl>
                  <FormDescription className='flex gap-2'>
                    <MarkdownIcon className='size-4' />
                    <span>
                      This will only be displayed to the user who picked you
                      <br />
                      Give them instructions on how to give you your gift and your preferences
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Join</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
