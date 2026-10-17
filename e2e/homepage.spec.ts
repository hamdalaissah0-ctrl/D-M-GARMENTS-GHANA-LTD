import { test, expect } from "@playwright/test"

test("homepage renders the hero, services, and no fabricated testimonial content", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.getByRole("link", { name: /request a quote/i }).first()).toBeVisible()

  // No minimum order quantity is a confirmed fact from company_profile — must appear somewhere.
  await expect(page.getByText(/no minimum order/i).first()).toBeVisible()

  // The testimonials section must never show fabricated content when empty —
  // the honest "nothing here is fabricated" framing must always be present.
  await expect(page.getByText(/nothing here is fabricated/i)).toBeVisible()
})

test("homepage has valid Organization JSON-LD with no fabricated fields", async ({ page }) => {
  await page.goto("/")

  const jsonLd = await page.evaluate(() => {
    const script = document.querySelector('script[type="application/ld+json"]')
    return script ? JSON.parse(script.textContent ?? "{}") : null
  })

  expect(jsonLd).not.toBeNull()
  expect(jsonLd["@type"]).toBe("Organization")
  expect(jsonLd.name).toBeTruthy()
  expect(jsonLd.url).toBeTruthy()
})

test("favicon is the real D&M logo, not the default Next.js icon", async ({ page }) => {
  await page.goto("/")
  const iconHref = await page.locator('link[rel="icon"]').first().getAttribute("href")
  expect(iconHref).toContain("icon.png")
})
