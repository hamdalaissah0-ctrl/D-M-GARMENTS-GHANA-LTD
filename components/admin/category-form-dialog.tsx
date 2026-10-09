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
import { upsertCategory, type CategoryInput } from "@/lib/actions/catalogue"
import type { Tables } from "@/types/database"

export function CategoryFormDialog({ category }: { category?: Tables<"categories"> }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [status, setStatus] = useState<CategoryInput["status"]>(category?.status ?? "draft")
  const [imageUrl, setImageUrl] = useState<string | null>(category?.image_url ?? null)

  function handleSubmit() {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    startTransition(async () => {
      try {
        await upsertCategory({
          id: category?.id,
          name,
          description: description || null,
          image_url: imageUrl,
          status,
        })
        toast.success(category ? "Category updated" : "Category created")
        setOpen(false)
        router.refresh()
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save category")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size={category ? "icon" : "default"} variant={category ? "ghost" : "default"} className={category ? "" : "bg-brand-cta text-white"}>
            {category ? <Pencil className="size-4" /> : <><Plus className="size-4" /> New Category</>}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "New Category"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as CategoryInput["status"])}>
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
          <ImageUploadField folder="categories" value={imageUrl} onChange={setImageUrl} />
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
