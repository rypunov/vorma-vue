import type {
	ExtractApp,
	PermissivePatternBasedProps,
	VormaAppBase,
	VormaLoaderPattern,
} from "vorma/client";
import type { VormaAppConfig } from "vorma/client";

type BasicLinkProps = {
	to: string;
	children?: JSX.Element | string;
};

export function VormaLink(props: BasicLinkProps): JSX.Element {
	return <a href={props.to}>{props.children}</a>;
}

type TypedVormaLinkProps<
	App extends VormaAppBase,
	Pattern extends VormaLoaderPattern<App> = VormaLoaderPattern<App>,
> = PermissivePatternBasedProps<App, Pattern> & {
	to?: string;
	children?: JSX.Element | string;
};

export function makeTypedLink<C extends VormaAppConfig>(
	_vormaAppConfig: C,
	_defaultProps?: Partial<TypedVormaLinkProps<ExtractApp<C>>>,
) {
	return function TypedLink<Pattern extends VormaLoaderPattern<ExtractApp<C>>>(
		_props: TypedVormaLinkProps<ExtractApp<C>, Pattern>,
	): JSX.Element {
		return <a href={"#"}>{_props.children}</a>;
	};
}
