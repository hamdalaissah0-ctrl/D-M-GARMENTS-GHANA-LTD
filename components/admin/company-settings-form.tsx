"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { updateCompanyProfile } from "@/lib/actions/settings"
import type { CompanyProfile } from "@/lib/supabase/queries"

export function CompanySettingsForm({ company }: { company: CompanyProfile }) {
  const [isPending, startTransition] = useTransition()
  const [companyName, setCompanyName] = useState(company.company_name)
  const [address, setAddress] = useState(company.address ?? "")
  const [phonePrimary, setPhonePrimary] = useState(company.phone_primary ?? "")
  const [phoneSecondary, setPhoneSecondary] = useState(company.phone_secondary ?? "")
  const [email, setEmail] = useState(company.email ?? "")
  const [whatsapp, setWhatsapp] = useState(company.whatsapp_number ?? "")
  const [footerText, setFooterText] = useState(company.footer_text ?? "")
  const [noMoq, setNoMoq] = useState(company.no_moq)
  const [logoUrl, setLogoUrl] = useState<string | null>(company.logo_url)

  function handleSubmit() {
    startTransition(async () => {
      try {
        await updateCompanyProfile({
          company_name: companyName,
          address: address || null,
          phone_primary: phonePrimary || null,
          phone_secondary: phoneSecondary || null,
          email: email || null,
          whatsapp_number: whatsapp || null,
          footer_text: footerText || null,
          no_moq: noMoq,
          logo_url: logoUrl,
        })
        toast.success("Company settings saved")
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to save settings")
      }
    })
  }

  return (
    <Card className="max-w-2xl">
      <CardContent className="space-y-5 p-6">
        <div className="space-y-1.5">
          <Label>Company Name</Label>
          <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Address</Label>
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Primary Phone</Label>
            <Input value={phonePrimary} onChange={(e) => setPhonePrimary(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Secondary Phone</Label>
            <Input value={phoneSecondary} onChange={(e) => setPhoneSecondary(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>WhatsApp Number</Label>
            <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Footer Text</Label>
          <Textarea value={footerText} onChange={(e) => setFooterText(e.target.value)} rows={2} />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={noMoq} onChange={(e) => setNoMoq(e.target.checked)} />
          No minimum order quantity
        </label>
        <ImageUploadField folder="branding" value={logoUrl} onChange={setLogoUrl} label="Logo" />
        <Button onClick={handleSubmit} disabled={isPending} className="w-full bg-brand-cta text-white">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : null} Save Settings
        </Button>
      </CardContent>
    </Card>
  )
}
