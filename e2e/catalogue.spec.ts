import { test, expect } from "@playwright/test"

test("products page lists categories and opens one", async ({ page }) => {
  await page.goto("/products")

  const firstCategory = page.locator('a[href^="/products/"]').first()
  await expect(firstCategory).toBeVisible()
  await firstCategory.click()

  await expect(page).toHaveURL(/\/products\/[^/]+$/)
  // The quick-order form's required fields must be present.
  await expect(page.getByText(/quantity/i).first()).toBeVisible()
  await expect(page.getByLabel(/your name/i)).toBeVisible()
  await expect(page.getByLabel(/phone number/i).first()).toBeVisible()
})

test("quick order submit is disabled until Turnstile verification completes", async ({ page }) => {
  await page.goto("/products")
  await page.locator('a[href^="/products/"]').first().click()

  const submitButton = page.getByRole("button", { name: /submit order/i })
  await expect(submitButton).toBeVisible()
  await expect(submitButton).toBeDisabled()
})
