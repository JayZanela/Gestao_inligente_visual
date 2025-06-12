import { useGlobalParams } from "../../context/GlobalParamsContext";
import { injectionRules } from "../../config/requestInjectionRules";
import { useEffect } from "react";

export default function FetchInterceptor() {
  const { params } = useGlobalParams();

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (resource, init: RequestInit = {}) => {
      if (
        typeof resource === "string" &&
        init.method?.toUpperCase() === "POST" &&
        init.headers?.["Content-Type"] === "application/json"
      ) {
        let body: any = {};
        try {
          body = init.body ? JSON.parse(init.body as string) : {};
        } catch {
          body = {};
        }

        // para cada regra, se a URL bater e existir param correspondente, injeta
        injectionRules.forEach((rule) => {
          if (
            resource.includes(rule.match) &&
            params.hasOwnProperty(rule.paramKey)
          ) {
            body[rule.paramKey] = params[rule.paramKey];
          }
        });

        init = { ...init, body: JSON.stringify(body) };
      }
      return originalFetch(resource, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [params]);

  return null;
}
