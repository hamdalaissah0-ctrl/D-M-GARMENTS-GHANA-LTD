import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoryFormDialog } from "@/components/admin/category-form-dialog"
import { createClient } from "@/lib/supabase/server"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <CategoryFormDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          {!categories || categories.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No categories yet — create one to start building the catalogue.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{category.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {category.description ?? "No description"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        category.status === "published"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }
                    >
                      {category.status}
                    </Badge>
                    <CategoryFormDialog category={category} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
