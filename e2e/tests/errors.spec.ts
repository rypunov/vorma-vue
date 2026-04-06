import { expect, test } from "@playwright/test";

function looksLikeRouteError(text: string) {
	return (
		text.includes("Route Error:") ||
		text.includes("Error:") ||
		text.toLowerCase().includes("error")
	);
}

test.describe("обработка ошибок (опциональные e2e-маршруты)", () => {
	test("ошибка в loader показывает Error UI (если маршрут существует)", async ({
		page,
		request,
	}) => {
		const res = await request.get("/__e2e/error-loader");
		if (res.status() === 404) test.skip();

		await page.goto("/__e2e/error-loader", { waitUntil: "domcontentloaded" });
		const bodyText = (await page.locator("body").textContent()) ?? "";
		expect(looksLikeRouteError(bodyText)).toBe(true);
	});

	test("ошибка в action показывает Error UI (если маршрут существует)", async ({
		page,
		request,
	}) => {
		const res = await request.get("/__e2e/error-action");
		if (res.status() === 404) test.skip();

		await page.goto("/__e2e/error-action", { waitUntil: "domcontentloaded" });

		const button = page.locator("#e2e-error-action-button");
		await expect(button).toBeVisible();
		await button.click();

		const bodyText = (await page.locator("body").textContent()) ?? "";
		expect(looksLikeRouteError(bodyText)).toBe(true);
	});
});

