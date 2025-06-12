// src/context/GlobalParamsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type Params = Record<string, any>;

interface GlobalParamsContextValue {
  params: Params;
  setParam: (key: string, value: any) => void;
}

const GlobalParamsContext = createContext<GlobalParamsContextValue | undefined>(
  undefined
);

export const GlobalParamsProvider = ({ children }: { children: ReactNode }) => {
  const [params, setParams] = useState<Params>({});
  const setParam = (key: string, value: any) =>
    setParams((prev) => ({ ...prev, [key]: value }));
  return (
    <GlobalParamsContext.Provider value={{ params, setParam }}>
      {children}
    </GlobalParamsContext.Provider>
  );
};

export const useGlobalParams = () => {
  const ctx = useContext(GlobalParamsContext);
  if (!ctx)
    throw new Error("useGlobalParams must be inside GlobalParamsProvider");
  return ctx;
};
