import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ContactMessageControls } from "@/components/admin/contact-message-controls"
import { getContactSubmissions } from "@/lib/supabase/queries"

export default async function AdminMessagesPage() {
  const messages = await getContactSubmissions()

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="p-0">
          {messages.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">No contact messages yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{m.full_name}</p>
                      {m.handled ? (
                        <Badge className="bg-primary/10 text-primary">Handled</Badge>
                      ) : (
                        <Badge className="bg-secondary text-secondary-foreground">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {[m.phone, m.email].filter(Boolean).join(" · ")}
                    </p>
                    <p className="text-sm text-foreground">{m.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </p>
                  </div>
                  <ContactMessageControls id={m.id} handled={m.handled} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
