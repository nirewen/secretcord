'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Room } from '@/app/actions'
import { MarkdownIcon } from '@/components/icons/MarkdownIcon'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export const updateRoomSchema = z.object({
  roomId: z.string(),
  notes: z.string(),
})

export type UpdateRoomValues = z.infer<typeof updateRoomSchema>

type Props = {
  room: Room
  onSubmit: (values: UpdateRoomValues) => void
}

export function UpdateRoomForm({ room, onSubmit }: Props) {
  const form = useForm({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      roomId: room.id,
      notes: room.notes,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <DialogHeader>
          <DialogTitle>Update room</DialogTitle>
          <DialogDescription>Edit notes of the room and click save</DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name='notes'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} rows={12} />
              </FormControl>
              <FormDescription>
                <MarkdownIcon className='mr-2 inline size-4' />
                This will be displayed to users entering the room
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type='submit'>Save</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
