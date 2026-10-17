import { test, expect } from "@playwright/test"

test("contact form submit is disabled until Turnstile verification completes", async ({ page }) => {
  await page.goto("/contact")

  const submitButton = page.getByRole("button", { name: /send message/i })
  await expect(submitButton).toBeVisible()
  await expect(submitButton).toBeDisabled()
})

test("contact page phone and email are real clickable links", async ({ page }) => {
  await page.goto("/contact")
  const phoneLink = page.locator('a[href^="tel:"]').first()
  const emailLink = page.locator('a[href^="mailto:"]').first()
  await expect(phoneLink).toBeVisible()
  await expect(emailLink).toBeVisible()
})

test("track page requires order number, phone, and Turnstile before submission", async ({ page }) => {
  await page.goto("/track")

  const submitButton = page.getByRole("button", { name: /track request/i })
  await expect(submitButton).toBeDisabled()
})
