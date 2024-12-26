import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { Show } from 'react-flow-control'

import { LoggedInUser } from './logged-in-user'
import { CreateRoom } from './room/create-room'
import { Button } from './ui/button'

import { getSession } from '@/app/actions'
import { isActionError } from '@/lib/utils'

export async function Navbar() {
  const session = await getSession()

  return (
    <div className='window flex w-full items-center justify-between gap-2 p-2'>
      <div className='flex items-center gap-2'>
        <Link href='/'>
          <Button variant='ghost' size='icon'>
            <HomeIcon />
          </Button>
        </Link>
        <Show when={!isActionError(session)}>
          <CreateRoom />
        </Show>
      </div>
      <div className='flex items-center gap-2'>
        <LoggedInUser />
      </div>
    </div>
  )
}
