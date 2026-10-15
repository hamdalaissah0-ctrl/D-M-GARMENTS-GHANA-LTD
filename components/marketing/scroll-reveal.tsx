"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "cn"

export function ScrollReveal({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode
  className?: string
  direction?: "up" | "left" | "right"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const hiddenTransform =
    direction === "up" ? "translate-y-8" : direction === "left" ? "-translate-x-10" : "translate-x-10"

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible ? "translate-x-0 translate-y-0 opacity-100" : `${hiddenTransform} opacity-0`,
        className
      )}
    >
      {children}
    </div>
  )
}
