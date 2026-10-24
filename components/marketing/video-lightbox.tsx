"use client"

import { useEffect, useRef, useState, useCallback, type ChangeEvent } from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import type { PortfolioVideo } from "@/lib/supabase/queries"

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VideoLightbox({
  videos,
  index,
  onIndexChange,
  onClose,
}: {
  videos: PortfolioVideo[]
  index: number
  onIndexChange: (i: number) => void
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errored, setErrored] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const video = videos[index]

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + videos.length) % videos.length)
  }, [index, videos.length, onIndexChange])

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % videos.length)
  }, [index, videos.length, onIndexChange])

  useEffect(() => {
    setPlaying(false)
    setLoading(true)
    setErrored(false)
    setProgress(0)
  }, [index])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [goPrev, goNext])

  function togglePlay() {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play()
      setPlaying(true)
    } else {
      el.pause()
      setPlaying(false)
    }
  }

  function toggleMute() {
    const el = videoRef.current
    if (!el) return
    el.muted = !el.muted
    setMuted(el.muted)
  }

  function toggleFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen?.()
    }
  }

  function handleSeek(e: ChangeEvent<HTMLInputElement>) {
    const el = videoRef.current
    if (!el) return
    const time = (Number(e.target.value) / 100) * el.duration
    el.currentTime = time
    setProgress(Number(e.target.value))
  }

  return (
    <DialogPrimitive.Root open onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/90 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Popup
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-3 outline-none sm:p-6"
          aria-label={video.title}
        >
          <DialogPrimitive.Title className="sr-only">{video.title}</DialogPrimitive.Title>

          <DialogPrimitive.Close
            aria-label="Close video"
            className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          {videos.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous video"
                className="absolute top-1/2 left-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next video"
                className="absolute top-1/2 right-2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div
            ref={containerRef}
            className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-black"
            style={{ aspectRatio: video.width && video.height ? `${video.width} / ${video.height}` : "9 / 16" }}
          >
            {loading && !errored && (
              <div className="absolute inset-0 z-[1] flex items-center justify-center bg-black/40">
                <Loader2 className="size-8 animate-spin text-white/80" />
              </div>
            )}
            {errored && (
              <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-2 bg-black p-6 text-center text-sm text-white/70">
                <p>This video couldn&apos;t be played.</p>
              </div>
            )}

            <video
              ref={videoRef}
              key={video.id}
              src={video.video_url}
              poster={video.thumbnail_url}
              preload="metadata"
              playsInline
              onClick={togglePlay}
              onLoadedMetadata={(e) => {
                setDuration(e.currentTarget.duration)
                setLoading(false)
              }}
              onTimeUpdate={(e) => {
                const el = e.currentTarget
                if (el.duration) setProgress((el.currentTime / el.duration) * 100)
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onError={() => {
                setLoading(false)
                setErrored(true)
              }}
              className="size-full cursor-pointer object-contain"
            />

            {!errored && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-8 pb-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  aria-label="Seek"
                  className="h-1 w-full cursor-pointer accent-[#8CC63E]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={playing ? "Pause" : "Play"}
                      className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10"
                    >
                      {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={muted ? "Unmute" : "Mute"}
                      className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10"
                    >
                      {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                    </button>
                    <span className="text-xs text-white/70 tabular-nums">
                      {formatTime((progress / 100) * duration)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Fullscreen"
                    className="flex size-8 items-center justify-center rounded-full text-white hover:bg-white/10"
                  >
                    <Maximize className="size-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 max-w-md text-center text-white">
            <p className="text-sm font-semibold">{video.title}</p>
            <p className="mt-0.5 text-xs text-white/50">
              {index + 1} / {videos.length}
            </p>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
