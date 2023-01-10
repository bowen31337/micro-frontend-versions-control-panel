import React from "react";
import { useImport } from "./hooks/useImport";
import { useMFE } from "./hooks/useMFE";
import { ControlPanel } from "./mfe/ControlPanel";

// const RemoteButton = React.lazy(() => import("pt/Button"));

const App = () => {
  const { FederatedComponent: RemoteButton, errorLoading } =
    useImport("pt/Button");

    console.log({RemoteButton, errorLoading})
  return (
    <>
      <h1>Host App</h1>
      <ControlPanel />
      <React.Suspense fallback="Loading Button">
        {errorLoading
          ? `Error loading module "${module}"`
          : RemoteButton && <RemoteButton />}
      </React.Suspense>
    </>
  );
};

export default App;
