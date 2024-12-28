import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useBoolean } from 'usehooks-ts'
import { z } from 'zod'

import { joinRoom, Room } from '@/app/actions'
import { MarkdownIcon } from '@/components/icons/MarkdownIcon'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { isActionError } from '@/lib/utils'

export const joinRoomSchema = z.object({
  roomId: z.string().nonempty(),
  notes: z.string().nonempty({
    message: 'Notes are required',
  }),
})

export type JoinRoomValues = z.infer<typeof joinRoomSchema>

type Props = {
  state: ReturnType<typeof useBoolean>
  room: Room
}

export function JoinForm({ state, room }: Props) {
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

    state.setFalse()
  }
  return (
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
  )
}
