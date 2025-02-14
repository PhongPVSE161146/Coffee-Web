import React from "react";
import AppRoutes from "./routers/AppRoutes";
import { AuthProvider } from "./features/Auth/useAuth";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
