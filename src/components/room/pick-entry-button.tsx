'use client'

import { UserCircle2Icon } from 'lucide-react'
import { Show } from 'react-flow-control'
import { toast } from 'sonner'

import { pickEntry, Room } from '@/app/actions'
import { Session } from '@/lib/auth'
import { findPickedEntry, isActionError, userIsInRoom } from '@/lib/utils'

import { startTransition, useRef } from 'react'
import { useBoolean, useOnClickOutside } from 'usehooks-ts'
import { Card } from '../card/card'
import { RevolvingCards } from '../card/revolving-card'
import { CardPickupIcon } from '../icons/CardPickupIcon'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Notes } from './notes'

type Props = {
  session: Session
  room: Room
}

export function PickEntryButton({ session, room }: Props) {
  const open = useBoolean(false)
  const firstPick = useBoolean(true)
  const pickedEntry = findPickedEntry(room.entries, session?.user.id)
  const cardsRef = useRef(null as unknown as HTMLDivElement)
  const showNotes = useBoolean(false)

  useOnClickOutside(cardsRef, handleClickOutside)

  function handleClickOutside() {
    startTransition(() => {
      open.setFalse()
    })
  }

  async function action() {
    if (pickedEntry) {
      firstPick.setFalse()
      open.setTrue()

      return
    }

    const result = await pickEntry(room.id)

    if (isActionError(result)) {
      return toast.error(result.error)
    }

    open.setTrue()
  }

  if (!room.closedAt || !session || !userIsInRoom(room, session.user.id)) {
    return null
  }

  return (
    <>
      <Button variant='default' onClick={action}>
        <Show when={!!pickedEntry}>
          <UserCircle2Icon /> View picked entry
        </Show>
        <Show when={!pickedEntry}>
          <CardPickupIcon /> Pick entry
        </Show>
      </Button>
      <Show when={open.value && !!pickedEntry}>
        <RevolvingCards
          stopNumber={room.entries.findIndex(e => e.id === pickedEntry?.id)}
          totalCards={room.entries.length}
          shouldRevolve={firstPick.value}
          onRevolvingComplete={() => showNotes.setTrue()}
        >
          {radius =>
            room.entries.map((card, index) => {
              const angle = (index / room.entries.length) * 360
              const rotateY = `rotateY(${angle}deg)`
              const translateZ = `translateZ(${radius}px)`

              return (
                <Card
                  className='window h-64 w-52'
                  key={index}
                  ref={cardsRef}
                  front={
                    <div className='flex h-full w-full flex-col p-4'>
                      <span>Your pick is</span>
                      <div className='flex h-full flex-col items-center justify-center gap-2'>
                        <Avatar className='size-20'>
                          <AvatarImage src={card.user.image!} />
                        </Avatar>
                        <span>{card.user.name}</span>
                      </div>
                      <small className='text-[10px] opacity-80'>Click to flip card and see notes</small>
                    </div>
                  }
                  back={
                    <div className='flex h-full w-full flex-col items-center justify-center'>
                      <Show when={showNotes.value && card.id === pickedEntry?.id}>
                        <div className='flex flex-col items-center p-2'>
                          <span>Notes</span>
                          <small className='text-[10px] opacity-80'>These are notes on how to give your gift</small>
                        </div>
                        <Notes className='w-full border-none bg-transparent' markdown={card.notes} />
                      </Show>
                    </div>
                  }
                  rotateY={rotateY}
                  translateZ={translateZ}
                />
              )
            })
          }
        </RevolvingCards>
      </Show>
    </>
  )
}
