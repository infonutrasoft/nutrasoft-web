import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { sectionContainer } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'
import { ProductsFilter } from './ProductsFilter.client'

export const revalidate = 600

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    limit: 200,
    depth: 1,
  })

  const categories = new Map<string, string>()
  for (const product of products.docs) {
    if (typeof product.category === 'object' && product.category) {
      categories.set(product.category.id, product.category.title)
    }
  }

  return (
    <div className="bg-nutra-bg text-nutra-text">
      <section className="bg-forest-800 text-white">
        <div className={cn(sectionContainer, 'py-[35.2px] pb-[26.4px]')}>
          <h1 className="m-0 mb-[8.8px] text-[clamp(28px,3.6vw,38px)]">สินค้าทั้งหมด</h1>
          <p className="m-0 max-w-[60ch] text-base opacity-80">
            สารบำรุงพืชสำหรับสวนทุเรียนครบทุกระยะการเจริญเติบโต เลือกตามหมวดหมู่หรือดูรายละเอียดสินค้าแต่ละตัว
          </p>
        </div>
      </section>

      <ProductsFilter
        products={products.docs}
        categories={[...categories.entries()].map(([id, title]) => ({ id, title }))}
      />
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'สินค้าทั้งหมด | NutraSoft',
  }
}
