import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          We couldn&apos;t find that page.
        </h1>
        <div className="flex flex-wrap justify-center gap-3">
          <Button nativeButton={false} render={<Link href="/">Go Home</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link href="/products">Browse Products</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link href="/order">Request a Quote</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link href="/contact">Contact D&amp;M</Link>} />
        </div>
      </main>
    </>
  )
}
