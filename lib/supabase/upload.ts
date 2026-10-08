import { createClient } from "@/lib/supabase/client"

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"]
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024

export interface UploadedFile {
  storage_path: string
  original_filename: string
  mime_type: string
  size_bytes: number
}

export function validateFile(file: File): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `${file.name}: unsupported file type. Use JPG, PNG, WEBP or PDF.`
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${file.name}: file is too large (max 15 MB).`
  }
  return null
}

export async function uploadOrderReferenceFile(
  idempotencyKey: string,
  file: File
): Promise<UploadedFile> {
  const supabase = createClient()
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")
  const path = `pending/${idempotencyKey}/${Date.now()}-${safeName}`

  const { error } = await supabase.storage
    .from("customer-order-files")
    .upload(path, file, { contentType: file.type, upsert: false })

  if (error) {
    throw new Error(`Upload failed for ${file.name}: ${error.message}`)
  }

  return {
    storage_path: path,
    original_filename: file.name,
    mime_type: file.type,
    size_bytes: file.size,
  }
}
