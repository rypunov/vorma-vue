import { computed, defineComponent, h } from "vue";
import type {
	ExtractApp,
	PermissivePatternBasedProps,
	VormaAppBase,
	VormaLoaderPattern,
} from "vorma/client";
import {
	__makeFinalLinkProps,
	__resolvePath,
	type VormaAppConfig,
	type VormaLinkPropsBase,
} from "vorma/client";

function omitLinkMeta(raw: Record<string, unknown>) {
	const {
		prefetch: _p,
		scrollToTop: _s,
		replace: _r,
		state: _st,
		pattern: _pat,
		params: _par,
		splatValues: _sp,
		search: _se,
		hash: _h,
		children: _ch,
		...rest
	} = raw;
	return rest;
}

export const VormaLink = defineComponent({
	name: "VormaLink",
	inheritAttrs: false,
	setup(_, { attrs, slots }) {
		return () => {
			const raw = { ...attrs } as Record<string, unknown>;
			const final = __makeFinalLinkProps(raw);
			const rest = omitLinkMeta(raw);

			return h(
				"a",
				{
					...rest,
					"data-external": final.dataExternal,
					onPointerEnter: final.onPointerEnter,
					onFocus: final.onFocus,
					onPointerLeave: final.onPointerLeave,
					onBlur: final.onBlur,
					onTouchCancel: final.onTouchCancel,
					onClick: final.onClick,
				},
				slots.default?.(),
			);
		};
	},
}) as new () => {
	$props: Record<string, unknown> &
		VormaLinkPropsBase<(e: MouseEvent) => void | Promise<void>>;
};

type TypedVormaLinkProps<
	App extends VormaAppBase,
	Pattern extends VormaLoaderPattern<App> = VormaLoaderPattern<App>,
> = Omit<Record<string, unknown>, "href" | "pattern"> &
	VormaLinkPropsBase<(e: MouseEvent) => void | Promise<void>> &
	PermissivePatternBasedProps<App, Pattern> & {
		search?: string;
		hash?: string;
	};

export function makeTypedLink<C extends VormaAppConfig>(
	vormaAppConfig: C,
	defaultProps?: Partial<
		Omit<
			TypedVormaLinkProps<ExtractApp<C>>,
			"pattern" | "params" | "splatValues"
		>
	>,
) {
	return defineComponent({
		name: `TypedLink(${(defaultProps && Object.keys(defaultProps).join(", ")) || ""})`,
		inheritAttrs: false,
		setup(_, { attrs, slots }) {
			const merged = computed(() => ({
				...(defaultProps as Record<string, unknown>),
				...(attrs as Record<string, unknown>),
			}));

			const href = computed(() => {
				const m = merged.value;
				const pattern = m.pattern;
				const params = m.params;
				const splatValues = m.splatValues;
				const search = m.search;
				const hash = m.hash;

				const loaderProps: Record<string, unknown> = { pattern };
				if (params !== undefined && params !== null) {
					loaderProps.params = params;
				}
				if (splatValues !== undefined && splatValues !== null) {
					loaderProps.splatValues = splatValues;
				}

				const basePath = __resolvePath({
					vormaAppConfig,
					type: "loader",
					props: loaderProps as {
						pattern: string;
						params?: Record<string, string>;
						splatValues?: string[];
					},
				});
				const url = new URL(basePath, window.location.origin);
				if (search !== undefined) url.search = String(search);
				if (hash !== undefined) url.hash = String(hash);
				return url.href;
			});

			return () => {
				const m = merged.value;
				const {
					pattern: _pat,
					params: _par,
					splatValues: _sp,
					search: _se,
					hash: _ha,
					state,
					children: _ch,
					...linkFields
				} = m;

				return h(VormaLink, { ...linkFields, href: href.value, state }, () =>
					slots.default?.() ?? _ch,
				);
			};
		},
	});
}
