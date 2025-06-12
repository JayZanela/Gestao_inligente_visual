import { useGlobalParams } from "../../context/GlobalParamsContext";
import { injectionRules } from "../../config/requestInjectionRules";
import { useEffect } from "react";

export default function FetchInterceptor() {
  console.log("[Interceptor] montado");
  const { params } = useGlobalParams();
  console.log(params);

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (resource, init: RequestInit = {}) => {
      // Só mexe em JSON POSTs para a sua API

      console.group(`[Interceptor] chamada fetch:`);
      console.log(" resource:", resource);
      console.log(" init:", init);
      const isString = typeof resource === "string";
      const isPost = init.method?.toUpperCase() === "POST";
      let contentType: string | null = null;

      // Detecta Content-Type seja string, Headers ou array tuple
      if (init.headers instanceof Headers) {
        contentType = init.headers.get("Content-Type");
      } else if (Array.isArray(init.headers)) {
        // [ ['Content-Type', 'application/json'], … ]
        const ct = init.headers.find(
          ([k]) => k.toLowerCase() === "content-type"
        );
        contentType = ct?.[1] ?? null;
      } else if (typeof init.headers === "object" && init.headers !== null) {
        contentType =
          (init.headers as any)["Content-Type"] ??
          (init.headers as any)["content-type"];
      }

      if (isString && isPost && contentType === "application/json") {
        let body: any = {};

        try {
          body = init.body ? JSON.parse(init.body as string) : {};
        } catch {
          console.warn("[Interceptor] body não é JSON válido:", init.body);
          body = {};
        }

        // Para cada regra configurada, injeta o param se a URL bater
        console.log("chegou aqui");
        injectionRules.forEach((rule) => {
          console.log("regra FOREACH", rule);
          console.log(params[rule.paramKey] != null);
          console.log(resource.includes(rule.match));
          if (resource.includes(rule.match) && params[rule.paramKey] != null) {
            body[rule.paramKey] = params[rule.paramKey];
            console.log(
              `[Interceptor] injetando ${rule.paramKey}=${
                params[rule.paramKey]
              } em ${resource}`
            );
          }
        });

        init = {
          ...init,
          body: JSON.stringify(body),
        };
      }
      console.log("retornando originalFecth", init, resource);
      return originalFetch(resource, init);
    };

    return () => {
      console.log(originalFetch);
      window.fetch = originalFetch;
    };
  }, [params]);

  return null;
}
