import { FileWarning } from "lucide-react"

export function ContentRequired({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border bg-secondary/30 px-6 py-12 text-center">
      <FileWarning className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
