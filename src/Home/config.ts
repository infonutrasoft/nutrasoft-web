import type { GlobalConfig } from 'payload'

import { revalidateHome } from './hooks/revalidateHome'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: 'รูป Hero (ขวาบนสุดของหน้าแรก)',
    },
    {
      name: 'videos',
      type: 'array',
      label: 'วิดีโอแนะนำ',
      maxRows: 12,
      defaultValue: [
        { caption: 'วิธีผสมสารให้ถูกอัตรา' },
        { caption: 'เทคนิคฉีดพ่นให้ทั่วต้น' },
        { caption: 'รีวิวผลลัพธ์จากสวนจริง' },
        { caption: 'เลือกสูตรตามระยะการเจริญเติบโต' },
        { caption: 'วิธีสังเกตอาการขาดธาตุอาหารในทุเรียน' },
        { caption: 'เทคนิคฟื้นต้นหลังเก็บเกี่ยว' },
        { caption: 'การเตรียมน้ำก่อนผสมสารให้ถูกวิธี' },
        { caption: 'วิธีดูแลช่วงแตกใบอ่อน' },
        { caption: 'เคล็ดลับดูแลช่วงออกดอกติดผล' },
        { caption: 'วิธีป้องกันปัญหาผลแตกเนื้อแฉะ' },
        { caption: 'รีวิวการใช้งานจากเกษตรกรจริง' },
        { caption: 'คำถามที่พบบ่อยเกี่ยวกับการใช้ NutraSoft' },
      ],
      fields: [
        {
          name: 'thumbnail',
          type: 'upload',
          relationTo: 'media',
          label: 'รูปปกวิดีโอ',
        },
        {
          name: 'caption',
          type: 'text',
          required: true,
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'ลิงก์วิดีโอ (YouTube เป็นต้น) — ถ้าใส่ ผู้ใช้จะกดเล่นแล้วเปิดลิงก์นี้',
        },
      ],
    },
    {
      name: 'shippingImage',
      type: 'upload',
      relationTo: 'media',
      label: 'รูปบริการจัดส่ง',
    },
  ],
  hooks: {
    afterChange: [revalidateHome],
  },
}
