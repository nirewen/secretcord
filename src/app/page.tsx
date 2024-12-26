import { For, Show } from 'react-flow-control'

import { RoomItem } from '@/components/room/room-item'

import { isActionError } from '@/lib/utils'
import { getAllRooms } from './actions'

export default async function Home() {
  const roomsResult = await getAllRooms()

  if (isActionError(roomsResult)) {
    return (
      <div className='window h-full w-full overflow-auto p-2 text-center'>
        <span>Log in to see joined rooms</span>
      </div>
    )
  }

  const rooms = roomsResult.data

  return (
    <div className='window h-full w-full overflow-auto p-2 text-center'>
      <Show when={rooms.length > 0} fallback={() => <span>No rooms found</span>}>
        <div className='flex flex-col gap-4'>
          <For each={rooms}>{room => <RoomItem key={room.id} room={room} />}</For>
        </div>
      </Show>
    </div>
  )
}
