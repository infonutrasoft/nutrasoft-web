// Centralized arbitrary-value utility strings for the NutraSoft brand design
// (spacing/radius/shadow values from the design handoff — not part of the
// shared Tailwind theme since those numbers aren't reused outside this brand).

export const cardBase =
  'bg-nutra-surface rounded-[32px] shadow-[0_1px_2px_rgba(46,43,37,.14)] transition-[transform,box-shadow] duration-[220ms] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(46,43,37,.22)]'

export const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-[17.6px] py-[13.2px] font-semibold whitespace-nowrap transition-[transform,box-shadow,background] duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_3px_10px_rgba(46,43,37,.16)] active:translate-y-0'

export const btnPrimary = `${btnBase} bg-moss-500 text-white hover:bg-moss-600`
export const btnSecondary = `${btnBase} bg-nutra-surface text-nutra-text border border-nutra-neutral-300 hover:bg-nutra-neutral-100`

export const tagBase =
  'inline-flex items-center rounded-full px-[13.2px] py-[4.4px] text-sm transition hover:brightness-95'

export const tagVariants = {
  moss: `${tagBase} bg-moss-500 text-white`,
  forest: `${tagBase} bg-forest-100 text-forest-800`,
  neutral: `${tagBase} bg-nutra-neutral-200 text-nutra-text`,
  outline: `${tagBase} border border-nutra-neutral-300 text-nutra-text`,
} as const

export const sectionContainer = 'max-w-[1240px] mx-auto px-[17.6px]'

export const navUnderline =
  "relative pb-1 no-underline font-semibold transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:bg-moss-500 after:transition-[width] after:duration-[220ms]"
