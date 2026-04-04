import { defineConfig, devices } from "@playwright/test";

/**
 * URL приложения под тестами. По умолчанию ожидается dev-сервер на localhost.
 * Пример: BASE_URL=http://127.0.0.1:8080 pnpm test
 */
const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
	testDir: "./tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		["list"],
		["html", { open: "never", outputFolder: "playwright-report" }],
	],
	use: {
		baseURL,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
		video: "retain-on-failure",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
});
