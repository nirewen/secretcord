'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import { createRoom } from '@/app/actions'
import { isActionError } from '@/lib/utils'
import { PlusIcon } from 'lucide-react'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'
import { useBoolean } from 'usehooks-ts'
import { z } from 'zod'
import { CreateRoomForm } from './form/create-form'

export const createRoomSchema = z.object({
  notes: z.string(),
})

export type CreateRoomValues = z.infer<typeof createRoomSchema>

export function CreateRoom() {
  const openState = useBoolean(false)

  async function onSubmit(values: CreateRoomValues) {
    const result = await createRoom(values)

    if (!result) {
      return
    }

    if (isActionError(result)) {
      return toast.error(result.error)
    }

    openState.setFalse()

    const room = result.data

    redirect(`/room/${room.id}`)
  }

  return (
    <Dialog open={openState.value} onOpenChange={openState.toggle}>
      <DialogTrigger asChild>
        <Button variant='secondary'>
          <PlusIcon /> Create room
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <CreateRoomForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  )
}
