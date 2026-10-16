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
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { upsertPortfolioProject, type PortfolioInput } from "@/lib/actions/content"
import type { Tables } from "@/types/database"

export function PortfolioFormDialog({
  project,
  currentImageUrl,
}: {
  project?: Tables<"portfolio_projects">
  currentImageUrl?: string | null
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [title, setTitle] = useState(project?.title ?? "")
  const [industry, setIndustry] = useState(project?.industry ?? "")
  const [description, setDescription] = useState(project?.description ?? "")
  const [year, setYear] = useState(project?.year?.toString() ?? "")
  const [featured, setFeatured] = useState(project?.featured ?? false)
  const [status, setStatus] = useState<PortfolioInput["status"]>(project?.status ?? "draft")
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl ?? null)

  function handleSubmit() {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    startTransition(async () => {
      try {
        await upsertPortfolioProject({
          id: project?.id,
          title,
          industry: industry || null,
          description: description || null,
          year: year ? parseInt(year, 10) : null,
          featured,
          status,
          image_url: imageUrl,
        })
        toast.success(project ? "Project updated" : "Project created")
        setOpen(false)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save project")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size={project ? "icon" : "default"}
            variant={project ? "ghost" : "default"}
            className={project ? "" : "bg-brand-cta text-white"}
          >
            {project ? <Pencil className="size-4" /> : <><Plus className="size-4" /> New Project</>}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Portfolio Project" : "New Portfolio Project"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Industry (optional)</Label>
              <Input value={industry ?? ""} onChange={(e) => setIndustry(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Year (optional)</Label>
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description (optional)</Label>
            <Textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => v && setStatus(v as PortfolioInput["status"])}>
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
            <label className="mt-6 flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Featured
            </label>
          </div>
          <ImageUploadField folder="portfolio" value={imageUrl} onChange={setImageUrl} label="Project Image" />
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
