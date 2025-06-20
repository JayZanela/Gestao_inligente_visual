import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { GlobalParamsProvider } from "./context/GlobalParamsContext";
import { AuthProvider } from "./context/AuthContext";
import FetchInterceptor from "./components/api/FecthInterceptor";
import "./App.css";

function App() {
  useEffect(() => {
    // Limpa tanto o localStorage quanto o sessionStorage
    const authToken = localStorage.getItem("authToken");
    localStorage.clear();
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    }
    console.log("[App] storage limpo no carregamento");
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalParamsProvider>
          <FetchInterceptor />
          <AppRoutes />
        </GlobalParamsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
