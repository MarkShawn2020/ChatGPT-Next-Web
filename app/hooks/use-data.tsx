import { useAppConfig } from "@/app/store";
import { useEffect } from "react";
import { api } from "@/app/client/api";

export function useLoadData() {
  const config = useAppConfig();

  useEffect(() => {
    (async () => {
      const models = await api.llm.models();
      config.mergeModels(models);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
