'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { cn } from '@/utilities/ui'
import { btnPrimary, sectionContainer } from './tokens'

const navItems = [
  { href: '/', label: 'หน้าแรก' },
  { href: '/products', label: 'สินค้า' },
  { href: '/problems', label: 'ปัญหาและการแก้ไข' },
]

export const NutraHeader: React.FC = () => {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-nutra-neutral-300 bg-nutra-bg">
      <div className={cn(sectionContainer, 'flex items-center gap-[17.6px] py-[13.2px]')}>
        <Link href="/" className="flex items-center">
          <img src="/nutrasoft-logo.png" alt="NutraSoft" className="block h-11 w-auto" />
        </Link>

        <nav className="ml-[17.6px] hidden items-center gap-[17.6px] md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative pb-1 no-underline font-semibold text-nutra-text transition-colors hover:text-moss-700 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:transition-[width] after:duration-[220ms]",
                  active
                    ? 'after:w-full after:bg-moss-600'
                    : 'after:w-0 after:bg-moss-500 hover:after:w-full',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link href="/contact" className={cn(btnPrimary, 'ml-auto hidden md:inline-flex')}>
          ติดต่อเรา
        </Link>

        <button
          type="button"
          aria-label="เมนู"
          onClick={() => setMenuOpen((o) => !o)}
          className={cn(btnPrimary, 'ml-auto bg-nutra-surface !text-nutra-text md:hidden')}
        >
          {menuOpen ? <X size={18} strokeWidth={2.75} /> : <Menu size={18} strokeWidth={2.75} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="absolute inset-x-0 top-full z-20 flex flex-col gap-[13.2px] border-b border-forest-700 bg-forest-800 p-[17.6px] shadow-[0_3px_10px_rgba(46,43,37,.16)] md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-semibold text-white no-underline"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setMenuOpen(false)} className={cn(btnPrimary, 'mt-[8.8px] w-full')}>
            ติดต่อเรา
          </Link>
        </div>
      ) : null}
    </header>
  )
}
