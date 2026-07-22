import { ArrowRight, Droplet, Flame, Leaf, Shovel, Sprout } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Problem } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { cardBase } from './tokens'

const icons = [Leaf, Flame, Droplet, Shovel, Sprout]

type ProblemCardProps = {
  problem: Problem
  index?: number
  recommendedProductName?: string
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, index = 0, recommendedProductName }) => {
  const Icon = icons[index % icons.length]

  return (
    <div className={cn('flex h-full flex-col gap-[13.2px] p-[17.6px]', cardBase)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest-200">
        <Icon size={21} strokeWidth={2.75} className="text-forest-800" />
      </span>
      <div className="text-base font-semibold text-nutra-text">{problem.problem}</div>
      {problem.shortDescription ? (
        <p className="m-0 flex-1 text-sm text-nutra-text opacity-80">{problem.shortDescription}</p>
      ) : null}
      {recommendedProductName ? (
        <div className="text-xs text-nutra-text opacity-65">สินค้าแนะนำ: {recommendedProductName}</div>
      ) : null}
      <Link
        href={`/problems#${problem.slug}`}
        className="flex items-center gap-1 text-sm font-semibold text-moss-700 no-underline"
      >
        ดูวิธีแก้ไข
        <ArrowRight size={14} strokeWidth={2.75} />
      </Link>
    </div>
  )
}
