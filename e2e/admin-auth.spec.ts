import { test, expect } from "@playwright/test"

test("unauthenticated visitor is redirected away from /admin", async ({ page }) => {
  await page.goto("/admin")
  await expect(page).toHaveURL(/\/auth\/login/)
})

test("unauthenticated visitor is redirected away from a nested admin route", async ({ page }) => {
  await page.goto("/admin/orders")
  await expect(page).toHaveURL(/\/auth\/login/)
})

test("login page renders without exposing a way around auth", async ({ page }) => {
  await page.goto("/auth/login")
  await expect(page).toHaveURL(/\/auth\/login/)
  await expect(page.locator('input[type="password"]')).toBeVisible()
})
