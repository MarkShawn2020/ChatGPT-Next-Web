import Locale from "@/app/locales";
import { useSteps } from "@/app/hooks/use-steps";
import { useMemo, useState } from "react";
import { useChatStore } from "@/app/store";
import { MessageSelector } from "@/app/components/chat/message/message-selector";
import { Steps } from "@/app/components/chat/export/steps";
import styles from "@/app/components/chat/export/exporter.module.scss";
import { List, ListItem, Select } from "@/app/components/ui-lib";
import {
  ImagePreviewer,
  MarkdownPreviewer,
} from "@/app/components/chat/export/previewer";
import { useMessageSelector } from "@/app/hooks/use-messages";
import { ChatMessage } from "@/app/ds/message";

export function MessageExporter() {
  const steps = [
    {
      name: Locale.Export.Steps.Select,
      value: "select",
    },
    {
      name: Locale.Export.Steps.Preview,
      value: "preview",
    },
  ];
  const { currentStep, setCurrentStepIndex, currentStepIndex } =
    useSteps(steps);
  const formats = ["text", "image"] as const;
  type ExportFormat = (typeof formats)[number];

  const [exportConfig, setExportConfig] = useState({
    format: "image" as ExportFormat,
    includeContext: true,
  });

  function updateExportConfig(updater: (config: typeof exportConfig) => void) {
    const config = { ...exportConfig };
    updater(config);
    setExportConfig(config);
  }

  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const { selection, updateSelection } = useMessageSelector();
  const selectedMessages = useMemo(() => {
    const ret: ChatMessage[] = [];
    if (exportConfig.includeContext) {
      ret.push(...session.mask.context);
    }
    ret.push(...session.messages.filter((m, i) => selection.has(m.id)));
    return ret;
  }, [
    exportConfig.includeContext,
    session.messages,
    session.mask.context,
    selection,
  ]);

  console.log({ selectedMessages });

  return (
    <>
      <Steps
        steps={steps}
        index={currentStepIndex}
        onStepChange={setCurrentStepIndex}
      />
      <div
        className={styles["message-exporter-body"]}
        style={currentStep.value !== "select" ? { display: "none" } : {}}
      >
        <List>
          <ListItem
            title={Locale.Export.Format.Title}
            subTitle={Locale.Export.Format.SubTitle}
          >
            <Select
              value={exportConfig.format}
              onChange={(e) =>
                updateExportConfig(
                  (config) =>
                    (config.format = e.currentTarget.value as ExportFormat),
                )
              }
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </Select>
          </ListItem>
          <ListItem
            title={Locale.Export.IncludeContext.Title}
            subTitle={Locale.Export.IncludeContext.SubTitle}
          >
            <input
              type="checkbox"
              checked={exportConfig.includeContext}
              onChange={(e) => {
                updateExportConfig(
                  (config) => (config.includeContext = e.currentTarget.checked),
                );
              }}
            ></input>
          </ListItem>
        </List>
        <MessageSelector
          selection={selection}
          updateSelection={updateSelection}
          defaultSelectAll
        />
      </div>

      {currentStep.value === "preview" && (
        <div className={styles["message-exporter-body"]}>
          {exportConfig.format === "text" ? (
            <MarkdownPreviewer
              messages={selectedMessages}
              topic={session.topic}
            />
          ) : (
            <ImagePreviewer messages={selectedMessages} topic={session.topic} />
          )}
        </div>
      )}
    </>
  );
}
