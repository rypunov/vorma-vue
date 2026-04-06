import { expect, test } from "@playwright/test";

test.describe("SSR + hydration (шаблон по умолчанию)", () => {
	test("SSR: HTML содержит встроенные данные и не пустой #vorma-root", async ({
		request,
	}) => {
		const res = await request.get("/");
		expect(res.ok()).toBe(true);
		const html = await res.text();

		// SSR-скрипт с данными (см. internal/framework/ssr.go)
		expect(html).toContain('Symbol.for("__vorma_internal__")');
		expect(html).toContain("x.loadersData");

		// Корневой контейнер присутствует; для SSR ожидаем, что он не пустой.
		// (Если приложение выключило SSR, этот assert будет падать — это сигнал регрессии.)
		expect(html).toMatch(/id="vorma-root"[^>]*>[\s\S]*<\//);
	});

	test("гидратация: кнопка инкремента работает после загрузки", async ({
		page,
	}) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });

		const count = page.locator("#count");
		const button = page.locator("#increment-button");

		// ждём, что UI реально смонтирован
		await expect(count).toBeVisible();
		await expect(button).toBeVisible();

		const beforeRaw = (await count.textContent())?.trim() ?? "";
		const before = Number.parseInt(beforeRaw, 10);
		expect(Number.isFinite(before)).toBe(true);

		await button.click();

		// action делает submit → навигация/ревалидация → loader отдаёт новый count
		await expect
			.poll(async () => {
				const raw = (await count.textContent())?.trim() ?? "";
				return Number.parseInt(raw, 10);
			})
			.toBe(before + 1);
	});
});

