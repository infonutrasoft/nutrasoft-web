import { Facebook, Globe, MessageCircle, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'
import { sectionContainer } from './tokens'

const menuLinks = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/products', label: 'สินค้า' },
  { href: '/problems', label: 'ปัญหาและการแก้ไข' },
  { href: '/contact', label: 'ติดต่อเรา' },
]

const phoneNumbers = [
  { href: 'tel:0646541598', label: '064-654-1598' },
  { href: 'tel:0646199645', label: '064-619-9645' },
]

const contactLinks = [
  { href: 'https://line.me/ti/p/@nutrasoft', label: 'LINE: @nutrasoft', icon: MessageCircle },
  { href: 'https://facebook.com/NutrasoftThailand', label: 'Nutrasoft Thailand', icon: Facebook },
  { href: 'https://www.nutrasoft.co.th', label: 'www.nutrasoft.co.th', icon: Globe },
]

export const NutraFooter: React.FC = () => (
  <footer className="border-t border-forest-700 bg-forest-800 text-white">
    <div
      className={cn(
        sectionContainer,
        'flex flex-wrap justify-between gap-[26.4px] py-[35.2px] pb-[26.4px]',
      )}
    >
      <div className="flex max-w-[320px] flex-col gap-[13.2px]">
        <img src="/nutrasoft-logo.png" alt="NutraSoft" className="block h-10 w-auto self-start" />
        <p className="m-0 text-sm leading-relaxed opacity-75">
          สารบำรุงพืชสำหรับสวนทุเรียนคุณภาพ ช่วยให้เกษตรกรดูแลสวนได้ง่ายขึ้นและได้ผลผลิตที่ดีขึ้นในทุกฤดู
        </p>
      </div>

      <div className="flex min-w-[140px] flex-col gap-[8.8px]">
        <div className="mb-1.5 text-xs tracking-[0.08em] uppercase opacity-60">เมนู</div>
        {menuLinks.map((item) => (
          <Link key={item.href} href={item.href} className="text-sm text-white no-underline">
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex min-w-[220px] flex-col gap-[8.8px]">
        <div className="mb-1.5 text-xs tracking-[0.08em] uppercase opacity-60">ติดต่อเรา</div>
        <div className="flex items-center gap-2 text-sm text-white">
          <Phone size={15} strokeWidth={2.75} className="shrink-0" />
          <span>
            {phoneNumbers.map((phone, index) => (
              <span key={phone.href}>
                <Link href={phone.href} className="text-white no-underline">
                  {phone.label}
                </Link>
                {index < phoneNumbers.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        </div>
        {contactLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-sm text-white no-underline"
          >
            <item.icon size={15} strokeWidth={2.75} />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
    <div className="border-t border-forest-700 py-[13.2px] text-center text-xs opacity-60">
      © 2026 NutraSoft. สงวนลิขสิทธิ์.
    </div>
  </footer>
)
