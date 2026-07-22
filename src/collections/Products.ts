import type { CollectionConfig } from 'payload'

import { FixedToolbarFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'level', 'status', 'heroProduct'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'name',
    }),
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'level',
      type: 'select',
      options: [
        { label: 'Entry', value: 'entry' },
        { label: 'Core', value: 'core' },
        { label: 'Premium', value: 'premium' },
      ],
    },
    {
      name: 'heroProduct',
      type: 'checkbox',
      defaultValue: false,
      label: 'สินค้าแนะนำ',
    },
    {
      name: 'shortDescription',
      type: 'text',
      label: 'คำอธิบายสั้น',
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'คำอธิบายละเอียด',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
    {
      name: 'heroMessage',
      type: 'text',
      label: 'จุดขาย',
    },
    {
      name: 'suitableStages',
      type: 'text',
      label: 'ระยะที่เหมาะใช้',
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'สรรพคุณ',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'cautions',
      type: 'array',
      label: 'ข้อควรระวัง',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'sizes',
      type: 'array',
      label: 'ขนาดและราคา',
      fields: [
        {
          name: 'size',
          type: 'text',
          required: true,
          admin: {
            description: 'เช่น 1L, 5L, 25L',
          },
        },
        {
          name: 'price',
          type: 'number',
          min: 0,
        },
      ],
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
