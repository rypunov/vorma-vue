// internal/framework/_typescript/vue/src/helpers.ts
function makeTypedUseRouterData() {
  return () => ({});
}
function makeTypedUseLoaderData() {
  return function useLoaderData2() {
    return {};
  };
}
function makeTypedUsePatternLoaderData() {
  return function usePatternLoaderData() {
    return {};
  };
}
function makeTypedAddClientLoader() {
  return function addClientLoader(_props) {
    return () => {
    };
  };
}

// internal/framework/_typescript/vue/src/link.tsx
function VormaLink(props) {
  return /* @__PURE__ */ React.createElement("a", { href: props.to }, props.children);
}
function makeTypedLink(_vormaAppConfig, _defaultProps) {
  return function TypedLink(_props) {
    return /* @__PURE__ */ React.createElement("a", { href: "#" }, _props.children);
  };
}

// internal/framework/_typescript/vue/src/vue.tsx
function VormaRootOutlet() {
  return /* @__PURE__ */ React.createElement("div", null, "Vue VormaRootOutlet");
}
function useLocation() {
  return {};
}
function useRouterData() {
  return {};
}
function useLoaderData() {
  return {};
}
export {
  VormaLink,
  VormaRootOutlet,
  makeTypedAddClientLoader,
  makeTypedLink,
  makeTypedUseLoaderData,
  makeTypedUsePatternLoaderData,
  makeTypedUseRouterData,
  useLoaderData,
  useLocation,
  useRouterData
};
//# sourceMappingURL=index.js.map
