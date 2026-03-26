/// <reference types="vite/client" />
export function makeTypedUseRouterData() {
    return () => ({});
}
export function makeTypedUseLoaderData() {
    return function useLoaderData() {
        return {};
    };
}
export function makeTypedUsePatternLoaderData() {
    return function usePatternLoaderData() {
        return {};
    };
}
export function makeTypedAddClientLoader() {
    return function addClientLoader(_props) {
        return () => { };
    };
}
