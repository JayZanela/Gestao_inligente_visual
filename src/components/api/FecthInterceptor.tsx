// src/components/FetchInterceptor.tsx
import { useGlobalParams } from "../../context/GlobalParamsContext";
import { injectionRules } from "../../config/requestInjectionRules";
import { useEffect } from "react";

export default function FetchInterceptor() {
  const { params } = useGlobalParams(); // pega montadora_id e outros parâmetros globais

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (resource: RequestInfo, init: RequestInit = {}) => {
      // 1) Busca o token do localStorage
      const token = localStorage.getItem("authToken");

      // 2) Normaliza headers
      const headers = new Headers(init.headers || {});
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // garante que JSON POSTs tenham Content-Type
      if (
        init.method?.toUpperCase() === "POST" &&
        !headers.get("Content-Type")
      ) {
        headers.set("Content-Type", "application/json");
      }

      // 3) Injeção de body para POST JSONs
      let body = init.body;
      const isPost = init.method?.toUpperCase() === "POST";
      const contentType = headers.get("Content-Type");
      if (isPost && contentType === "application/json") {
        let parsed: Record<string, any> = {};
        try {
          parsed = init.body ? JSON.parse(init.body as string) : {};
        } catch {
          parsed = {};
        }

        // Para cada regra, injeta params[paramKey] no body quando a URL bater
        injectionRules.forEach((rule) => {
          // params vem do seu contexto, carregado no componente
          const val = (params as any)[rule.paramKey];
          if (
            typeof resource === "string" &&
            resource.includes(rule.match) &&
            val != null
          ) {
            parsed[rule.paramKey] = val;
          }
        });

        body = JSON.stringify(parsed);
      }

      // 4) Chama o fetch original com headers e body atualizados
      return originalFetch(resource, {
        ...init,
        headers,
        body,
      });
    };

    return () => {
      // restaura fetch original ao desmontar
      window.fetch = originalFetch;
    };
  }, [params]);

  return null;
}
