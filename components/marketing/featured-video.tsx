"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Play, ArrowRight } from "lucide-react"
import { SectionEyebrow } from "@/components/marketing/section-eyebrow"
import { VideoLightbox } from "@/components/marketing/video-lightbox"
import type { PortfolioVideo } from "@/lib/supabase/queries"

export function FeaturedVideo({ video }: { video: PortfolioVideo }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <SectionEyebrow className="mx-auto">Featured Production</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Where Creativity Meets Precision
          </h2>
          <p className="mt-4 text-muted-foreground">
            Explore the production processes and modern printing techniques that bring our
            customers&apos; designs to life.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative block w-full overflow-hidden rounded-3xl shadow-xl"
          style={{ aspectRatio: "21 / 9" }}
        >
          <Image
            src={video.thumbnail_url}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-60 blur-2xl"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="relative h-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10"
              style={{
                aspectRatio: video.width && video.height ? `${video.width} / ${video.height}` : "9 / 16",
              }}
            >
              <Image
                src={video.thumbnail_url}
                alt=""
                fill
                sizes="400px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-white/95 text-[#0F4D26] shadow-lg transition-transform duration-300 group-hover:scale-110">
              <Play className="ml-1 size-6 fill-current" />
            </span>
          </span>
          <div className="absolute bottom-6 left-6 text-left text-white">
            <p className="text-lg font-semibold">{video.title}</p>
          </div>
        </button>

        <div className="mt-6 flex justify-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Explore Our Services <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {open && (
        <VideoLightbox videos={[video]} index={0} onIndexChange={() => {}} onClose={() => setOpen(false)} />
      )}
    </section>
  )
}
