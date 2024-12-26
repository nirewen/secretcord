import { Entry } from '@/app/actions'
import { Label } from '../ui/label'
import { User } from '../user'
import { Notes } from './notes'

export function PickedEntry({ pickedEntry }: { pickedEntry: Entry }) {
  return (
    <div className='flex flex-col gap-2'>
      <User user={pickedEntry.user} />
      <Label>Notes</Label>
      <Notes markdown={pickedEntry.notes} />
    </div>
  )
}
