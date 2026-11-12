import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import WorldClock from "./WorldClock.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <WorldClock />
  </React.StrictMode>,
);
