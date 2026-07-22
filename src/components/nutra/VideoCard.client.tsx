'use client'

import { Play } from 'lucide-react'
import React, { useState } from 'react'

import type { Media as MediaType } from '@/payload-types'
import { Media } from '@/components/Media'
import { ImagePlaceholder } from './ImagePlaceholder'

/** Extracts the video ID from common YouTube URL shapes (watch, youtu.be, embed, shorts). */
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  return match ? match[1] : null
}

type VideoCardProps = {
  thumbnail?: (string | null) | MediaType
  caption: string
  videoUrl?: string | null
}

export const VideoCard: React.FC<VideoCardProps> = ({ thumbnail, caption, videoUrl }) => {
  const [playing, setPlaying] = useState(false)
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null

  if (playing && youtubeId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-[28px]">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={caption}
          allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    )
  }

  const thumb =
    typeof thumbnail === 'object' && thumbnail ? (
      <div className="relative aspect-video w-full overflow-hidden rounded-[28px]">
        <Media resource={thumbnail} fill imgClassName="object-cover" />
      </div>
    ) : (
      <ImagePlaceholder aspect="16/9" zoomOnHover label={caption} />
    )

  return (
    <div
      className="group relative cursor-pointer"
      role={youtubeId ? 'button' : undefined}
      tabIndex={youtubeId ? 0 : undefined}
      onClick={() => youtubeId && setPlaying(true)}
      onKeyDown={(e) => {
        if (youtubeId && (e.key === 'Enter' || e.key === ' ')) setPlaying(true)
      }}
    >
      {thumb}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/92 shadow-[0_3px_10px_rgba(46,43,37,.16)]">
          <Play size={20} className="fill-moss-700 text-moss-700" />
        </span>
      </div>
    </div>
  )
}
