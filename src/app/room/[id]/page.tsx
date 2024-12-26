import { Users2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { For, Show } from 'react-flow-control'

import { fetchRoom, getSession } from '@/app/actions'
import { JoinRoom } from '@/components/room/join-room'
import { Notes } from '@/components/room/notes'
import { PickEntryButton } from '@/components/room/pick-entry-button'
import { RoomOptions } from '@/components/room/room-options'
import { User } from '@/components/user'
import { isActionError } from '@/lib/utils'

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const roomResult = await fetchRoom(id)

  if (isActionError(roomResult)) {
    notFound()
  }

  const room = roomResult.data

  if (!room) {
    notFound()
  }

  const sessionResult = await getSession()
  const session = isActionError(sessionResult) ? null : sessionResult.data

  return (
    <div className='window flex h-full w-full flex-col gap-2 overflow-hidden p-2'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <span className='rounded-lg bg-neutral-800 px-2 py-1 font-mono text-2xl'>{room.id}</span>
          <User user={room.creator} />
        </div>
        <div className='flex items-center gap-2'>
          <Show when={session?.user.id === room.creatorId}>
            <RoomOptions room={room} />
          </Show>
        </div>
      </div>
      <Show when={!!room.notes}>
        <Notes className='max-h-48' markdown={room.notes} />
      </Show>
      <div className='grid grid-cols-[1fr_4fr] gap-2'>
        <div className='flex items-center justify-center gap-2 rounded-md bg-neutral-800'>
          <Users2Icon className='size-4' />
          {room.entries.length}
        </div>
        <JoinRoom session={session!} room={room} />
        <Show when={session !== null}>
          <PickEntryButton session={session!} room={room} />
        </Show>
      </div>
      <div className='grid grid-cols-2 gap-2 overflow-auto rounded-md'>
        <For each={room.entries}>{entry => <User key={entry.id} user={entry.user} />}</For>
      </div>
    </div>
  )
}
