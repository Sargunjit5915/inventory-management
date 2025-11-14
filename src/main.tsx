import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DussatInventory from "./DussatInventory";

const container = document.getElementById("root")!;
createRoot(container).render(
  <React.StrictMode>
    <DussatInventory />
  </React.StrictMode>
);
