import { defineComponent, h } from 'vue';

export const VormaRootOutlet = defineComponent({
  name: 'VormaRootOutlet',
  setup() {
    return () => h('div', 'Vue VormaRootOutlet');
  }
});

export const VormaLink = defineComponent({
  name: 'VormaLink',
  props: ['to'],
  setup(props, { slots }) {
    return () => h('a', { href: props.to }, slots.default?.());
  }
});

export const useLocation = () => ({});
export const useRouterData = () => ({});
export const useLoaderData = () => ({});

export const makeTypedUseRouterData = () => () => ({});
export const makeTypedUseLoaderData = () => () => ({});
export const makeTypedUsePatternLoaderData = () => () => ({});
export const makeTypedAddClientLoader = () => () => ({});
export const makeTypedLink = () => (props) => h('a', { href: '#' }, props.children);