"use client"

import { useState, type ChangeEvent } from "react"
import { toast } from "sonner"
import { Loader2, UploadCloud, X } from "lucide-react"
import { uploadMediaFile, validateVideoFile } from "@/lib/supabase/media-upload"

export interface VideoUploadResult {
  videoUrl: string
  thumbnailUrl: string
  width: number
  height: number
  durationSeconds: number
}

function captureThumbnail(file: File): Promise<{ blob: Blob; width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.muted = true
    video.playsInline = true
    const url = URL.createObjectURL(file)
    video.src = url

    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1.5, video.duration / 2)
    }
    video.onseeked = () => {
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error("Could not create canvas context"))
        return
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (!blob) {
            reject(new Error("Could not generate thumbnail"))
            return
          }
          resolve({ blob, width: video.videoWidth, height: video.videoHeight, duration: video.duration })
        },
        "image/jpeg",
        0.85
      )
    }
    video.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Could not read video file"))
    }
  })
}

export function VideoUploadField({
  value,
  onChange,
}: {
  value: VideoUploadResult | null
  onChange: (result: VideoUploadResult | null) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [step, setStep] = useState<string | null>(null)

  async function handleSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const err = validateVideoFile(file)
    if (err) {
      toast.error(err)
      return
    }

    setUploading(true)
    try {
      setStep("Generating thumbnail...")
      const { blob, width, height, duration } = await captureThumbnail(file)
      const thumbFile = new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-thumb.jpg`, {
        type: "image/jpeg",
      })

      setStep("Uploading thumbnail...")
      const thumbnailUrl = await uploadMediaFile("video-thumbnails", thumbFile)

      setStep("Uploading video...")
      const videoUrl = await uploadMediaFile("videos", file)

      onChange({ videoUrl, thumbnailUrl, width, height, durationSeconds: Math.round(duration) })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
      setStep(null)
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">Video file</p>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.thumbnailUrl}
            alt=""
            className="h-32 w-32 rounded-lg border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-destructive text-white"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border bg-secondary/30 text-center hover:bg-secondary/50">
          {uploading ? (
            <>
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
              <span className="px-2 text-[10px] text-muted-foreground">{step}</span>
            </>
          ) : (
            <>
              <UploadCloud className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload video</span>
            </>
          )}
          <input
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            className="hidden"
            disabled={uploading}
            onChange={handleSelect}
          />
        </label>
      )}
    </div>
  )
}
