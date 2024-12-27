'use client'

import { motion } from 'motion/react'
import React from 'react'

type CardPayload = {
  rotateY: string
  translateZ: string
}

interface RevolvingCardsProps {
  radius?: number
  stopNumber: number
  totalCards: number
  shouldRevolve?: boolean
  onRevolvingComplete?: () => void
  children: (radius: number) => React.ReactNode
}

export function RevolvingCards({
  radius,
  stopNumber,
  totalCards,
  shouldRevolve,
  onRevolvingComplete,
  children,
}: RevolvingCardsProps) {
  radius ??= Math.max(window.innerWidth / 4, 300) // Radius of the carousel
  const revolvingDuration = shouldRevolve ? 4 : 0 // Total duration for the revolving animation
  const minimumRotations = 2
  const anglePerCard = 360 / totalCards
  const targetRotation = minimumRotations * 360 + stopNumber * anglePerCard

  return (
    <motion.div
      className='perspective-1000 absolute inset-0 z-10 overflow-hidden'
      style={{
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
      }}
    >
      <div
        className='absolute inset-0 h-full w-full bg-black bg-opacity-60 backdrop-blur-sm'
        style={{
          transformStyle: 'preserve-3d',
          transform: 'translateZ(-200px) scale(2)',
        }}
      />
      <motion.div
        className='relative flex h-screen w-screen items-center justify-center'
        style={{
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
        }}
        animate={{
          rotateY: [minimumRotations * 360, -targetRotation],
        }}
        onAnimationComplete={onRevolvingComplete}
        transition={{
          rotateY: {
            duration: revolvingDuration,
            ease: 'easeOut',
          },
        }}
      >
        {children(radius)}
      </motion.div>
    </motion.div>
  )
}
