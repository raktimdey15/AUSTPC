import React from "react";
import ReactDOM from "react-dom/client";
import { ReactLenis } from "lenis/react";
import { HelmetProvider } from "react-helmet-async";

import "./index.css";
import App from "./App";
import { ContentProvider } from "./context/ContentContext";
import { AuthProvider } from "./context/AuthContext";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <HelmetProvider>
      <ReactLenis
        root
        options={{
          duration: 1.2,
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
        }}
      >
        <AuthProvider>
          <ContentProvider>
            <App />
          </ContentProvider>
        </AuthProvider>
      </ReactLenis>
    </HelmetProvider>
  </React.StrictMode>
);