'use server'

import { CreateRoomValues } from '@/components/room/create-room'
import { EditEntryValues } from '@/components/room/form/edit-form'
import { JoinRoomValues } from '@/components/room/form/join-form'
import { UpdateRoomValues } from '@/components/room/room-options'
import { auth } from '@/lib/auth'
import { findPickedEntry, isActionError, userIsInRoom } from '@/lib/utils'
import { prisma } from '@/prisma'
import type { Prisma } from '@prisma/client'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

export type Room = Prisma.RoomGetPayload<{
  include: {
    creator: true
    entries: {
      include: {
        user: true
      }
    }
  }
}>

export type Entry = Prisma.EntryGetPayload<{
  include: {
    user: true
  }
}>

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return { error: 'User not authenticated' }
  }

  return { data: session }
}

export async function getAllRooms() {
  const sessionResult = await getSession()

  if (isActionError(sessionResult)) {
    return sessionResult
  }

  const session = sessionResult.data

  const rooms = await prisma.room.findMany({
    where: {
      OR: [
        {
          creatorId: session.user.id,
        },
        {
          entries: {
            some: {
              userId: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      creator: true,
      entries: true,
    },
  })

  return { data: rooms }
}

export async function fetchRoom(roomId: string) {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      creator: true,
      entries: {
        include: {
          user: true,
        },
      },
    },
  })

  if (!room) {
    return { error: 'Room not found' }
  }

  return { data: room }
}

export async function toggleRoom(roomId: string) {
  const result = await fetchRoom(roomId)

  if (result.error) {
    return result
  }

  const room = result.data!

  // if (roomHasPickedEntries(room) && room.closedAt !== null) {
  //   return { error: 'Cannot open room with picked entries' }
  // }

  await prisma.room.update({
    where: {
      id: room.id,
    },
    data: {
      closedAt: room.closedAt === null ? new Date() : null,
    },
  })

  revalidatePath(`/room/${room.id}`)
}

export async function createRoom(values: CreateRoomValues) {
  const result = await getSession()

  if (result.error) {
    return result
  }

  const session = result.data!

  const room = await prisma.room.create({
    data: {
      id: nanoid(6),
      creatorId: session.user.id,
      notes: values.notes,
    },
  })

  return { data: room }
}

export async function updateRoom(values: UpdateRoomValues) {
  const result = await getSession()

  if (result.error) {
    return result
  }

  const session = result.data!

  const room = await prisma.room.update({
    where: {
      id: values.roomId,
    },
    data: {
      notes: values.notes,
    },
  })

  return { data: room }
}

export async function deleteRoom(roomId: string) {
  const roomResult = await fetchRoom(roomId)

  if (roomResult.error) {
    return roomResult
  }

  const sessionResult = await getSession()

  if (sessionResult.error) {
    return sessionResult
  }

  const room = roomResult.data!
  const session = sessionResult.data!

  if (room.creatorId !== session.user.id) {
    return { error: 'User is not the room creator' }
  }

  await prisma.room.delete({
    where: {
      id: room.id,
    },
  })

  revalidatePath('/')
}

export async function joinRoom(values: JoinRoomValues) {
  const result = await getSession()

  if (result.error) {
    return result
  }

  const session = result.data!

  const entry = await prisma.entry.findFirst({
    where: {
      userId: session.user.id,
      roomId: values.roomId,
    },
  })

  if (entry) {
    return { error: 'User already in room' }
  }

  await prisma.entry.create({
    data: {
      userId: session.user.id,
      roomId: values.roomId,
      notes: values.notes,
    },
  })

  revalidatePath(`/room/${values.roomId}`)
}

export async function editEntry(values: EditEntryValues) {
  const result = await getSession()

  if (result.error) {
    return result
  }

  const session = result.data!

  const entry = await prisma.entry.findFirst({
    where: {
      id: values.entryId,
    },
  })

  if (!entry) {
    return { error: 'User is not in the room' }
  }

  await prisma.entry.update({
    where: { id: values.entryId },
    data: {
      notes: values.notes,
    },
  })

  revalidatePath(`/room/${entry.roomId}`)
}

export async function leaveRoom(roomId: string) {
  const roomResult = await fetchRoom(roomId)

  if (roomResult.error) {
    return roomResult
  }

  const sessionResult = await getSession()

  if (sessionResult.error) {
    return sessionResult
  }

  const room = roomResult.data!
  const session = sessionResult.data!

  if (room.closedAt) {
    return { error: 'Room is closed' }
  }

  await prisma.entry.deleteMany({
    where: {
      userId: session.user.id,
      roomId,
    },
  })

  const pickedEntry = findPickedEntry(room.entries, session.user.id)

  if (pickedEntry) {
    await prisma.entry.update({
      where: {
        id: pickedEntry.id,
      },
      data: {
        pickedById: null,
      },
    })
  }

  revalidatePath(`/room/${roomId}`)
}

export async function pickEntry(roomId: string) {
  const roomResult = await fetchRoom(roomId)

  if (roomResult.error) {
    return roomResult
  }

  const sessionResult = await getSession()

  if (sessionResult.error) {
    return sessionResult
  }

  const room = roomResult.data!
  const session = sessionResult.data!

  if (!userIsInRoom(room, session.user.id)) {
    return { error: 'User is not in room' }
  }

  const validEntries = room.entries.filter(entry => entry.userId !== session.user.id)
  const alreadyPicked = findPickedEntry(validEntries, session.user.id)

  if (alreadyPicked) {
    return alreadyPicked
  }

  const pickedEntry = validEntries.at(Math.floor(Math.random() * validEntries.length))

  if (!pickedEntry) {
    return { error: 'No entries to pick from' }
  }

  await prisma.entry.update({
    where: {
      id: pickedEntry.id,
    },
    data: {
      pickedById: session.user.id,
    },
  })

  revalidatePath(`/room/${roomId}`)

  return { data: pickedEntry }
}

export async function removeEntry(roomId: string, entryId: string) {
  const roomResult = await fetchRoom(roomId)

  if (roomResult.error) {
    return roomResult
  }

  const sessionResult = await getSession()

  if (sessionResult.error) {
    return sessionResult
  }

  const room = roomResult.data!
  const session = sessionResult.data!

  if (room.closedAt) {
    return { error: 'Room is closed' }
  }

  if (room.creatorId !== session.user.id) {
    return { error: 'User is not the room creator' }
  }

  await prisma.entry.delete({
    where: {
      id: entryId,
    },
  })

  revalidatePath(`/room/${roomId}`)
}
