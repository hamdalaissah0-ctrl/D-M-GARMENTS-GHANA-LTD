import { test, expect } from "@playwright/test"

test("desktop nav links reach the right pages", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop nav is hidden behind the hamburger menu on mobile — see mobile-nav test")
  await page.goto("/")

  await page.getByRole("link", { name: "Services", exact: true }).first().click()
  await expect(page).toHaveURL(/\/products$/)

  await page.goto("/")
  await page.getByRole("link", { name: "Portfolio", exact: true }).first().click()
  await expect(page).toHaveURL(/\/portfolio$/)

  await page.goto("/")
  await page.getByRole("link", { name: "About", exact: true }).first().click()
  await expect(page).toHaveURL(/\/about$/)

  await page.goto("/")
  await page.getByRole("link", { name: "Contact", exact: true }).first().click()
  await expect(page).toHaveURL(/\/contact$/)
})

test("footer links to the track page", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: /track your order/i }).click()
  await expect(page).toHaveURL(/\/track$/)
})

test("unknown route shows the 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist")
  expect(response?.status()).toBe(404)
})
