'use client'

import { useEffect } from 'react'
import { useBoolean, useInterval } from 'usehooks-ts'

export function RefreshCache({ check }: { check: () => Promise<void> }) {
  const shouldRun = useBoolean(typeof document !== 'undefined' && document.hasFocus())

  useEffect(() => {
    const onFocus = () => {
      check()
      shouldRun.setTrue()
    }
    const onBlur = () => {
      shouldRun.setFalse()
    }

    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
    }
  })

  useInterval(check, shouldRun.value ? 1000 : null)

  return null
}
