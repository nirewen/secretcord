import { useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  style?: React.CSSProperties
}

export function CardFace({ children, style }: Props) {
  const glowRef = useRef<HTMLDivElement>(null)
  const [bounds, setBounds] = useState({ x: 0, y: 0, width: 0, height: 0 })

  function rotateToMouse(e: MouseEvent) {
    const mouseX = e.clientX
    const mouseY = e.clientY
    const leftX = mouseX - bounds.x
    const topY = mouseY - bounds.y
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    }

    if (glowRef.current) {
      glowRef.current.style.backgroundImage = `
          radial-gradient(
              circle at
              ${center.x * 2 + bounds.width / 2}px
              ${center.y * 2 + bounds.height / 2}px,
              #ffffff55,
              #0000000f
          )
          `
    }
  }

  return (
    <div
      className='absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-[inherit]'
      style={{
        backfaceVisibility: 'hidden', // Hide the front face when flipped
        ...style,
      }}
      onMouseEnter={e => {
        if (glowRef.current) {
          setBounds(glowRef.current.getBoundingClientRect())
          document.addEventListener('mousemove', rotateToMouse)
        }
      }}
      onMouseLeave={() => {
        document.removeEventListener('mousemove', rotateToMouse)
      }}
    >
      {children}
      <div
        ref={glowRef}
        className='pointer-events-none absolute inset-0 rounded-[inherit]'
        style={{
          backgroundImage: 'radial-gradient(circle at 50% -20%, #ffffff22, #0000000f)',
        }}
      />
    </div>
  )
}
