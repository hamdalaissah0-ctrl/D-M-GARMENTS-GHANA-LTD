import { test, expect } from "@playwright/test"

test("mobile menu toggles open and navigates", async ({ page, isMobile }) => {
  test.skip(!isMobile, "only meaningful on the mobile viewport/project")

  await page.goto("/")
  await page.getByRole("button", { name: /toggle menu/i }).click()
  await page.getByRole("link", { name: "Contact", exact: true }).click()
  await expect(page).toHaveURL(/\/contact$/)
})
