import { SubmitKey, useAppConfig } from "@/app/store";
import { Prompt, SearchService, usePromptStore } from "@/app/store/prompt";
import { Input, List, ListItem, Modal, Select } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { InputRange } from "@/app/components/input-range";
import { IconButton } from "@/app/components/button";
import EditIcon from "@/app/icons/edit.svg";
import { useEffect, useState } from "react";
import styles from "@/app/components/settings/settings.module.scss";
import { nanoid } from "nanoid";
import AddIcon from "@/app/icons/add.svg";
import ClearIcon from "@/app/icons/clear.svg";
import EyeIcon from "@/app/icons/eye.svg";
import CopyIcon from "@/app/icons/copy.svg";
import { copyToClipboard } from "@/app/lib/utils_";
import { Switch } from "@/app/components/ui/switch";

export const SetConversation = () => {
  const config = useAppConfig();
  const promptStore = usePromptStore();

  const builtinCount = SearchService.count.builtin;
  const customCount = promptStore.getUserPrompts().length ?? 0;

  const [shouldShowPromptModal, setShowPromptModal] = useState(false);

  return (
    <>
      <List>
        <ListItem title={Locale.Settings.SendKey}>
          <Select
            value={config.submitKey}
            onChange={(e) => {
              config.update(
                (config) =>
                  (config.submitKey = e.target.value as any as SubmitKey),
              );
            }}
          >
            {Object.values(SubmitKey).map((v) => (
              <option value={v} key={v}>
                {v}
              </option>
            ))}
          </Select>
        </ListItem>

        <ListItem
          title={Locale.Settings.FontSize.Title}
          subTitle={Locale.Settings.FontSize.SubTitle}
        >
          <InputRange
            title={`${config.fontSize ?? 14}px`}
            value={config.fontSize}
            min="12"
            max="18"
            step="1"
            onChange={(e) =>
              config.update(
                (config) =>
                  (config.fontSize = Number.parseInt(e.currentTarget.value)),
              )
            }
          ></InputRange>
        </ListItem>

        <ListItem
          title={Locale.Settings.SendPreviewBubble.Title}
          subTitle={Locale.Settings.SendPreviewBubble.SubTitle}
        >
          <Switch
            checked={config.sendPreviewBubble}
            onCheckedChange={() => {
              config.update(
                (config) =>
                  (config.sendPreviewBubble = !config.sendPreviewBubble),
              );
            }}
          />
        </ListItem>

        <ListItem
          title={Locale.Settings.Prompt.Disable.Title}
          subTitle={Locale.Settings.Prompt.Disable.SubTitle}
        >
          <Switch
            checked={config.disablePromptHint}
            onCheckedChange={() => {
              config.update(
                (config) =>
                  (config.disablePromptHint = !config.disablePromptHint),
              );
            }}
          />
        </ListItem>

        <ListItem
          title={Locale.Settings.Prompt.List}
          subTitle={Locale.Settings.Prompt.ListCount(builtinCount, customCount)}
        >
          <IconButton
            icon={<EditIcon />}
            text={Locale.Settings.Prompt.Edit}
            onClick={() => setShowPromptModal(true)}
          />
        </ListItem>
      </List>

      {shouldShowPromptModal && (
        <UserPromptModal onClose={() => setShowPromptModal(false)} />
      )}
    </>
  );
};

function EditPromptModal(props: { id: string; onClose: () => void }) {
  const promptStore = usePromptStore();
  const prompt = promptStore.get(props.id);

  return prompt ? (
    <div className="modal-mask">
      <Modal
        title={Locale.Settings.Prompt.EditModal.Title}
        onClose={props.onClose}
        actions={[
          <IconButton
            key=""
            onClick={props.onClose}
            text={Locale.UI.Confirm}
            bordered
          />,
        ]}
      >
        <div className={styles["edit-prompt-modal"]}>
          <input
            type="text"
            value={prompt.title}
            readOnly={!prompt.isUser}
            className={styles["edit-prompt-title"]}
            onInput={(e) =>
              promptStore.update(
                props.id,
                (prompt) => (prompt.title = e.currentTarget.value),
              )
            }
          ></input>
          <Input
            value={prompt.content}
            readOnly={!prompt.isUser}
            className={styles["edit-prompt-content"]}
            rows={10}
            onInput={(e) =>
              promptStore.update(
                props.id,
                (prompt) => (prompt.content = e.currentTarget.value),
              )
            }
          ></Input>
        </div>
      </Modal>
    </div>
  ) : null;
}

function UserPromptModal(props: { onClose?: () => void }) {
  const promptStore = usePromptStore();
  const userPrompts = promptStore.getUserPrompts();
  const builtinPrompts = SearchService.builtinPrompts;
  const allPrompts = userPrompts.concat(builtinPrompts);
  const [searchInput, setSearchInput] = useState("");
  const [searchPrompts, setSearchPrompts] = useState<Prompt[]>([]);
  const prompts = searchInput.length > 0 ? searchPrompts : allPrompts;

  const [editingPromptId, setEditingPromptId] = useState<string>();

  useEffect(() => {
    if (searchInput.length > 0) {
      const searchResult = SearchService.search(searchInput);
      setSearchPrompts(searchResult);
    } else {
      setSearchPrompts([]);
    }
  }, [searchInput]);

  return (
    <div className="modal-mask">
      <Modal
        title={Locale.Settings.Prompt.Modal.Title}
        onClose={() => props.onClose?.()}
        actions={[
          <IconButton
            key="add"
            onClick={() =>
              promptStore.add({
                id: nanoid(),
                createdAt: Date.now(),
                title: "Empty Prompt",
                content: "Empty Prompt Content",
              })
            }
            icon={<AddIcon />}
            bordered
            text={Locale.Settings.Prompt.Modal.Add}
          />,
        ]}
      >
        <div className={styles["user-prompt-modal"]}>
          <input
            type="text"
            className={styles["user-prompt-search"]}
            placeholder={Locale.Settings.Prompt.Modal.Search}
            value={searchInput}
            onInput={(e) => setSearchInput(e.currentTarget.value)}
          ></input>

          <div className={styles["user-prompt-list"]}>
            {prompts.map((v, _) => (
              <div className={styles["user-prompt-item"]} key={v.id ?? v.title}>
                <div className={styles["user-prompt-header"]}>
                  <div className={styles["user-prompt-title"]}>{v.title}</div>
                  <div className={styles["user-prompt-content"] + " one-line"}>
                    {v.content}
                  </div>
                </div>

                <div className={styles["user-prompt-buttons"]}>
                  {v.isUser && (
                    <IconButton
                      icon={<ClearIcon />}
                      className={styles["user-prompt-button"]}
                      onClick={() => promptStore.remove(v.id!)}
                    />
                  )}
                  {v.isUser ? (
                    <IconButton
                      icon={<EditIcon />}
                      className={styles["user-prompt-button"]}
                      onClick={() => setEditingPromptId(v.id)}
                    />
                  ) : (
                    <IconButton
                      icon={<EyeIcon />}
                      className={styles["user-prompt-button"]}
                      onClick={() => setEditingPromptId(v.id)}
                    />
                  )}
                  <IconButton
                    icon={<CopyIcon />}
                    className={styles["user-prompt-button"]}
                    onClick={() => copyToClipboard(v.content)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {editingPromptId !== undefined && (
        <EditPromptModal
          id={editingPromptId!}
          onClose={() => setEditingPromptId(undefined)}
        />
      )}
    </div>
  );
}
