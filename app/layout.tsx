import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "D&M Garments Ghana Limited — Uniform & Garment Manufacturing",
    template: "%s | D&M Garments Ghana Limited",
  },
  description:
    "D&M Garments Ghana Limited manufactures hospitality, corporate, workwear and PPE uniforms with embroidery, DTF printing and branding — no minimum order quantity.",
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
