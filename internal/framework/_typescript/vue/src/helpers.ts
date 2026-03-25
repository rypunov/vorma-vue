/// <reference types="vite/client" />

import type { VNode } from "vue";

type VormaAppBase = { rootData?: Record<string, unknown> };
type VormaLoaderPattern<App> = string;
type VormaLoaderOutput<App, Pattern> = Record<string, unknown>;
type VormaRoutePropsGeneric<
	El,
	App extends VormaAppBase,
	Pattern extends VormaLoaderPattern<App>,
> = {
	idx: number;
	pattern?: Pattern;
};
type VormaRouteGeneric<
	El,
	App extends VormaAppBase,
	Pattern extends VormaLoaderPattern<App>,
> = {
	component?: (props: VormaRoutePropsGeneric<El, App, Pattern>) => El;
};

export type VormaRouteProps<
	App extends VormaAppBase = any,
	Pattern extends VormaLoaderPattern<App> = string,
> = VormaRoutePropsGeneric<VNode, App, Pattern>;

export type VormaRoute<
	App extends VormaAppBase = any,
	Pattern extends VormaLoaderPattern<App> = string,
> = VormaRouteGeneric<VNode, App, Pattern>;

export function makeTypedUseRouterData<App extends VormaAppBase>() {
	return () => ({}) as App["rootData"];
}

export function makeTypedUseLoaderData<App extends VormaAppBase>() {
	return function useLoaderData<Pattern extends VormaLoaderPattern<App>>(): VormaLoaderOutput<
		App,
		Pattern
	> {
		return {} as VormaLoaderOutput<App, Pattern>;
	};
}

export function makeTypedUsePatternLoaderData<App extends VormaAppBase>() {
	return function usePatternLoaderData<
		Pattern extends VormaLoaderPattern<App>,
	>(): VormaLoaderOutput<App, Pattern> {
		return {} as VormaLoaderOutput<App, Pattern>;
	};
}

export function makeTypedAddClientLoader<App extends VormaAppBase>() {
	return function addClientLoader<
		Pattern extends VormaLoaderPattern<App>,
		LoaderData extends VormaLoaderOutput<App, Pattern>,
		T = any,
	>(_props: {
		pattern: Pattern;
		clientLoader: (props: {
			params: Record<string, string>;
			splatValues: string[];
			serverDataPromise: Promise<LoaderData>;
			signal: AbortSignal;
		}) => Promise<T>;
		reRunOnModuleChange?: ImportMeta;
	}) {
		return () => {};
	};
}
