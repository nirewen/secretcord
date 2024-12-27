'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { Prisma } from '@prisma/client'
import { LogInIcon, LogOutIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useBoolean } from 'usehooks-ts'

import { leaveRoom } from '@/app/actions'
import type { Session } from '@/lib/auth'
import { isActionError, userIsInRoom } from '@/lib/utils'

import { EditEntry } from './edit-entry'
import { JoinForm } from './form/join-form'

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
  const open = useBoolean()
  const userEntry = room.entries.find(entry => entry.userId === session?.user.id)

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

  if (userEntry) {
    return (
      <div className='flex gap-2'>
        <EditEntry entry={userEntry} />
        <Button variant='destructive' onClick={onLeave}>
          <LogOutIcon /> Leave
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open.value} onOpenChange={open.toggle}>
      <DialogTrigger asChild>
        <Button variant='default' disabled={!session}>
          <LogInIcon /> Join room
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <JoinForm state={open} room={room} />
      </DialogContent>
    </Dialog>
  )
}
