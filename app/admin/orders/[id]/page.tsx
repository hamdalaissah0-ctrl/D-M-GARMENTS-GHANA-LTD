import { notFound } from "next/navigation"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { OrderWorkspace } from "@/components/admin/order-workspace"
import { getOrderDetail, getOrderFileSignedUrl, getStaffProfiles } from "@/lib/supabase/queries"
import type { OrderStatus } from "@/lib/order-status"

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [detail, staff] = await Promise.all([getOrderDetail(id), getStaffProfiles()])

  if (!detail) notFound()

  const filesWithUrls = await Promise.all(
    detail.files.map(async (file) => ({
      ...file,
      signedUrl: await getOrderFileSignedUrl(file.storage_path),
    }))
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{detail.order.order_number}</h1>
          <p className="text-sm text-muted-foreground">
            Submitted {new Date(detail.order.created_at).toLocaleString()}
          </p>
        </div>
        <OrderStatusBadge status={detail.order.status as OrderStatus} />
      </div>

      <OrderWorkspace
        order={detail.order}
        items={detail.items}
        files={filesWithUrls}
        notes={detail.notes}
        history={detail.history}
        communications={detail.communications}
        notifications={detail.notifications}
        staff={staff}
      />
    </div>
  )
}
