import React from 'react'

import { cn } from '@/utilities/ui'
import { tagVariants } from './tokens'

type TagProps = {
  variant?: keyof typeof tagVariants
  className?: string
  children: React.ReactNode
}

export const Tag: React.FC<TagProps> = ({ variant = 'outline', className, children }) => (
  <span className={cn(tagVariants[variant], className)}>{children}</span>
)
