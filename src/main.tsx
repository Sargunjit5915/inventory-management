import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // ensure this exists
import DussatInventory from "./DussatInventory";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DussatInventory />
  </React.StrictMode>
);
