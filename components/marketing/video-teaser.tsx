"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { SectionEyebrow } from "@/components/marketing/section-eyebrow"
import { VideoLightbox } from "@/components/marketing/video-lightbox"
import type { PortfolioVideo } from "@/lib/supabase/queries"

export function VideoTeaser({ videos }: { videos: PortfolioVideo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const shown = videos.slice(0, 3)

  if (shown.length === 0) return null

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="flex items-end justify-between">
          <div>
            <SectionEyebrow>Inside D&amp;M Garments</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Craftsmanship in Motion
            </h2>
          </div>
          <Link
            href="/portfolio?tab=videos"
            className="hidden items-center gap-1.5 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            Watch all videos <ArrowRight className="size-4" />
          </Link>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {shown.map((video, i) => (
            <ScrollReveal key={video.id} direction="up" className={i === 1 ? "sm:-mt-6" : ""}>
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow hover:shadow-lg"
                style={{ aspectRatio: video.width && video.height ? `${video.width} / ${video.height}` : "4 / 5" }}
              >
                <Image
                  src={video.thumbnail_url}
                  alt={video.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-12 items-center justify-center rounded-full bg-white/90 text-[#0F4D26] shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="ml-0.5 size-4 fill-current" />
                  </span>
                </span>
                <p className="absolute inset-x-0 bottom-0 p-4 text-left text-sm font-semibold text-white">
                  {video.title}
                </p>
              </button>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link href="/portfolio?tab=videos" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Watch all videos <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {lightboxIndex !== null && (
        <VideoLightbox
          videos={shown}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  )
}
