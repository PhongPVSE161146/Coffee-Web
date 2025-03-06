import React from "react";
import { MaterialUIControllerProvider } from "../../context"; // Import Provider
import Dashboard from "./dashboard/index"; // Import Dashboard

function ManagerPage() {
  return (
    <MaterialUIControllerProvider>
      <Dashboard />
    </MaterialUIControllerProvider>
  );
}

export default ManagerPage;