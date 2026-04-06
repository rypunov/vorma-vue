import { expect, test } from "@playwright/test";

test.describe("loaders + actions (шаблон по умолчанию)", () => {
	test("loader: счётчик отображается числом (не пусто)", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const count = page.locator("#count");
		await expect(count).toBeVisible();

		const raw = (await count.textContent())?.trim() ?? "";
		const n = Number.parseInt(raw, 10);
		expect(Number.isFinite(n)).toBe(true);
	});

	test("loader: /links отдаёт href для docs", async ({ page }) => {
		await page.goto("/links", { waitUntil: "domcontentloaded" });

		const docs = page.locator("#docs-link");
		await expect(docs).toBeVisible();
		await expect(docs).toHaveAttribute("href", /vorma\.dev\/docs/);
	});

	test("action: инкремент меняет UI (count++)", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });

		const count = page.locator("#count");
		const button = page.locator("#increment-button");
		await expect(count).toBeVisible();
		await expect(button).toBeVisible();

		const beforeRaw = (await count.textContent())?.trim() ?? "";
		const before = Number.parseInt(beforeRaw, 10);
		expect(Number.isFinite(before)).toBe(true);

		await button.click();

		await expect
			.poll(async () => {
				const raw = (await count.textContent())?.trim() ?? "";
				return Number.parseInt(raw, 10);
			})
			.toBe(before + 1);
	});
});

