"use client"

import { Suspense, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

function PortfolioTabsInner({
  projects,
  videos,
}: {
  projects: ReactNode
  videos: ReactNode
}) {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") === "videos" ? "videos" : "projects"

  return (
    <Tabs defaultValue={initialTab}>
      <div className="flex justify-center">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="projects" className="mt-10">
        {projects}
      </TabsContent>
      <TabsContent value="videos" className="mt-10">
        {videos}
      </TabsContent>
    </Tabs>
  )
}

export function PortfolioTabs(props: { projects: ReactNode; videos: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <PortfolioTabsInner {...props} />
    </Suspense>
  )
}
