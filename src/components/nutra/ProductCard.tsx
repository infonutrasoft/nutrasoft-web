import { Sprout } from 'lucide-react'
import React from 'react'

import type { Product } from '@/payload-types'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import { NutraButton } from './Button'
import { ImagePlaceholder } from './ImagePlaceholder'
import { Tag } from './Tag'
import { cardBase } from './tokens'

const levelMap = {
  entry: { label: 'Entry', variant: 'neutral' as const },
  core: { label: 'Core', variant: 'forest' as const },
  premium: { label: 'Premium', variant: 'moss' as const },
}

type ProductCardProps = {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const level = levelMap[product.level ?? 'core']
  const categoryTitle = typeof product.category === 'object' && product.category ? product.category.title : null
  const image = product.image

  return (
    <div className={cn(cardBase, 'flex h-full flex-col overflow-hidden p-0')}>
      <div className="group relative w-full aspect-[4/3]">
        {typeof image === 'object' && image ? (
          <Media
            resource={image}
            fill
            size="33vw"
            className="h-full w-full"
            imgClassName="object-cover transition-transform duration-[350ms] group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder aspect="4/3" zoomOnHover label="รูปสินค้า" className="h-full rounded-none" />
        )}
        <Tag variant={level.variant} className="absolute left-[13.2px] top-[13.2px]">
          {level.label}
        </Tag>
      </div>

      <div className="flex flex-1 flex-col gap-[8.8px] p-[17.6px]">
        {categoryTitle ? (
          <Tag variant="outline" className="self-start">
            {categoryTitle}
          </Tag>
        ) : null}
        <div className="text-lg font-semibold text-nutra-text">{product.name}</div>
        {product.shortDescription ? (
          <p className="m-0 text-sm text-nutra-text opacity-80">{product.shortDescription}</p>
        ) : null}
        {product.suitableStages ? (
          <div className="flex items-center gap-1.5 text-[13px] text-nutra-text opacity-75">
            <Sprout size={13} strokeWidth={2.75} />
            ระยะที่เหมาะใช้: {product.suitableStages}
          </div>
        ) : null}

        {product.sizes && product.sizes.length > 0 ? (
          <div className="mt-[8.8px] flex flex-col gap-1 font-mono text-[13px]">
            {product.sizes.map((s) => (
              <div key={s.id ?? s.size} className="flex justify-between">
                <span className="opacity-60">{s.size}</span>
                <span>{s.price != null ? `${s.price.toLocaleString('th-TH')} บาท` : '-'}</span>
              </div>
            ))}
          </div>
        ) : null}

        <NutraButton variant="secondary" href={`/products/${product.slug}`} className="mt-[13.2px] w-full">
          ดูรายละเอียด
        </NutraButton>
      </div>
    </div>
  )
}
