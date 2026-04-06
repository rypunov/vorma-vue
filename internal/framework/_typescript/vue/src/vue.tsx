import {
	computed,
	defineComponent,
	h,
	ref,
	shallowRef,
	watch,
	watchEffect,
	watchPostEffect,
	type Component,
} from "vue";
import {
	__applyScrollState,
	addLocationListener,
	addRouteChangeListener,
	__vormaClientGlobal as ctx,
	getLocation,
	getRouterData,
	type RouteChangeEvent,
} from "vorma/client";

/////////////////////////////////////////////////////////////////////
/////// STORE (same external store pattern as React)
/////////////////////////////////////////////////////////////////////

type NavigationState = {
	latestEvent: RouteChangeEvent | null;
	loadersData: any;
	clientLoadersData: any;
	routerData: ReturnType<typeof getRouterData>;
	outermostError: any;
	outermostErrorIdx: number | undefined;
	activeComponents: any[] | null;
	activeErrorBoundary: any;
	importURLs: string[];
	exportKeys: string[];
};

type StoreState = {
	navigation: NavigationState;
	location: ReturnType<typeof getLocation>;
};

function getInitialState(): StoreState {
	return {
		navigation: {
			latestEvent: null,
			loadersData: ctx.get("loadersData"),
			clientLoadersData: ctx.get("clientLoadersData"),
			routerData: getRouterData(),
			outermostError: ctx.get("outermostError"),
			outermostErrorIdx: ctx.get("outermostErrorIdx"),
			activeComponents: ctx.get("activeComponents"),
			activeErrorBoundary: ctx.get("activeErrorBoundary"),
			importURLs: ctx.get("importURLs"),
			exportKeys: ctx.get("exportKeys"),
		},
		location: getLocation(),
	};
}

let state = getInitialState();
const listeners = new Set<() => void>();

const store = {
	getSnapshot: (): StoreState => state,
	subscribe: (listener: () => void) => {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
	setState: (updater: (prevState: StoreState) => StoreState) => {
		const nextState = updater(state);
		if (nextState !== state) {
			state = nextState;
			listeners.forEach((listener) => listener());
		}
	},
};

function useStoreSnapshot() {
	const snapshot = shallowRef(store.getSnapshot());
	watchEffect((onCleanup) => {
		const unsub = store.subscribe(() => {
			snapshot.value = store.getSnapshot();
		});
		onCleanup(unsub);
	});
	return snapshot;
}

export function useLoadersData() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.loadersData);
}

export function useClientLoadersData() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.clientLoadersData);
}

export function useRouterData() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.routerData);
}

function useLatestEvent() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.latestEvent);
}

function useOutermostError() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.outermostError);
}

function useOutermostErrorIdx() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.outermostErrorIdx);
}

function useActiveComponents() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.activeComponents);
}

function useActiveErrorBoundary() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.activeErrorBoundary);
}

function useImportURLs() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.importURLs);
}

function useExportKeys() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.navigation.exportKeys);
}

let isInited = false;

function initUIListeners() {
	if (isInited) return;
	isInited = true;

	addRouteChangeListener((e) => {
		store.setState((prev) => {
			return {
				...prev,
				navigation: {
					latestEvent: e,
					loadersData: ctx.get("loadersData"),
					clientLoadersData: ctx.get("clientLoadersData"),
					routerData: getRouterData(),
					outermostError: ctx.get("outermostError"),
					outermostErrorIdx: ctx.get("outermostErrorIdx"),
					activeComponents: ctx.get("activeComponents"),
					activeErrorBoundary: ctx.get("activeErrorBoundary"),
					importURLs: ctx.get("importURLs"),
					exportKeys: ctx.get("exportKeys"),
				},
			};
		});
	});

	addLocationListener(() => {
		store.setState((prev) => {
			return {
				...prev,
				location: getLocation(),
			};
		});
	});
}

export function useLocation() {
	const snap = useStoreSnapshot();
	return computed(() => snap.value.location);
}

let didSeedRootNavigation = false;

function seedRootNavigationOnce() {
	if (didSeedRootNavigation) return;
	didSeedRootNavigation = true;
	store.setState((prev) => {
		return {
			...prev,
			navigation: {
				latestEvent: null,
				loadersData: ctx.get("loadersData"),
				clientLoadersData: ctx.get("clientLoadersData"),
				routerData: getRouterData(),
				outermostError: ctx.get("outermostError"),
				outermostErrorIdx: ctx.get("outermostErrorIdx"),
				activeComponents: ctx.get("activeComponents"),
				activeErrorBoundary: ctx.get("activeErrorBoundary"),
				importURLs: ctx.get("importURLs"),
				exportKeys: ctx.get("exportKeys"),
			},
		};
	});
}

