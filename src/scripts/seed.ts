import './load-env'

import { getPayload } from 'payload'
import XLSX from 'xlsx'

import config from '@payload-config'
import type { Category, Product } from '@/payload-types'

// Source workbooks
const PRODUCTS_XLSX = 'C:\\Users\\jetfi\\Documents\\New folder\\NutraSoft_AI_Knowledge_Base_Active_Products.xlsx'
const FAQ_XLSX = 'C:\\Users\\jetfi\\Documents\\New folder\\NutraSoft_FAQ_Database_Mockup.xlsx'

const ACTIVE_STATUS = 'พร้อมขาย'
const FAQ_ACTIVE_STATUS = 'ACTIVE'

type Row = Record<string, unknown>

const str = (v: unknown): string => (v === null || v === undefined ? '' : String(v).trim())

/** Minimal Lexical rich-text document: one paragraph per non-empty line. */
function textToLexical(text: string): NonNullable<Product['longDescription']> {
  const lines = str(text)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  const paragraphs = (lines.length > 0 ? lines : ['']).map((line) => ({
    type: 'paragraph',
    children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: line, version: 1 }],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }))
  return {
    root: {
      type: 'root',
      children: paragraphs,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

function mapLevel(value: string): 'entry' | 'core' | 'premium' | undefined {
  const v = value.toLowerCase()
  if (v === 'entry' || v === 'core' || v === 'premium') return v
  return undefined
}

/** Strip a leading "/faq/" (or any leading/trailing slashes) so seo_url becomes a bare slug. */
function urlToSlug(seoUrl: string): string {
  return str(seoUrl)
    .replace(/^\/?faq\//i, '')
    .replace(/^\/+|\/+$/g, '')
}

async function run() {
  const payload = await getPayload({ config })

  payload.logger.info('--- Reading workbooks ---')
  const productsWb = XLSX.readFile(PRODUCTS_XLSX)
  const faqWb = XLSX.readFile(FAQ_XLSX)

  const sheet = (wb: XLSX.WorkBook, name: string): Row[] => {
    const ws = wb.Sheets[name]
    if (!ws) throw new Error(`Sheet "${name}" not found in workbook`)
    return XLSX.utils.sheet_to_json<Row>(ws, { defval: null })
  }

  const productMaster = sheet(productsWb, 'Product_Master')
  const productBenefits = sheet(productsWb, 'Product_Benefits')
  const productCautions = sheet(productsWb, 'Product_Cautions')
  const productPricing = sheet(productsWb, 'Product_Pricing')
  const productAliases = sheet(productsWb, 'Product_Aliases')
  const faqRows = sheet(faqWb, 'FAQ Database')

  // ---------- group child sheets by SKU ----------
  const benefitsBySku = new Map<string, string[]>()
  for (const row of productBenefits) {
    const sku = str(row.SKU)
    const benefit = str(row.Benefit)
    if (!sku || !benefit) continue
    if (!benefitsBySku.has(sku)) benefitsBySku.set(sku, [])
    benefitsBySku.get(sku)!.push(benefit)
  }

  const cautionsBySku = new Map<string, string[]>()
  for (const row of productCautions) {
    const sku = str(row.SKU)
    const caution = str(row.Caution)
    if (!sku || !caution) continue
    if (!cautionsBySku.has(sku)) cautionsBySku.set(sku, [])
    cautionsBySku.get(sku)!.push(caution)
  }

  const sizesBySku = new Map<string, { size: string; price: number | null }[]>()
  for (const row of productPricing) {
    const sku = str(row.SKU)
    const size = str(row.Size)
    if (!sku || !size) continue
    if (!sizesBySku.has(sku)) sizesBySku.set(sku, [])
    const price = row.Current_Price_THB === null ? null : Number(row.Current_Price_THB)
    sizesBySku.get(sku)!.push({ size, price })
  }

  // ---------- alias resolution table (for FAQ related_product_id -> Product) ----------
  // normalized alias/name/sku -> set of SKUs it could refer to
  const aliasToSkus = new Map<string, Set<string>>()
  const addAlias = (alias: string, sku: string) => {
    const key = alias.trim().toLowerCase()
    if (!key) return
    if (!aliasToSkus.has(key)) aliasToSkus.set(key, new Set())
    aliasToSkus.get(key)!.add(sku)
  }
  for (const row of productAliases) {
    addAlias(str(row.Alias), str(row.Canonical_SKU))
  }
  for (const row of productMaster) {
    addAlias(str(row.SKU), str(row.SKU))
    addAlias(str(row.Canonical_Name), str(row.SKU))
  }

  function resolveProductRef(raw: string): string | null {
    const cleaned = str(raw).replace(/[–—]/g, ' ').replace(/\s+/g, ' ').trim()
    if (!cleaned) return null
    const tokens = cleaned.split(' ')
    const candidates = [cleaned, tokens[tokens.length - 1], tokens[0], tokens.slice(1).join(' ')]
    for (const candidate of candidates) {
      const key = candidate.trim().toLowerCase()
      if (!key) continue
      const skus = aliasToSkus.get(key)
      if (skus && skus.size === 1) return [...skus][0]
    }
    return null
  }

  // ---------- categories: find-or-create ----------
  const categoryCache = new Map<string, string>() // title -> id
  async function getOrCreateCategory(title: string): Promise<string | undefined> {
    if (!title) return undefined
    if (categoryCache.has(title)) return categoryCache.get(title)

    const existing = await payload.find({
      collection: 'categories',
      where: { title: { equals: title } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      const id = String((existing.docs[0] as Category).id)
      categoryCache.set(title, id)
      return id
    }

    // Categories' default slugify() strips non-ASCII chars, which turns Thai-only
    // titles into an empty (invalid) slug. Assign a safe explicit one instead.
    const slug = `cat-${categoryCache.size + 1}`
    const created = await payload.create({
      collection: 'categories',
      data: { title, slug },
    })
    const id = String(created.id)
    categoryCache.set(title, id)
    return id
  }

  // ---------- Products ----------
  payload.logger.info('--- Importing Products ---')
  const skuToProductId = new Map<string, string>()
  let productsImported = 0
  let productsSkipped = 0

  for (const row of productMaster) {
    const status = str(row.Status)
    if (status !== ACTIVE_STATUS) {
      productsSkipped++
      continue
    }

    const sku = str(row.SKU)
    const slug = sku.toLowerCase()
    const categoryId = await getOrCreateCategory(str(row.Category))

    const data = {
      name: str(row.Canonical_Name),
      slug,
      category: categoryId,
      level: mapLevel(str(row.Level)),
      heroProduct: str(row.Hero_Product).toUpperCase() === 'YES',
      shortDescription: str(row.Description_Short),
      longDescription: textToLexical(str(row.Description_Long)),
      heroMessage: str(row.Hero_Message),
      suitableStages: str(row.Suitable_Stages),
      benefits: (benefitsBySku.get(sku) ?? []).map((text) => ({ text })),
      cautions: (cautionsBySku.get(sku) ?? []).map((text) => ({ text })),
      sizes: (sizesBySku.get(sku) ?? []).map(({ size, price }) => ({ size, price })),
      status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    let id: string
    if (existing.docs.length > 0) {
      const updated = await payload.update({
        collection: 'products',
        id: (existing.docs[0] as Product).id,
        data,
      })
      id = String(updated.id)
    } else {
      const created = await payload.create({
        collection: 'products',
        data,
      })
      id = String(created.id)
    }

    skuToProductId.set(sku, id)
    productsImported++
  }

  // ---------- Problems (from FAQ Database) ----------
  payload.logger.info('--- Importing Problems ---')
  let problemsImported = 0
  let problemsSkipped = 0
  const unresolvedRefs: string[] = []

  for (const row of faqRows) {
    const status = str(row.status)
    if (status !== FAQ_ACTIVE_STATUS) {
      problemsSkipped++
      continue
    }

    const slug = urlToSlug(str(row.seo_url)) || str(row.faq_id).toLowerCase()
    const relatedRaw = str(row.related_product_id)
    let recommendedProducts: string[] = []
    if (relatedRaw) {
      const sku = resolveProductRef(relatedRaw)
      const productId = sku ? skuToProductId.get(sku) : undefined
      if (productId) {
        recommendedProducts = [productId]
      } else {
        unresolvedRefs.push(`${str(row.faq_id)}: "${relatedRaw}"`)
      }
    }

    const data = {
      problem: str(row.question),
      slug,
      shortDescription: str(row.short_answer),
      description: textToLexical(str(row.detailed_answer)),
      recommendedProducts,
      status: 'published' as const,
    }

    const existing = await payload.find({
      collection: 'problems',
      where: { slug: { equals: slug } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'problems',
        id: existing.docs[0].id,
        data,
      })
    } else {
      await payload.create({
        collection: 'problems',
        data,
      })
    }

    problemsImported++
  }

  payload.logger.info('--- Done ---')
  payload.logger.info(`Categories created/reused: ${categoryCache.size}`)
  payload.logger.info(`Products imported: ${productsImported} (skipped, not "${ACTIVE_STATUS}": ${productsSkipped})`)
  payload.logger.info(`Problems imported: ${problemsImported} (skipped, not "${FAQ_ACTIVE_STATUS}": ${problemsSkipped})`)
  if (unresolvedRefs.length > 0) {
    payload.logger.warn(
      `Problems with unresolved related_product_id (${unresolvedRefs.length}), no product currently active for these — imported without recommendedProducts:`,
    )
    for (const ref of unresolvedRefs) payload.logger.warn(`  - ${ref}`)
  }

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
