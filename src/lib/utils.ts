import { Entry, Room } from '@/app/actions'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function userIsInRoom(room: Room, userId?: string) {
  return room.entries.some(entry => entry.userId === userId)
}

export function roomHasPickedEntries(room: Room) {
  return room.entries.some(entry => entry.pickedById !== null)
}

export function findPickedEntry(entries: Entry[], userId?: string) {
  if (!userId) {
    return null
  }

  return entries.find(entry => entry.pickedById === userId)
}

export type ActionError<E extends object = Record<string, unknown>> = {
  error: string
} & E
export type ServerActionResponse<T, E extends object = Record<string, unknown>> = ActionError<E> | T

export function isActionError(error: any): error is ActionError {
  return error && typeof error === 'object' && 'error' in error && error.error
}
