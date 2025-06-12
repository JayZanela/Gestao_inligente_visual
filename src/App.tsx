import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { GlobalParamsProvider } from "./context/GlobalParamsContext";
import FetchInterceptor from "./components/api/FecthInterceptor";
import "./App.css";

function App() {
  useEffect(() => {
    // Limpa tanto o localStorage quanto o sessionStorage
    localStorage.clear();
    console.log("[App] storage limpo no carregamento");
  }, []);

  return (
    <BrowserRouter>
      <GlobalParamsProvider>
        <FetchInterceptor />
        <AppRoutes />
      </GlobalParamsProvider>
    </BrowserRouter>
  );
}

export default App;
