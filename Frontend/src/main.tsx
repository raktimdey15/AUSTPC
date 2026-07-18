import React from "react";
import ReactDOM from "react-dom/client";
import { ReactLenis } from "lenis/react";

import "./index.css";
import App from "./App";
import { ContentProvider } from "./context/ContentContext";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ReactLenis
      root
      options={{
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      }}
    >
      <ContentProvider>
        <App />
      </ContentProvider>
    </ReactLenis>
  </React.StrictMode>
);