import { ImageIcon } from 'lucide-react'
import React from 'react'

import { cn } from '@/utilities/ui'

type ImagePlaceholderProps = {
  aspect?: '4/3' | '1/1' | '16/9'
  /** Fill the parent's height instead of using a fixed aspect ratio (for stretched flex rows). */
  fill?: boolean
  label?: string
  zoomOnHover?: boolean
  className?: string
  children?: React.ReactNode
}

const aspectClass = {
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
} as const

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  aspect = '4/3',
  fill,
  label,
  zoomOnHover,
  className,
  children,
}) => (
  <div
    className={cn(
      'relative w-full overflow-hidden rounded-[28px] bg-moss-200',
      fill ? 'h-full' : aspectClass[aspect],
      zoomOnHover && 'group',
      className,
    )}
  >
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-2 text-moss-700',
        zoomOnHover && 'transition-transform duration-[350ms] group-hover:scale-105',
      )}
    >
      <ImageIcon size={28} strokeWidth={2} />
      {label ? <span className="px-4 text-center text-sm opacity-80">{label}</span> : null}
    </div>
    {children}
  </div>
)
