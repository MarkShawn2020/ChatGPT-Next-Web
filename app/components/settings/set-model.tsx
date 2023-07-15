import { useAppConfig } from "@/app/store";
import { List } from "@/app/components/ui-lib";
import { ModelConfigList } from "@/app/components/model-config";

export const SetModel = () => {
  const config = useAppConfig();
  return (
    <List>
      <ModelConfigList
        modelConfig={config.modelConfig}
        updateConfig={(updater) => {
          const modelConfig = { ...config.modelConfig };
          updater(modelConfig);
          config.update((config) => (config.modelConfig = modelConfig));
        }}
      />
    </List>
  );
};
