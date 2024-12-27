import { Entry } from '@/app/actions'
import { Edit3Icon } from 'lucide-react'
import { useBoolean } from 'usehooks-ts'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import { EditEntryForm } from './form/edit-form'

type Props = {
  entry: Entry
}

export function EditEntry({ entry }: Props) {
  const open = useBoolean()

  return (
    <Dialog open={open.value} onOpenChange={open.toggle}>
      <DialogTrigger asChild>
        <Button className='flex-1' variant='default'>
          <Edit3Icon /> Edit entry
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <EditEntryForm state={open} entry={entry} />
      </DialogContent>
    </Dialog>
  )
}
