import type { Metadata } from 'next/types'

import { Facebook, Globe, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import QRCode from 'qrcode'
import React from 'react'

import { cardBase, sectionContainer } from '@/components/nutra/tokens'
import { cn } from '@/utilities/ui'

const LINE_URL = 'https://line.me/ti/p/@nutrasoft'

const phoneNumbers = [
  { href: 'tel:0646541598', label: '064-654-1598' },
  { href: 'tel:0646199645', label: '064-619-9645' },
]

const contactRows = [
  {
    icon: MapPin,
    label: 'ที่อยู่',
    content: (
      <>
        37/87 หมู่ 7 หมู่บ้านพกฤษา 65/1 ตำบลคลองสอง
        <br />
        อำเภอคลองหลวง จังหวัดปทุมธานี 12120
      </>
    ),
  },
  {
    icon: Mail,
    label: 'อีเมล',
    content: (
      <Link href="mailto:info.nutrasoft@gmail.com" className="no-underline">
        info.nutrasoft@gmail.com
      </Link>
    ),
  },
  {
    icon: Phone,
    label: 'โทรศัพท์',
    content: (
      <>
        {phoneNumbers.map((phone, index) => (
          <span key={phone.href}>
            <Link href={phone.href} className="no-underline">
              {phone.label}
            </Link>
            {index < phoneNumbers.length - 1 ? ', ' : ''}
          </span>
        ))}
      </>
    ),
  },
  {
    icon: Facebook,
    label: 'Facebook',
    content: (
      <Link href="https://facebook.com/NutrasoftThailand" className="no-underline">
        Nutrasoft Thailand
      </Link>
    ),
  },
  {
    icon: Globe,
    label: 'เว็บไซต์',
    content: (
      <Link href="https://www.nutrasoft.co.th" className="no-underline">
        www.nutrasoft.co.th
      </Link>
    ),
  },
]

export default async function ContactPage() {
  const lineQrSvg = await QRCode.toString(LINE_URL, {
    type: 'svg',
    margin: 1,
    color: { dark: '#163A26', light: '#FFFFFF00' },
  })

  return (
    <div className="bg-nutra-bg text-nutra-text">
      <section className="bg-forest-800 text-white">
        <div className={cn(sectionContainer, 'py-[35.2px] pb-[26.4px]')}>
          <h1 className="m-0 mb-[8.8px] text-[clamp(28px,3.6vw,38px)]">ติดต่อเรา</h1>
          <p className="m-0 max-w-[60ch] text-base opacity-80">
            สอบถามข้อมูลสินค้า สั่งซื้อ หรือปรึกษาปัญหาสวนทุเรียน ติดต่อทีมงาน NutraSoft ได้ตามช่องทางด้านล่าง
          </p>
        </div>
      </section>

      <section className="bg-moss-100 py-[26.4px] pb-[35.2px]">
        <div className={cn(sectionContainer, 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[17.6px]')}>
          <div className={cn(cardBase, 'flex flex-col gap-[17.6px] p-[26.4px]')}>
            {contactRows.map((row) => (
              <div key={row.label} className="flex items-start gap-[13.2px]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-200">
                  <row.icon size={18} strokeWidth={2.75} className="text-forest-800" />
                </span>
                <div>
                  <div className="text-xs tracking-[0.08em] uppercase opacity-60">{row.label}</div>
                  <div className="text-[15px] leading-relaxed">{row.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div className={cn(cardBase, 'flex flex-col items-center gap-[13.2px] p-[26.4px] text-center')}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-200">
              <MessageCircle size={18} strokeWidth={2.75} className="text-forest-800" />
            </span>
            <div className="text-xs tracking-[0.08em] uppercase opacity-60">สแกนเพื่อแอด LINE</div>
            <div
              className="h-[200px] w-[200px]"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: lineQrSvg }}
            />
            <Link href={LINE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold no-underline">
              LINE: @nutrasoft
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'ติดต่อเรา | NutraSoft',
  }
}
