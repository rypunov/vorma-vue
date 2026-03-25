import type { VNode } from "vue";

type VormaAppBase = Record<string, unknown>;
type VormaLoaderPattern<App> = string;
type VormaLoaderOutput<App, Pattern> = Record<string, unknown>;

export function VormaRootOutlet(): VNode {
	return <div>Vue VormaRootOutlet</div>;
}

export function useLocation(): Record<string, unknown> {
	return {};
}

export function useRouterData(): Record<string, unknown> {
	return {};
}

export function useLoaderData<
	App extends VormaAppBase = VormaAppBase,
	Pattern extends VormaLoaderPattern<App> = VormaLoaderPattern<App>,
>(): VormaLoaderOutput<App, Pattern> | Record<string, unknown> {
	return {};
}
