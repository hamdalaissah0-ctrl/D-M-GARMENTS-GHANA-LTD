// Weekly data backup for the free-tier Supabase project. Schema is already
// version-controlled via supabase/migrations/*.sql — this captures row data
// as JSON via the REST API (no Docker/pg_dump needed, works in any CI runner
// with just the project URL + service-role key). See docs/DECISIONS.md.
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/backup-data.mjs

import { mkdir, writeFile, readdir, rm } from "node:fs/promises"
import path from "node:path"

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set")
  process.exit(1)
}

// Business data worth restoring from. Deliberately excludes tables that are
// pure operational noise and regenerate themselves (rate_limit_events,
// audit_logs, notification_events, *_status_history) to keep backups small
// and focused on what you'd actually need to recover.
const TABLES = [
  "company_profile",
  "site_settings",
  "customers",
  "customer_contacts",
  "categories",
  "category_images",
  "products",
  "product_images",
  "product_options",
  "product_features",
  "services",
  "industries",
  "orders",
  "order_items",
  "order_files",
  "order_notes",
  "order_assignments",
  "quotes",
  "quote_items",
  "communications",
  "pages",
  "faqs",
  "testimonials",
  "portfolio_projects",
  "portfolio_images",
  "blog_posts",
  "seo_pages",
  "redirects",
  "contact_submissions",
  "profiles",
]

const KEEP_LAST_N_BACKUPS = 8 // ~2 months of weekly snapshots

async function fetchAllRows(table) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch ${table}: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

async function pruneOldBackups(backupsRoot) {
  const entries = await readdir(backupsRoot, { withFileTypes: true }).catch(() => [])
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort()
  const toRemove = dirs.slice(0, Math.max(0, dirs.length - KEEP_LAST_N_BACKUPS))
  for (const dir of toRemove) {
    await rm(path.join(backupsRoot, dir), { recursive: true, force: true })
    console.log(`Pruned old backup: ${dir}`)
  }
}

async function main() {
  const timestamp = new Date().toISOString().slice(0, 10)
  const backupsRoot = path.resolve("backups")
  const outDir = path.join(backupsRoot, timestamp)
  await mkdir(outDir, { recursive: true })

  let totalRows = 0
  for (const table of TABLES) {
    const rows = await fetchAllRows(table)
    totalRows += rows.length
    await writeFile(path.join(outDir, `${table}.json`), JSON.stringify(rows, null, 2))
    console.log(`  ${table}: ${rows.length} rows`)
  }

  await pruneOldBackups(backupsRoot)
  console.log(`Backup complete: ${timestamp} (${totalRows} total rows across ${TABLES.length} tables)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
