"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { upsertProduct, type ProductInput } from "@/lib/actions/catalogue"
import type { Tables } from "@/types/database"

export function ProductForm({
  product,
  categories,
  currentImageUrl,
}: {
  product?: Tables<"products">
  categories: Tables<"categories">[]
  currentImageUrl?: string | null
}) {
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState(product?.name ?? "")
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "")
  const [shortDescription, setShortDescription] = useState(product?.short_description ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [status, setStatus] = useState<ProductInput["status"]>(product?.status ?? "active")
  const [featured, setFeatured] = useState(product?.featured ?? false)
  const [minQuantity, setMinQuantity] = useState(product?.minimum_quantity?.toString() ?? "")
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl ?? null)

  function handleSubmit() {
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    if (!categoryId) {
      toast.error("Category is required")
      return
    }
    startTransition(async () => {
      try {
        await upsertProduct({
          id: product?.id,
          category_id: categoryId,
          name,
          short_description: shortDescription || null,
          description: description || null,
          status,
          featured,
          minimum_quantity: minQuantity ? parseInt(minQuantity, 10) : null,
          image_url: imageUrl,
        })
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save product")
      }
    })
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-1.5">
          <Label>Product Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Short Description</Label>
          <Input value={shortDescription ?? ""} onChange={(e) => setShortDescription(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label>Full Description</Label>
          <Textarea value={description ?? ""} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => v && setStatus(v as ProductInput["status"])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Minimum Quantity</Label>
            <Input
              type="number"
              min={0}
              placeholder="No minimum"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
          Feature on homepage
        </label>

        <ImageUploadField folder="products" value={imageUrl} onChange={setImageUrl} label="Product Image" />

        <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-brand-cta text-white">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save Product
        </Button>
      </CardContent>
    </Card>
  )
}
