'use client'

import { DoorClosedIcon, DoorOpenIcon, EditIcon, Settings2Icon, XIcon } from 'lucide-react'

import { deleteRoom, Room, toggleRoom, updateRoom } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isActionError } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { useBoolean } from 'usehooks-ts'
import { z } from 'zod'
import { DeleteRoom } from './delete-room'
import { UpdateRoom } from './edit-room'
import { UpdateRoomForm } from './form/update-form'

export const updateRoomSchema = z.object({
  roomId: z.string(),
  notes: z.string(),
})

export type UpdateRoomValues = z.infer<typeof updateRoomSchema>

type Props = {
  room: Room
}

export function RoomOptions({ room }: Props) {
  const editState = useBoolean(false)
  const deleteState = useBoolean(false)

  const actions = {
    async toggleRoom() {
      const result = await toggleRoom(room.id)

      if (!result) {
        return
      }

      if (result.error) {
        toast.error(result.error)
      }
    },
    async updateRoom(values: UpdateRoomValues) {
      const result = await updateRoom(values)

      if (!result) {
        return
      }

      editState.setFalse()

      if (isActionError(result)) {
        return toast.error(result.error)
      }

      const room = result.data

      redirect(`/room/${room.id}`)
    },
    async deleteRoom() {
      const result = await deleteRoom(room.id)

      deleteState.setFalse()

      if (isActionError(result)) {
        return toast.error(result.error)
      }

      redirect('/')
    },
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size='icon' variant='secondary'>
            <Settings2Icon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end'>
          <DropdownMenuLabel>Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={actions.toggleRoom}>
              {room.closedAt ? <DoorClosedIcon /> : <DoorOpenIcon />}
              <span>{room.closedAt ? 'Open' : 'Close'} room</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editState.setTrue()}>
              <EditIcon />
              <span>Edit room</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => deleteState.setTrue()}>
              <XIcon />
              <span>Delete room</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateRoom state={editState}>
        <UpdateRoomForm room={room} onSubmit={actions.updateRoom} />
      </UpdateRoom>
      <DeleteRoom state={deleteState} onConfirm={actions.deleteRoom} />
    </>
  )
}
