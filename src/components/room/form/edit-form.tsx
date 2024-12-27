'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useBoolean } from 'usehooks-ts'
import { z } from 'zod'

import { editEntry, Entry } from '@/app/actions'
import { MarkdownIcon } from '@/components/icons/MarkdownIcon'
import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { isActionError } from '@/lib/utils'

export const editEntrySchema = z.object({
  entryId: z.string().nonempty(),
  notes: z.string().nonempty({
    message: 'Notes are required',
  }),
})

export type EditEntryValues = z.infer<typeof editEntrySchema>

type Props = {
  state: ReturnType<typeof useBoolean>
  entry: Entry
}

export function EditEntryForm({ state, entry }: Props) {
  const form = useForm({
    resolver: zodResolver(editEntrySchema),
    defaultValues: {
      entryId: entry.id,
      notes: entry.notes,
    },
  })

  async function onSubmit(values: EditEntryValues) {
    const result = await editEntry(values)

    if (isActionError(result)) {
      return form.setError('notes', {
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
          <DialogTitle>Edit entry</DialogTitle>
          <DialogDescription>Edit the notes of the entry and click save</DialogDescription>
        </DialogHeader>
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
          <Button type='submit'>Save</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
