import type { VNode } from "vue";

type VormaAppBase = Record<string, unknown>;
type VormaLoaderPattern<App> = string;
type ExtractApp<C> = C extends { app: infer A extends VormaAppBase }
	? A
	: VormaAppBase;
type PermissivePatternBasedProps<
	App extends VormaAppBase,
	Pattern extends VormaLoaderPattern<App>,
> = {
	pattern?: Pattern;
	params?: Record<string, string>;
	splatValues?: string[];
};
type VormaAppConfig = Record<string, unknown>;

type BasicLinkProps = {
	to: string;
	children?: VNode | string;
};

export function VormaLink(props: BasicLinkProps): VNode {
	return <a href={props.to}>{props.children}</a>;
}

type TypedVormaLinkProps<
	App extends VormaAppBase,
	Pattern extends VormaLoaderPattern<App> = VormaLoaderPattern<App>,
> = PermissivePatternBasedProps<App, Pattern> & {
	to?: string;
	children?: VNode | string;
};

export function makeTypedLink<C extends VormaAppConfig>(
	_vormaAppConfig: C,
	_defaultProps?: Partial<TypedVormaLinkProps<ExtractApp<C>>>,
) {
	return function TypedLink<Pattern extends VormaLoaderPattern<ExtractApp<C>>>(
		_props: TypedVormaLinkProps<ExtractApp<C>, Pattern>,
	): VNode {
		return <a href={"#"}>{_props.children}</a>;
	};
}
