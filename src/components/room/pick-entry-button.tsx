'use client'

import { UserCircle2Icon } from 'lucide-react'
import { Show } from 'react-flow-control'
import { toast } from 'sonner'

import { pickEntry, Room } from '@/app/actions'
import { Session } from '@/lib/auth'
import { findPickedEntry, isActionError, userIsInRoom } from '@/lib/utils'

import { useBoolean } from 'usehooks-ts'
import { CardPickupIcon } from '../icons/CardPickupIcon'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { PickedEntry } from './picked-entry'

type Props = {
  session: Session
  room: Room
}

export function PickEntryButton({ session, room }: Props) {
  const open = useBoolean(false)
  const pickedEntry = findPickedEntry(room.entries, session?.user.id)

  async function action() {
    if (pickedEntry) {
      open.setTrue()

      return
    }

    const result = await pickEntry(room.id)

    if (isActionError(result)) {
      return toast.error(result.error)
    }

    open.setTrue()
  }

  if (!room.closedAt || !session || !userIsInRoom(room, session.user.id)) {
    return null
  }

  return (
    <Dialog open={open.value} onOpenChange={open.toggle}>
      <Button variant='default' onClick={action}>
        <Show when={!!pickedEntry}>
          <UserCircle2Icon /> View picked entry
        </Show>
        <Show when={!pickedEntry}>
          <CardPickupIcon /> Pick entry
        </Show>
      </Button>
      <Show when={!!pickedEntry}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>You picked...</DialogTitle>
          </DialogHeader>
          <PickedEntry pickedEntry={pickedEntry!} />
          <DialogDescription>
            Follow the instructions in the notes of the room
            <br />
            and this user's notes to give them their gift
          </DialogDescription>
        </DialogContent>
      </Show>
    </Dialog>
  )
}
