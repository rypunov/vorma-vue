import { beforeAll, describe, expect, it } from "vitest";
import { createPatternRegistry } from "vorma/kit/matcher/register";
import { VORMA_SYMBOL } from "../client/src/vorma_ctx/vorma_ctx.ts";

describe("vorma/vue adapter", () => {
	let VormaRootOutlet: unknown;
	let VormaLink: unknown;
	let makeTypedLink: unknown;
	let makeTypedUseRouterData: unknown;

	beforeAll(async () => {
		(globalThis as any)[VORMA_SYMBOL] = {
			buildID: "1",
			matchedPatterns: [],
			importURLs: [],
			exportKeys: [],
			errorExportKeys: [],
			loadersData: [],
			params: {},
			splatValues: [],
			hasRootData: false,
			activeComponents: [],
			activeErrorBoundary: undefined,
			outermostError: undefined,
			outermostErrorIdx: undefined,
			clientLoadersData: [],
			patternToWaitFnMap: {},
			viteDevURL: "",
			publicPathPrefix: "",
			patternRegistry: createPatternRegistry(),
			isDev: false,
			isTouchDevice: false,
			useViewTransitions: false,
			deploymentID: "",
			vormaAppConfig: {} as any,
			routeManifestURL: "",
			routeManifest: undefined,
			clientModuleMap: {},
			defaultErrorBoundary: () => null,
		};

		const mod = await import("./index.tsx");
		VormaRootOutlet = mod.VormaRootOutlet;
		VormaLink = mod.VormaLink;
		makeTypedLink = mod.makeTypedLink;
		makeTypedUseRouterData = mod.makeTypedUseRouterData;
	});

	it("exports VormaRootOutlet", () => {
		expect(VormaRootOutlet).toBeDefined();
	});

	it("exports VormaLink", () => {
		expect(VormaLink).toBeDefined();
	});

	it("exports makeTypedLink", () => {
		expect(typeof makeTypedLink).toBe("function");
	});

	it("makeTypedUseRouterData returns a function", () => {
		const useRD = (makeTypedUseRouterData as <App = unknown>() => unknown)();
		expect(typeof useRD).toBe("function");
	});
});
