import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
	test("страница открывается и отдаёт успешный статус", async ({
		page,
		request,
	}) => {
		const res = await request.get("/");
		expect(res.ok(), `GET / должен быть 2xx, получено ${res.status()}`).toBe(
			true,
		);
		const response = await page.goto("/", { waitUntil: "networkidle" });
		expect(response?.ok()).toBeTruthy();
	});

	test("нет ошибок уровня error в консоли страницы", async ({ page }) => {
		const errors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") {
				errors.push(msg.text());
			}
		});
		page.on("pageerror", (err) => {
			errors.push(err.message);
		});

		await page.goto("/", { waitUntil: "domcontentloaded" });
		await page.waitForLoadState("networkidle").catch(() => undefined);

		expect(errors, `Ошибки в консоли: ${errors.join("\n")}`).toEqual([]);
	});

	test("в DOM есть корневой контейнер приложения Vorma", async ({ page }) => {
		await page.goto("/", { waitUntil: "domcontentloaded" });
		const root = page.locator("#vorma-root");
		await expect(root).toHaveCount(1);
	});
});
