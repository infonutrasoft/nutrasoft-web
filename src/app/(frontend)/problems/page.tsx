import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { sectionContainer } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'
import { ProblemsAccordion } from './ProblemsAccordion.client'

export const revalidate = 600

export default async function ProblemsPage() {
  const payload = await getPayload({ config: configPromise })

  const problems = await payload.find({
    collection: 'problems',
    where: { status: { equals: 'published' } },
    limit: 1000,
    pagination: false,
    depth: 1,
  })

  return (
    <div className="bg-nutra-bg text-nutra-text">
      <section className="bg-forest-800 text-white">
        <div className={cn(sectionContainer, 'py-[35.2px] pb-[26.4px]')}>
          <h1 className="m-0 mb-[8.8px] text-[clamp(28px,3.6vw,38px)]">ปัญหาที่พบบ่อยในสวนทุเรียน</h1>
          <p className="m-0 max-w-[60ch] text-base opacity-80">
            คลิกที่ปัญหาเพื่อดูสาเหตุ คำถามที่ควรตรวจสอบก่อน และสินค้าที่แนะนำ
          </p>
        </div>
      </section>

      <section className="bg-forest-100 py-[26.4px] pb-[35.2px]">
        <div className={sectionContainer}>
          <ProblemsAccordion problems={problems.docs} />
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'ปัญหาที่พบบ่อยในสวนทุเรียน | NutraSoft',
  }
}
