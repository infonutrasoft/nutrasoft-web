import type { Metadata } from 'next/types'

import { Banknote, MapPin, Package, Truck } from 'lucide-react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Media } from '@/components/Media'
import { ImagePlaceholder } from '@/components/nutra/ImagePlaceholder'
import { NutraButton } from '@/components/nutra/Button'
import { ProblemCard } from '@/components/nutra/ProblemCard'
import { ProductCard } from '@/components/nutra/ProductCard'
import { Tag } from '@/components/nutra/Tag'
import { VideoCard } from '@/components/nutra/VideoCard.client'
import { sectionContainer } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const revalidate = 600

const LINE_URL = 'https://line.me/ti/p/@nutrasoft'

const shippingFeatures = [
  { icon: Truck, label: 'จัดส่งไว 2-3 วันทำการ' },
  { icon: Package, label: 'แพ็คแน่นหนา ป้องกันการรั่วซึม' },
  { icon: MapPin, label: 'ส่งทุกจังหวัดทั่วไทย' },
  { icon: Banknote, label: 'เก็บเงินปลายทางได้' },
]

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [problems, heroProducts, home] = await Promise.all([
    payload.find({
      collection: 'problems',
      where: { status: { equals: 'published' } },
      limit: 4,
      depth: 1,
    }),
    payload.find({
      collection: 'products',
      where: { status: { equals: 'published' }, heroProduct: { equals: true } },
      limit: 3,
      depth: 1,
    }),
    getCachedGlobal('home', 1)(),
  ])

  const videos = home.videos && home.videos.length > 0 ? home.videos : []

  return (
    <div className="bg-nutra-bg text-nutra-text">
      {/* Hero */}
      <section className="bg-forest-800 text-white">
        <div className={cn(sectionContainer, 'flex flex-wrap items-center gap-[26.4px] py-[35.2px]')}>
          <div className="flex min-w-[300px] flex-1 basis-[420px] flex-col gap-[17.6px]">
            <Tag variant="forest" className="self-start">
              สำหรับสวนทุเรียนโดยเฉพาะ
            </Tag>
            <h1 className="m-0 text-[clamp(30px,4vw,44px)] font-semibold">
              ดูแลสวนทุเรียนให้ได้ผลดีทุกฤดู ด้วยสารบำรุงพืช NutraSoft
            </h1>
            <p className="m-0 max-w-[52ch] text-[17px] leading-[1.7] opacity-85">
              สูตรบำรุงเฉพาะทางสำหรับทุเรียน ตั้งแต่ระยะแตกใบไปจนถึงเก็บเกี่ยว
              ช่วยให้ต้นแข็งแรง ลดปัญหาผลแตก-ใบไหม้ และให้ผลผลิตที่มีคุณภาพสม่ำเสมอ
            </p>
            <div className="flex flex-wrap gap-[13.2px]">
              <NutraButton href="/products">ดูสินค้าทั้งหมด</NutraButton>
              <NutraButton variant="secondary" href={LINE_URL} newTab>
                ติดต่อทาง LINE
              </NutraButton>
            </div>
          </div>
          <div className="min-w-[300px] flex-1 basis-[380px]">
            {typeof home.heroImage === 'object' && home.heroImage ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
                <Media resource={home.heroImage} fill imgClassName="object-cover" />
              </div>
            ) : (
              <ImagePlaceholder aspect="4/3" zoomOnHover label="ภาพสวนทุเรียน / ผลิตภัณฑ์" />
            )}
          </div>
        </div>
      </section>

      {/* Problems teaser */}
      <section className="bg-forest-100 py-[35.2px]">
        <div className={sectionContainer}>
          <div className="mb-[17.6px] flex flex-wrap items-baseline justify-between gap-[13.2px]">
            <h2 className="m-0 text-[clamp(22px,2.6vw,30px)]">ปัญหายอดนิยมในสวนทุเรียน</h2>
            <NutraButton variant="secondary" href="/problems" className="!px-[13.2px] !py-[4.4px]">
              ดูปัญหาทั้งหมด →
            </NutraButton>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[17.6px]">
            {problems.docs.map((problem, index) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                index={index}
                recommendedProductName={
                  typeof problem.recommendedProducts?.[0] === 'object'
                    ? problem.recommendedProducts[0]?.name
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products teaser */}
      <section className="bg-moss-100 py-[35.2px]">
        <div className={sectionContainer}>
          <div className="mb-[17.6px] flex flex-wrap items-baseline justify-between gap-[13.2px]">
            <h2 className="m-0 text-[clamp(22px,2.6vw,30px)]">สินค้าแนะนำ</h2>
            <NutraButton variant="secondary" href="/products" className="!px-[13.2px] !py-[4.4px]">
              ดูสินค้าทั้งหมด →
            </NutraButton>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[17.6px]">
            {heroProducts.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shipping */}
      <section className="bg-nutra-surface py-[35.2px]">
        <div className={cn(sectionContainer, 'flex flex-wrap items-center gap-[26.4px]')}>
          <div className="min-w-[300px] flex-1 basis-[380px]">
            {typeof home.shippingImage === 'object' && home.shippingImage ? (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px]">
                <Media resource={home.shippingImage} fill imgClassName="object-cover" />
              </div>
            ) : (
              <ImagePlaceholder aspect="4/3" zoomOnHover label="ภาพรถขนส่ง / การจัดส่งสินค้า" />
            )}
          </div>
          <div className="min-w-[300px] flex-1 basis-[420px] flex flex-col gap-[13.2px]">
            <Tag variant="forest" className="self-start">
              บริการจัดส่ง
            </Tag>
            <h2 className="m-0 text-[clamp(22px,2.6vw,30px)]">จัดส่งถึงสวนทุเรียนทั่วประเทศ</h2>
            <p className="m-0 text-[15px] leading-[1.7] opacity-85">
              สั่งวันนี้ แพ็คอย่างดี จัดส่งรวดเร็วถึงหน้าสวน ไม่ว่าจะอยู่จังหวัดไหนก็สั่งซื้อ NutraSoft ได้สะดวก
            </p>
            <div className="mt-[8.8px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[13.2px]">
              {shippingFeatures.map((feature) => (
                <div key={feature.label} className="flex items-start gap-2.5">
                  <feature.icon size={20} strokeWidth={2.75} className="mt-0.5 shrink-0 text-moss-700" />
                  <span className="text-sm leading-normal">{feature.label}</span>
                </div>
              ))}
            </div>
            <NutraButton href={LINE_URL} newTab className="mt-[8.8px] self-start">
              สอบถามค่าจัดส่ง
            </NutraButton>
          </div>
        </div>
      </section>

      {/* Video grid */}
      <section className={cn(sectionContainer, 'py-[35.2px]')}>
        <div className="mx-auto mb-[26.4px] max-w-[640px] text-center">
          <Tag variant="forest">วิดีโอแนะนำ</Tag>
          <h2 className="my-[8.8px] text-[clamp(22px,2.6vw,30px)]">ดูวิธีใช้ NutraSoft ในสวนจริง</h2>
          <p className="m-0 text-[15px] opacity-80">
            คลิปสั้นสอนผสมสารและฉีดพ่นให้ถูกวิธี เห็นผลลัพธ์จริงจากสวนทุเรียนที่ใช้ NutraSoft
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[17.6px]">
          {videos.map((video) => (
            <div key={video.id} className="flex flex-col gap-[8.8px]">
              <VideoCard thumbnail={video.thumbnail} caption={video.caption} videoUrl={video.videoUrl} />
              <div className="text-sm font-semibold">{video.caption}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'NutraSoft — สารบำรุงพืชสำหรับสวนทุเรียน',
  }
}
