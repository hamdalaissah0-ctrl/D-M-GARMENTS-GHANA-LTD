"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "cn"

export function SampleGallery({
  images,
  alt,
}: {
  images: { storage_path: string; alt_text?: string | null }[]
  alt: string
}) {
  const [active, setActive] = useState(0)

  if (images.length === 0) return null

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-secondary/30">
        {images.map((img, i) => (
          <Image
            key={img.storage_path}
            src={img.storage_path}
            alt={img.alt_text ?? `${alt} sample ${i + 1}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority={i === 0}
            className={cn(
              "object-cover transition-opacity duration-500 ease-out",
              i === active ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.storage_path}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                i === active ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.storage_path}
                alt=""
                width={64}
                height={64}
                className="size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
