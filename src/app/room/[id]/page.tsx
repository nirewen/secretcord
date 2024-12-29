import { Users2Icon } from 'lucide-react'
import { notFound } from 'next/navigation'
import { For, Show } from 'react-flow-control'

import { fetchRoom, getSession } from '@/app/actions'
import { RefreshCache } from '@/components/refresh-cache'
import { JoinRoom } from '@/components/room/join-room'
import { Notes } from '@/components/room/notes'
import { PickEntryButton } from '@/components/room/pick-entry-button'
import { RoomOptions } from '@/components/room/room-options'
import { User } from '@/components/user'
import { isActionError } from '@/lib/utils'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const roomResult = await fetchRoom(id)

  if (isActionError(roomResult)) {
    return {
      title: 'SecretCord',
      description: 'The room you are looking for does not exist.',
    }
  }

  const room = roomResult.data

  return {
    title: `SecretCord - Room ${room.id}`,
    description: `Room ${room.id} created by @${room.creator.name}\n\nThere are ${room.entries.length} users in this room.`,
  }
}

export default async function RoomPage({ params }: Props) {
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

  async function checkRoomUpdate() {
    'use server'

    const checkRoomResult = await fetchRoom(id)

    if (isActionError(checkRoomResult)) {
      return
    }

    const checkRoom = checkRoomResult.data

    if (!checkRoom) {
      return
    }

    const didChange = JSON.stringify(checkRoom) !== JSON.stringify(room)

    if (didChange) {
      revalidatePath(`/room/${id}`)
    }
  }

  return (
    <div className='window flex h-full w-full flex-col gap-2 overflow-hidden p-2'>
      <RefreshCache check={checkRoomUpdate} />
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
      <div className='grid grid-cols-[1fr_2fr_2fr] gap-2'>
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
