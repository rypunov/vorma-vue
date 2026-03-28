import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));

const vormaKitAlias = {
	debounce: "kit/_typescript/debounce/debounce.ts",
	json: "kit/_typescript/json/json.ts",
	listeners: "kit/_typescript/listeners/listeners.ts",
	"matcher/find-nested": "kit/_typescript/matcher/find_nested_matches.ts",
	"matcher/register": "kit/_typescript/matcher/register.ts",
	url: "kit/_typescript/url/url.ts",
} as const;

export default defineConfig({
	resolve: {
		alias: {
			"vorma/client": path.join(
				repoRoot,
				"internal/framework/_typescript/client/index.ts",
			),
			...Object.fromEntries(
				Object.entries(vormaKitAlias).map(([k, v]) => [
					`vorma/kit/${k}`,
					path.join(repoRoot, v),
				]),
			),
		},
	},
	test: { environment: "jsdom" },
});
