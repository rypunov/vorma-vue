import type { VormaAppBase, VormaLoaderPattern, VormaLoaderOutput } from "vorma/client";

export function VormaRootOutlet(): JSX.Element {
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
