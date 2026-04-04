import { expect, test } from "@playwright/test";

/**
 * Проверяет шаблон приложения Vorma (home / links в навигации).
 * Если разметка другая — поправьте селекторы под своё приложение.
 */
test.describe("навигация (шаблон по умолчанию)", () => {
	test("переход по ссылке «links» и возврат на «home»", async ({ page }) => {
		await page.goto("/", { waitUntil: "networkidle" });

		const linksNav = page.getByRole("link", { name: "links" });
		if ((await linksNav.count()) === 0) {
			test.skip();
			return;
		}

		await linksNav.click();
		await expect(page).toHaveURL(/links/);

		const homeNav = page.getByRole("link", { name: "home" });
		await homeNav.click();
		await expect(page).toHaveURL(/\/$/);
	});
});
