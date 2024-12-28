import type { Prisma } from '@prisma/client'
import { ChevronRightIcon, Users2Icon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { User } from '../user'

type Room = Prisma.RoomGetPayload<{
  include: {
    creator: true
    entries: true
  }
}>

type Props = {
  room: Room
}

export function RoomItem({ room }: Props) {
  return (
    <Link href={`/room/${room.id}`}>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <span className='rounded-lg bg-neutral-800 px-2 py-1 font-mono text-2xl'>{room.id}</span>
          <span className='flex items-center gap-2 rounded-lg bg-neutral-800 px-2 py-1'>
            <Users2Icon className='size-4' />
            {room.entries.length}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <User user={room.creator} />
          <Button variant='secondary' size='icon'>
            <ChevronRightIcon />
          </Button>
        </div>
      </div>
    </Link>
  )
}
