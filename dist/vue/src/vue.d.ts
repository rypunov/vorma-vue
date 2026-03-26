import type { VNode } from "vue";
type VormaAppBase = Record<string, unknown>;
type VormaLoaderPattern<App> = string;
type VormaLoaderOutput<App, Pattern> = Record<string, unknown>;
export declare function VormaRootOutlet(): VNode;
export declare function useLocation(): Record<string, unknown>;
export declare function useRouterData(): Record<string, unknown>;
export declare function useLoaderData<App extends VormaAppBase = VormaAppBase, Pattern extends VormaLoaderPattern<App> = VormaLoaderPattern<App>>(): VormaLoaderOutput<App, Pattern> | Record<string, unknown>;
export {};
//# sourceMappingURL=vue.d.ts.map