'use client'

import { ArrowUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="กลับไปด้านบน"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed right-[17.6px] bottom-[17.6px] z-40 flex h-11 w-11 items-center justify-center rounded-full bg-moss-500 text-white shadow-[0_3px_10px_rgba(46,43,37,.16)] transition-[transform,box-shadow,opacity] duration-[180ms] hover:-translate-y-0.5 hover:bg-moss-600 hover:shadow-[0_12px_32px_rgba(46,43,37,.22)]',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <ArrowUp size={20} strokeWidth={2.75} />
    </button>
  )
}
