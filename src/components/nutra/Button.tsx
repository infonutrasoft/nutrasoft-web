import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'
import { btnPrimary, btnSecondary } from './tokens'

type NutraButtonProps = {
  variant?: 'primary' | 'secondary'
  href?: string
  newTab?: boolean
  className?: string
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const NutraButton: React.FC<NutraButtonProps> = ({
  variant = 'primary',
  href,
  newTab,
  className,
  children,
  ...buttonProps
}) => {
  const classes = cn(variant === 'primary' ? btnPrimary : btnSecondary, className)

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
