export function VormaLink(props) {
    return <a href={props.to}>{props.children}</a>;
}
export function makeTypedLink(_vormaAppConfig, _defaultProps) {
    return function TypedLink(_props) {
        return <a href={"#"}>{_props.children}</a>;
    };
}
