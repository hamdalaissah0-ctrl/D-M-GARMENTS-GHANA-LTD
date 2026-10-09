"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, UploadCloud, X } from "lucide-react"
import { uploadMediaFile, validateMediaFile } from "@/lib/supabase/media-upload"

export function ImageUploadField({
  folder,
  value,
  onChange,
  label = "Image",
}: {
  folder: string
  value: string | null
  onChange: (url: string | null) => void
  label?: string
}) {
  const [uploading, setUploading] = useState(false)

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    const err = validateMediaFile(file)
    if (err) {
      toast.error(err)
      return
    }

    setUploading(true)
    try {
      const url = await uploadMediaFile(folder, file)
      onChange(url)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-foreground">{label}</p>
      {value ? (
        <div className="relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-32 w-32 rounded-lg border border-border object-cover" />
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
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <UploadCloud className="size-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            disabled={uploading}
            onChange={handleSelect}
          />
        </label>
      )}
    </div>
  )
}
