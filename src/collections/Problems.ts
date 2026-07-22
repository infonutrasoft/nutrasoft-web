import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Problems: CollectionConfig = {
  slug: 'problems',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'problem',
    defaultColumns: ['problem', 'status'],
  },
  fields: [
    {
      name: 'problem',
      type: 'text',
      required: true,
      label: 'ชื่อปัญหา',
    },
    slugField({
      fieldToUse: 'problem',
    }),
    {
      name: 'shortDescription',
      type: 'text',
      label: 'คำตอบสั้น',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'รายละเอียด',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'possibleCauses',
      type: 'richText',
      label: 'สาเหตุที่เป็นไปได้',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'questionsToAsk',
      type: 'text',
      label: 'คำถามที่ควรตรวจสอบ',
    },
    {
      name: 'recommendedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'สินค้าหลักที่แนะนำ',
    },
    {
      name: 'secondaryProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'สินค้าเสริม',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
    },
  ],
}
