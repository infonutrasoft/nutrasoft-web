'use client'

import { ChevronDown, Droplet, Flame, Leaf, Shovel, Sprout } from 'lucide-react'
import React, { useState } from 'react'

import type { Problem } from '@/payload-types'
import RichText from '@/components/RichText'
import { NutraButton } from '@/components/nutra/Button'
import { Tag } from '@/components/nutra/Tag'
import { cardBase } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'

const icons = [Leaf, Flame, Droplet, Shovel, Sprout]
const LINE_URL = 'https://line.me/ti/p/@nutrasoft'

type ProblemsAccordionProps = {
  problems: Problem[]
}

export const ProblemsAccordion: React.FC<ProblemsAccordionProps> = ({ problems }) => {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-[17.6px]">
      {problems.map((problem, index) => {
        const Icon = icons[index % icons.length]
        const open = openIds.has(problem.id)
        const recommended = (problem.recommendedProducts ?? []).filter(
          (p): p is Exclude<typeof p, string> => typeof p === 'object' && p !== null,
        )
        const secondary = (problem.secondaryProducts ?? []).filter(
          (p): p is Exclude<typeof p, string> => typeof p === 'object' && p !== null,
        )

        return (
          <div key={problem.id} id={problem.slug} className={cn(cardBase, 'overflow-hidden p-0')}>
            <button
              type="button"
              onClick={() => toggle(problem.id)}
              className="flex w-full items-center gap-[13.2px] p-[17.6px] text-left"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-200">
                <Icon size={19} strokeWidth={2.75} className="text-forest-800" />
              </span>
              <span className="flex-1">
                <span className="block text-[17px] font-semibold">{problem.problem}</span>
                {problem.shortDescription ? (
                  <span className="text-[13px] opacity-70">{problem.shortDescription}</span>
                ) : null}
              </span>
              <ChevronDown
                size={16}
                strokeWidth={2.75}
                className={cn('shrink-0 transition-transform duration-200', open && 'rotate-180')}
              />
            </button>

            {open ? (
              <div className="flex flex-col gap-[13.2px] border-t border-nutra-neutral-300 p-[17.6px] pt-[13.2px]">
                {problem.possibleCauses ? (
                  <div>
                    <div className="mb-1 text-[13px] font-bold">สาเหตุที่เป็นไปได้</div>
                    <RichText data={problem.possibleCauses} enableGutter={false} enableProse={false} className="text-sm opacity-85" />
                  </div>
                ) : null}
                {problem.questionsToAsk ? (
                  <div>
                    <div className="mb-1 text-[13px] font-bold">คำถามที่ควรตรวจสอบ</div>
                    <p className="m-0 text-sm opacity-85">{problem.questionsToAsk}</p>
                  </div>
                ) : null}
                {recommended.length > 0 || secondary.length > 0 ? (
                  <div className="flex flex-wrap gap-[8.8px]">
                    {recommended.map((p) => (
                      <Tag key={p.id} variant="moss">
                        หลัก: {p.name}
                      </Tag>
                    ))}
                    {secondary.map((p) => (
                      <Tag key={p.id} variant="outline">
                        เสริม: {p.name}
                      </Tag>
                    ))}
                  </div>
                ) : null}
                <NutraButton href={LINE_URL} newTab className="self-start">
                  ปรึกษาทีมงานทาง LINE
                </NutraButton>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
