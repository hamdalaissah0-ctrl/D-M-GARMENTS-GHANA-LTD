import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const SITE_NAME = "D&M Garments Ghana Limited"
const SITE_DESCRIPTION =
  "D&M Garments Ghana Limited manufactures hospitality, corporate, workwear and PPE uniforms with embroidery, DTF printing and branding — no minimum order quantity."
const OG_LOGO = "https://otscslkmvhunzlxfrqse.supabase.co/storage/v1/object/public/media/branding/dm-logo.png"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Uniform & Garment Manufacturing`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Uniform & Garment Manufacturing`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [{ url: OG_LOGO }],
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Uniform & Garment Manufacturing`,
    description: SITE_DESCRIPTION,
    images: [OG_LOGO],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
