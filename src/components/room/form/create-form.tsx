'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { MarkdownIcon } from '@/components/icons/MarkdownIcon'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export const createRoomSchema = z.object({
  notes: z.string(),
})

export type CreateRoomValues = z.infer<typeof createRoomSchema>

type Props = {
  onSubmit: (values: CreateRoomValues) => void
}

export function CreateRoomForm({ onSubmit }: Props) {
  const form = useForm({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      notes: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <DialogHeader>
          <DialogTitle>Create room</DialogTitle>
          <DialogDescription>Set the notes of the room and click create</DialogDescription>
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
          <Button type='submit'>Create</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
