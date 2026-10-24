"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VideoUploadField, type VideoUploadResult } from "@/components/admin/video-upload-field"
import { upsertPortfolioVideo, type PortfolioVideoInput } from "@/lib/actions/content"
import type { Tables } from "@/types/database"

const CATEGORIES = [
  { value: "manufacturing", label: "Manufacturing" },
  { value: "fabric-printing", label: "Fabric Printing" },
  { value: "corporate-uniforms", label: "Corporate Uniforms" },
  { value: "safety-wear", label: "Safety Wear" },
  { value: "product-showcase", label: "Product Showcase" },
]

export function VideoFormDialog({ video }: { video?: Tables<"portfolio_videos"> }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [title, setTitle] = useState(video?.title ?? "")
  const [description, setDescription] = useState(video?.description ?? "")
  const [category, setCategory] = useState(video?.category ?? "manufacturing")
  const [featured, setFeatured] = useState(video?.featured ?? false)
  const [status, setStatus] = useState<PortfolioVideoInput["status"]>(video?.status ?? "draft")
  const [media, setMedia] = useState<VideoUploadResult | null>(
    video
      ? {
          videoUrl: video.video_url,
          thumbnailUrl: video.thumbnail_url,
          width: video.width ?? 0,
          height: video.height ?? 0,
          durationSeconds: video.duration_seconds ?? 0,
        }
      : null
  )

  function handleSubmit() {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!media) {
      toast.error("A video file is required")
      return
    }
    startTransition(async () => {
      try {
        await upsertPortfolioVideo({
          id: video?.id,
          title,
          description: description || null,
          category,
          video_url: media.videoUrl,
          thumbnail_url: media.thumbnailUrl,
          duration_seconds: media.durationSeconds || null,
          width: media.width || null,
          height: media.height || null,
          featured,
          status,
        })
        toast.success(video ? "Video updated" : "Video added")
        setOpen(false)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save video")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size={video ? "icon" : "default"}
            variant={video ? "ghost" : "default"}
            className={video ? "" : "bg-brand-cta text-white"}
          >
            {video ? <Pencil className="size-4" /> : <><Plus className="size-4" /> New Video</>}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{video ? "Edit Video" : "New Video"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={(v) => v && setCategory(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as PortfolioVideoInput["status"])}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            Featured (shown in the cinematic hero section)
          </label>
          <VideoUploadField value={media} onChange={setMedia} />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isPending} className="bg-brand-cta text-white">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
