"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Play } from "lucide-react"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import { VideoLightbox } from "@/components/marketing/video-lightbox"
import type { PortfolioVideo } from "@/lib/supabase/queries"

const CATEGORY_LABELS: Record<string, string> = {
  manufacturing: "Manufacturing",
  "fabric-printing": "Fabric Printing",
  "corporate-uniforms": "Corporate Uniforms",
  "safety-wear": "Safety Wear",
  "product-showcase": "Product Showcase",
}

export function VideoGallery({ videos }: { videos: PortfolioVideo[] }) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const categories = useMemo(() => {
    const present = new Set(videos.map((v) => v.category))
    return Object.keys(CATEGORY_LABELS).filter((c) => present.has(c))
  }, [videos])

  const filtered = useMemo(
    () => (activeCategory === "all" ? videos : videos.filter((v) => v.category === activeCategory)),
    [videos, activeCategory]
  )

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All Videos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-muted-foreground">No videos in this category yet.</p>
      ) : (
        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
          {filtered.map((video, i) => (
            <ScrollReveal key={video.id} direction="up" className={i % 3 === 1 ? "sm:mt-8" : ""}>
              <button
                type="button"
                onClick={() => setLightboxIndex(videos.indexOf(video))}
                className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-shadow hover:shadow-lg"
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: video.width && video.height ? `${video.width} / ${video.height}` : "4 / 5" }}
                >
                  <Image
                    src={video.thumbnail_url}
                    alt={video.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-white/90 text-[#0F4D26] shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 size-5 fill-current" />
                    </span>
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <span className="inline-block rounded-full bg-[#8CC63E] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#0F4D26] uppercase">
                      {CATEGORY_LABELS[video.category] ?? video.category}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-white">{video.title}</p>
                  </div>
                </div>
              </button>
            </ScrollReveal>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <VideoLightbox
          videos={videos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
