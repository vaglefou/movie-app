import React from "react";
import ReactDOM from "react-dom/client";
import "./app/styles/style.css";
import App from "./App";
import { AuthProvider } from "./app/common/providers/user.provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
