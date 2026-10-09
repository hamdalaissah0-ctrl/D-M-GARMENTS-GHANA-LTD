import { createClient } from "@/lib/supabase/client"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export function validateMediaFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `${file.name}: unsupported file type. Use JPG, PNG or WEBP.`
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${file.name}: file is too large (max 10 MB).`
  }
  return null
}

export async function uploadMediaFile(folder: string, file: File): Promise<string> {
  const supabase = createClient()
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
  const path = `${folder}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) {
    throw new Error(`Upload failed for ${file.name}: ${error.message}`)
  }

  const { data } = supabase.storage.from("media").getPublicUrl(path)
  return data.publicUrl
}
