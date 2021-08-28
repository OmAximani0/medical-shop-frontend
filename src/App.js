import React from "react";
import Dashboard from "./pages/SellerDashboard";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
    <div>
      <ToastProvider
        placement="top-right"
      >
        <Dashboard />
      </ToastProvider>
    </div>
  );
}

export default App;
