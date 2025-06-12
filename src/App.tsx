import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { GlobalParamsProvider } from "./context/GlobalParamsContext";
import FetchInterceptor from "./components/api/FecthInterceptor";
import "./App.css";

function App() {
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
