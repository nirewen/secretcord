import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import { useBoolean } from 'usehooks-ts'
import { CardFace } from './card-face'

export interface CardType {
  front: string
  back: string
}

type Props = {
  ref: React.RefObject<HTMLDivElement> | null
  className?: string
  front: React.ReactNode
  back?: React.ReactNode
  rotateY: string
  translateZ: string
  isShown?: boolean
}

export function Card({ ref, className, front, back, rotateY, translateZ, isShown }: Props) {
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const distance = Math.sqrt(center.x ** 2 + center.y ** 2)
  const hovering = useBoolean(false)
  const flipped = useBoolean(false)

  function rotateToMouse(e: MouseEvent) {
    const mouseX = e.clientX
    const mouseY = e.clientY
    const leftX = mouseX - bounds.x
    const topY = mouseY - bounds.y
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    }

    setCenter(center)
  }

  return (
    <div
      ref={ref}
      className='absolute transition-transform duration-300 ease-out hover:duration-150'
      style={{
        transform: `${rotateY} ${!isShown ? 'translateZ(0px) scale(0)' : translateZ} ${
          center && distance && hovering.value
            ? `rotate3d(
            ${center.y / 100},
            ${-center.x / 100},
            0,
            ${Math.log(distance) * 2}deg
          )`
            : ''
        }`,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={e => {
        if (ref) {
          hovering.setTrue()
          setBounds(ref.current!.getBoundingClientRect())
          ref.current?.addEventListener('mousemove', rotateToMouse)
        }
      }}
      onMouseLeave={() => {
        if (ref) {
          ref.current?.removeEventListener('mousemove', rotateToMouse)
          hovering.setFalse()
        }
      }}
      onClick={() => flipped.toggle()}
    >
      <motion.div
        className={cn('relative', className)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY: flipped.value ? 180 : 0,
        }}
        transition={{
          duration: 1,
          ease: 'easeOut',
          rotateY: {
            type: 'spring',
            stiffness: 400,
            damping: 40,
          },
        }}
      >
        {/* Front Face */}
        <CardFace>{front}</CardFace>

        {/* Back Face */}
        <CardFace style={{ transform: 'rotateY(180deg)' }}>{back}</CardFace>
      </motion.div>
    </div>
  )
}