/////////////////////////////////////////////////////////////////////
/////// COMPONENT
/////////////////////////////////////////////////////////////////////

let VormaRootOutlet: Component;

VormaRootOutlet = defineComponent({
	name: "VormaRootOutlet",
	inheritAttrs: false,
	props: {
		idx: { type: Number, default: 0 },
	},
	setup(props, { attrs }) {
		if (props.idx === 0) {
			initUIListeners();
			seedRootNavigationOnce();
		}

		const latestEvent = useLatestEvent();
		const loadersData = useLoadersData();
		const outermostError = useOutermostError();
		const outermostErrorIdx = useOutermostErrorIdx();
		const activeComponents = useActiveComponents();
		const activeErrorBoundary = useActiveErrorBoundary();
		const importURLs = useImportURLs();
		const exportKeys = useExportKeys();

		const currentImportURL = ref<string | undefined>(
			importURLs.value[props.idx],
		);
		const currentExportKey = ref<string | undefined>(
			exportKeys.value[props.idx],
		);
		const nextImportURL = ref<string | undefined>(
			importURLs.value[props.idx + 1],
		);
		const nextExportKey = ref<string | undefined>(
			exportKeys.value[props.idx + 1],
		);

		watch(
			[latestEvent, importURLs, exportKeys],
			() => {
				const e = latestEvent.value;
				if (!currentImportURL.value || !e) {
					return;
				}

				const newCurrentImportURL = importURLs.value[props.idx];
				const newCurrentExportKey = exportKeys.value[props.idx];

				if (currentImportURL.value !== newCurrentImportURL) {
					currentImportURL.value = newCurrentImportURL;
				}
				if (currentExportKey.value !== newCurrentExportKey) {
					currentExportKey.value = newCurrentExportKey;
				}

				const newNextImportURL = importURLs.value[props.idx + 1];
				const newNextExportKey = exportKeys.value[props.idx + 1];

				if (nextImportURL.value !== newNextImportURL) {
					nextImportURL.value = newNextImportURL;
				}
				if (nextExportKey.value !== newNextExportKey) {
					nextExportKey.value = newNextExportKey;
				}
			},
			{ deep: true },
		);

		watchPostEffect(() => {
			const e = latestEvent.value;
			if (!e || props.idx !== 0) {
				return;
			}
			window.requestAnimationFrame(() => {
				__applyScrollState(e.detail.__scrollState);
			});
		});

		const isErrorIdxMemo = computed(
			() => props.idx === outermostErrorIdx.value,
		);

		const CurrentCompMemo = computed(() => {
			if (isErrorIdxMemo.value) {
				return null;
			}
			currentImportURL.value;
			currentExportKey.value;
			return activeComponents.value?.[props.idx] ?? null;
		});

		const Outlet = (localProps: Record<string, any> | undefined) =>
			h(
				VormaRootOutlet,
				Object.assign({}, attrs, localProps || {}, {
					idx: props.idx + 1,
					key: `${importURLs.value[props.idx + 1] ?? ""}|${
						exportKeys.value[props.idx + 1] ?? ""
					}`,
				}),
			);

		const shouldFallbackOutletMemo = computed(() => {
			if (isErrorIdxMemo.value) {
				return false;
			}
			if (CurrentCompMemo.value) {
				return false;
			}
			return props.idx + 1 < loadersData.value.length;
		});

		const ErrorCompMemo = computed(() => {
			if (!isErrorIdxMemo.value) {
				return null;
			}
			return activeErrorBoundary.value ?? null;
		});

		return () => {
			if (isErrorIdxMemo.value) {
				const EC = ErrorCompMemo.value;
				if (EC) {
					return h(EC, { error: outermostError.value });
				}
				return `Error: ${outermostError.value ?? "unknown"}`;
			}

			const Cur = CurrentCompMemo.value;
			if (!Cur) {
				if (shouldFallbackOutletMemo.value) {
					return Outlet(undefined);
				}
				return null;
			}

			const routerData = getRouterData();
			return h(Cur, { 
				idx: props.idx, 
				Outlet,
				params: routerData.params,
				routerData: routerData,
			});
		};
	},
});

export { VormaRootOutlet };
