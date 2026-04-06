import { expect, test } from "@playwright/test";

test.describe("nested routing (опциональные e2e-маршруты)", () => {
	test("/users и /users/123 рендерятся корректно (если маршруты существуют)", async ({
		page,
		request,
	}) => {
		const res = await request.get("/users");
		if (res.status() === 404) test.skip();

		await page.goto("/users", { waitUntil: "domcontentloaded" });
		await expect(page.locator("#users-wrapper")).toBeVisible();

		await page.goto("/users/123", { waitUntil: "domcontentloaded" });
		await expect(page.locator("#user-wrapper")).toBeVisible();
		await expect(page.locator("#user-id")).toHaveText("123");
	});
});

