import { defineComponent } from 'vue';

export declare const VormaRootOutlet: ReturnType<typeof defineComponent>;
export declare const VormaLink: ReturnType<typeof defineComponent>;

export declare function useLocation(): Record<string, unknown>;
export declare function useRouterData(): Record<string, unknown>;
export declare function useLoaderData(): Record<string, unknown>;

export declare function makeTypedUseRouterData(): () => Record<string, unknown>;
export declare function makeTypedUseLoaderData(): () => Record<string, unknown>;
export declare function makeTypedUsePatternLoaderData(): () => Record<string, unknown>;
export declare function makeTypedAddClientLoader(): () => void;
export declare function makeTypedLink(): (props: any) => any;