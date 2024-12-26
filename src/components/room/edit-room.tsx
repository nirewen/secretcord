import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useBoolean } from 'usehooks-ts'

type Props = {
  state: ReturnType<typeof useBoolean>
  children: React.ReactNode
}

export function UpdateRoom({ state, children }: Props) {
  return (
    <Dialog open={state.value} onOpenChange={state.toggle}>
      <DialogContent className='sm:max-w-[425px]'>{children}</DialogContent>
    </Dialog>
  )
}
