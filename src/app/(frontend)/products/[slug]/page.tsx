import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React, { cache } from 'react'

import RichText from '@/components/RichText'
import { NutraButton } from '@/components/nutra/Button'
import { ImagePlaceholder } from '@/components/nutra/ImagePlaceholder'
import { Media } from '@/components/Media'
import { ProductCard } from '@/components/nutra/ProductCard'
import { Tag } from '@/components/nutra/Tag'
import { sectionContainer } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'

const LINE_URL = 'https://line.me/ti/p/@nutrasoft'

const levelLabels = { entry: 'Entry', core: 'Core', premium: 'Premium' }

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    where: { status: { equals: 'published' } },
    limit: 1000,
    pagination: false,
    select: { slug: true },
  })

  return products.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function ProductDetailPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug: decodeURIComponent(slug) })

  if (!product) notFound()

  const payload = await getPayload({ config: configPromise })
  const categoryId = typeof product.category === 'object' && product.category ? product.category.id : undefined
  const categoryTitle = typeof product.category === 'object' && product.category ? product.category.title : null

  const related = categoryId
    ? await payload.find({
        collection: 'products',
        where: {
          and: [
            { category: { equals: categoryId } },
            { slug: { not_equals: product.slug } },
            { status: { equals: 'published' } },
          ],
        },
        limit: 3,
        depth: 1,
      })
    : null

  return (
    <div className="bg-nutra-bg text-nutra-text">
      <div className="bg-forest-800 text-white">
        <div className={cn(sectionContainer, 'py-[13.2px] text-[13px] opacity-85')}>
          <Link href="/" className="no-underline">
            หน้าแรก
          </Link>{' '}
          &gt;{' '}
          <Link href="/products" className="no-underline">
            สินค้า
          </Link>{' '}
          &gt; <span>{product.name}</span>
        </div>
      </div>

      <section className={cn(sectionContainer, 'flex flex-wrap gap-[26.4px] py-[17.6px] pb-[35.2px]')}>
        <div className="min-w-[300px] flex-1 basis-[420px]">
          {typeof product.image === 'object' && product.image ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-[28px]">
              <Media resource={product.image} fill imgClassName="object-cover" />
            </div>
          ) : (
            <ImagePlaceholder aspect="1/1" label="รูปสินค้าขนาดใหญ่" />
          )}
        </div>

        <div className="flex min-w-[300px] flex-1 basis-[420px] flex-col gap-[13.2px]">
          <div className="flex gap-[8.8px]">
            {product.level ? <Tag variant="forest">{levelLabels[product.level]}</Tag> : null}
            {product.suitableStages ? <Tag variant="outline">{product.suitableStages}</Tag> : null}
          </div>
          <h1 className="m-0 text-[clamp(26px,3.2vw,36px)]">{product.name}</h1>
          {product.heroMessage ? (
            <p className="m-0 text-lg font-semibold text-moss-700">{product.heroMessage}</p>
          ) : null}
          {product.longDescription ? (
            <RichText data={product.longDescription} enableGutter={false} />
          ) : null}

          {product.sizes && product.sizes.length > 0 ? (
            <table className="mt-[8.8px] w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-nutra-neutral-300 text-left">
                  <th className="py-1.5">ขนาด</th>
                  <th className="py-1.5">ราคา</th>
                </tr>
              </thead>
              <tbody>
                {product.sizes.map((s) => (
                  <tr key={s.id ?? s.size} className="border-b border-nutra-neutral-200">
                    <td className="py-1.5 font-mono">{s.size}</td>
                    <td className="py-1.5 font-mono">
                      {s.price != null ? `${s.price.toLocaleString('th-TH')} บาท` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          <div className="mt-[13.2px] flex flex-wrap gap-[13.2px]">
            <NutraButton href={LINE_URL} newTab className="!px-6 !py-3.5 !text-base">
              สอบถามทาง LINE
            </NutraButton>
            <NutraButton variant="secondary" href="tel:0646541598" className="!px-6 !py-3.5 !text-base">
              โทรหาเรา
            </NutraButton>
          </div>
        </div>
      </section>

      {product.benefits && product.benefits.length > 0 ? (
        <section className="bg-forest-100 py-[26.4px] pb-[35.2px]">
          <div className={sectionContainer}>
            <h2 className="mb-[13.2px] text-[22px]">สรรพคุณ</h2>
            <ul className="m-0 flex flex-col gap-2 pl-5 text-[15px] leading-relaxed">
              {product.benefits.map((b) => (
                <li key={b.id ?? b.text}>{b.text}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {product.cautions && product.cautions.length > 0 ? (
        <section className={cn(sectionContainer, 'py-[26.4px] pb-[35.2px]')}>
          <h2 className="mb-[13.2px] text-[22px]">ข้อควรระวัง</h2>
          <div className="flex gap-[13.2px] rounded-[16px] bg-nutra-warning p-[17.6px]">
            <ul className="m-0 flex flex-col gap-1.5 pl-[18px] text-sm leading-relaxed text-nutra-warning-text">
              {product.cautions.map((c) => (
                <li key={c.id ?? c.text}>{c.text}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {related && related.docs.length > 0 ? (
        <section className="bg-moss-100 py-[26.4px] pb-[35.2px]">
          <div className={sectionContainer}>
            <h2 className="mb-[17.6px] text-[22px]">สินค้าที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[17.6px]">
              {related.docs.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const product = await queryProductBySlug({ slug: decodeURIComponent(slug) })

  if (!product) return { title: 'NutraSoft' }

  return {
    title: `${product.name} | NutraSoft`,
    description: product.shortDescription ?? undefined,
  }
}

const queryProductBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  return result.docs?.[0] || null
})
