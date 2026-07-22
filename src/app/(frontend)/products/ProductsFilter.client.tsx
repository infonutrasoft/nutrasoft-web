'use client'

import React, { useMemo, useState } from 'react'

import type { Product } from '@/payload-types'
import { ProductCard } from '@/components/nutra/ProductCard'
import { Tag } from '@/components/nutra/Tag'
import { sectionContainer } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'

type ProductsFilterProps = {
  products: Product[]
  categories: { id: string; title: string }[]
}

export const ProductsFilter: React.FC<ProductsFilterProps> = ({ products, categories }) => {
  const [filter, setFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return products
    return products.filter(
      (product) => typeof product.category === 'object' && product.category?.id === filter,
    )
  }, [products, filter])

  return (
    <>
      <section className="bg-forest-100 py-[17.6px]">
        <div className={cn(sectionContainer, 'flex flex-wrap gap-[8.8px]')}>
          <button type="button" onClick={() => setFilter('all')}>
            <Tag variant={filter === 'all' ? 'moss' : 'outline'} className="cursor-pointer">
              ทั้งหมด
            </Tag>
          </button>
          {categories.map((category) => (
            <button key={category.id} type="button" onClick={() => setFilter(category.id)}>
              <Tag variant={filter === category.id ? 'moss' : 'outline'} className="cursor-pointer">
                {category.title}
              </Tag>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-moss-100 py-[26.4px] pb-[35.2px]">
        <div className={sectionContainer}>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[17.6px]">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
