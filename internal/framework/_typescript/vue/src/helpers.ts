/// <reference types="vite/client" />

import { computed, type ComputedRef, type VNode } from "vue";
import {
	__registerClientLoaderPattern,
	__runClientLoadersAfterHMRUpdate,
	__vormaClientGlobal,
	type ClientLoaderAwaitedServerData,
	type ParamsForPattern,
	type UseRouterDataFunction,
	type VormaAppBase,
	type VormaLoaderOutput,
	type VormaLoaderPattern,
	type VormaRouteGeneric,
	type VormaRoutePropsGeneric,
} from "vorma/client";
import {
	useClientLoadersData,
	useLoadersData,
	useRouterData,
} from "./vue.tsx";

export type VormaRouteProps<
	App extends VormaAppBase = any,
	Pattern extends VormaLoaderPattern<App> = string,
> = VormaRoutePropsGeneric<VNode, App, Pattern>;

export type VormaRoute<
	App extends VormaAppBase = any,
	Pattern extends VormaLoaderPattern<App> = string,
> = VormaRouteGeneric<VNode, App, Pattern>;

export function makeTypedUseRouterData<App extends VormaAppBase>() {
	return useRouterData as unknown as UseRouterDataFunction<App, false>;
}

export function makeTypedUseLoaderData<App extends VormaAppBase>() {
	return function useLoaderData<Pattern extends VormaLoaderPattern<App>>(
		props: VormaRouteProps<App, Pattern>,
	): ComputedRef<VormaLoaderOutput<App, Pattern>> {
		const loadersData = useLoadersData();
		return computed(() => loadersData.value[props.idx] as VormaLoaderOutput<
			App,
			Pattern
		>);
	};
}

export function makeTypedUsePatternLoaderData<App extends VormaAppBase>() {
	return function usePatternLoaderData<
		Pattern extends VormaLoaderPattern<App>,
	>(
		pattern: Pattern,
	): ComputedRef<VormaLoaderOutput<App, Pattern> | undefined> {
		const routerData = useRouterData();
		const loadersData = useLoadersData();
		const idx = computed(() =>
			routerData.value.matchedPatterns.findIndex(
				(p: VormaLoaderPattern<App>) => p === pattern,
			),
		);
		return computed(() => {
			const i = idx.value;
			if (i === -1) {
				return undefined;
			}
			return loadersData.value[i] as VormaLoaderOutput<App, Pattern>;
		});
	};
}

export function makeTypedAddClientLoader<App extends VormaAppBase>() {
	const m = __vormaClientGlobal.get("patternToWaitFnMap");
	return function addClientLoader<
		Pattern extends VormaLoaderPattern<App>,
		LoaderData extends VormaLoaderOutput<App, Pattern>,
		T = any,
	>(props: {
		pattern: Pattern;
		clientLoader: (props: {
			params: Record<ParamsForPattern<App, Pattern>, string>;
			splatValues: string[];
			serverDataPromise: Promise<
				ClientLoaderAwaitedServerData<App["rootData"], LoaderData>
			>;
			signal: AbortSignal;
		}) => Promise<T>;
		reRunOnModuleChange?: ImportMeta;
	}) {
		const p = props.pattern;
		const fn = props.clientLoader;

		__registerClientLoaderPattern(p as string).catch((error: unknown) => {
			console.error("Failed to register client loader pattern:", error);
		});
		(m as any)[p] = fn;

		if (import.meta.env.DEV && props.reRunOnModuleChange) {
			__runClientLoadersAfterHMRUpdate(props.reRunOnModuleChange, p);
		}

		type Res = Awaited<ReturnType<typeof fn>>;

		const useClientLoaderData = (
			routeProps?: VormaRouteProps<App, Pattern>,
		): ComputedRef<Res | undefined> => {
			const clientLoadersData = useClientLoadersData();
			const routerData = useRouterData();

			const idx = computed(() => {
				if (routeProps) {
					return routeProps.idx;
				}
				const matched = routerData.value.matchedPatterns;
				return matched.findIndex(
					(pat: VormaLoaderPattern<App>) => pat === p,
				);
			});

			return computed(() => {
				const i = idx.value;
				if (i === -1) return undefined;
				return clientLoadersData.value[i] as Res | undefined;
			});
		};

		return useClientLoaderData as {
			(props: VormaRouteProps<App, Pattern>): ComputedRef<Res>;
			(): ComputedRef<Res | undefined>;
		};
	};
}
