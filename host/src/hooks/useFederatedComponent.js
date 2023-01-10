/* eslint-disable no-undef */
import React, { lazy, useEffect, useState } from "react";

import useDynamicScript from "./useDynamicScript";

function loadComponent(scope, module) {
  return async () => {
    console.log('load component', {scope, module})
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    console.log("container", container);
    await container.init(__webpack_share_scopes__.default);
    const factory = await window[scope].get(module);
    const Module = factory();
    return Module;
  };
}

const componentCache = new Map();
export const useFederatedComponent = (url, scope, module, version) => {
  const remoteUrl = url
    ? url + `/remoteEntries/${version}/remoteEntry.js`
    : undefined;

  const key = `${url}-${scope}-${module}-${version}`;
  console.log(key);
  const [Component, setComponent] = useState(null);

  const { ready, errorLoading } = useDynamicScript(remoteUrl);
  useEffect(() => {
    if (Component) setComponent(null);
    // Only recalculate when key changes
  }, [key]);

  useEffect(() => {
    if (ready && !Component) {
      const Comp = lazy(loadComponent(scope, module));
      console.log(Comp);
      componentCache.set(key, Comp);
      setComponent(Comp);
    }
    // key includes all dependencies (scope/module)
  }, [Component, ready, key]);

  return { errorLoading, Component };
};
