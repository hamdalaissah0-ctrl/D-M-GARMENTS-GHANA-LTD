"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/marketing/scroll-reveal"
import type { PortfolioProject } from "@/lib/supabase/queries"

export interface PortfolioProjectWithImage extends PortfolioProject {
  image_url: string | null
}

export function PortfolioGrid({ projects }: { projects: PortfolioProjectWithImage[] }) {
  const [activeIndustry, setActiveIndustry] = useState("all")

  const industries = useMemo(() => {
    const present = new Set(projects.map((p) => p.industry).filter((i): i is string => Boolean(i)))
    return Array.from(present)
  }, [projects])

  const filtered = useMemo(
    () => (activeIndustry === "all" ? projects : projects.filter((p) => p.industry === activeIndustry)),
    [projects, activeIndustry]
  )

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveIndustry("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeIndustry === "all"
              ? "bg-foreground text-background"
              : "border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {industries.map((industry) => (
          <button
            key={industry}
            type="button"
            onClick={() => setActiveIndustry(industry)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeIndustry === industry
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {industry}
          </button>
        ))}
      </div>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5 [&>*]:break-inside-avoid">
        {filtered.map((project, i) => (
          <ScrollReveal key={project.id} direction="up" className={i % 3 === 1 ? "sm:mt-8" : ""}>
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-secondary shadow-sm transition-shadow hover:shadow-lg">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                {project.image_url ? (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Content required
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  {project.industry && (
                    <span className="inline-block rounded-full bg-[#8CC63E] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#0F4D26] uppercase">
                      {project.industry}
                    </span>
                  )}
                  <p className="mt-2 text-sm font-semibold text-white">{project.title}</p>
                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-white/70">{project.description}</p>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/order"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
        >
          Request something similar <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
