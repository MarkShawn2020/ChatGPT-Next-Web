import { useEffect, useState } from "react";
import { useAppConfig, useChatStore } from "../../../store";
import { Updater } from "../../../typings/typing";
import { IconButton } from "../../ui-custom/button";
import { Avatar } from "../../emoji";
import { MaskAvatar } from "../../mask";
import Locale from "../../../locales";

import styles from "./message-selector.module.scss";
import { useShiftRange } from "@/app/hooks/use-messages";
import { ChatMessage } from "@/app/ds/message";

export function MessageSelector(props: {
  selection: Set<string>;
  updateSelection: Updater<Set<string>>;
  defaultSelectAll?: boolean;
  onSelected?: (messages: ChatMessage[]) => void;
}) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const isValid = (m: ChatMessage) => m.content && !m.isError && !m.streaming;
  const messages = session.messages.filter(
    (m, i) =>
      m.id && // message must have id
      isValid(m) &&
      (i >= session.messages.length - 1 || isValid(session.messages[i + 1])),
  );
  const messageCount = messages.length;
  const config = useAppConfig();

  const [searchInput, setSearchInput] = useState("");
  const [searchIds, setSearchIds] = useState(new Set<string>());
  const isInSearchResult = (id: string) => {
    return searchInput.length === 0 || searchIds.has(id);
  };
  const doSearch = (text: string) => {
    const searchResults = new Set<string>();
    if (text.length > 0) {
      messages.forEach((m) =>
        m.content.includes(text) ? searchResults.add(m.id!) : null,
      );
    }
    setSearchIds(searchResults);
  };

  // for range selection
  const { startIndex, endIndex, onClickIndex } = useShiftRange();

  const selectAll = () => {
    props.updateSelection((selection) =>
      messages.forEach((m) => selection.add(m.id!)),
    );
  };

  useEffect(() => {
    if (props.defaultSelectAll) {
      selectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (startIndex === undefined || endIndex === undefined) {
      return;
    }
    const [start, end] = [startIndex, endIndex].sort((a, b) => a - b);
    props.updateSelection((selection) => {
      for (let i = start; i <= end; i += 1) {
        selection.add(messages[i].id ?? i);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIndex, endIndex]);

  const LATEST_COUNT = 4;

  return (
    <div className={styles["message-selector"]}>
      <div className={styles["message-filter"]}>
        <input
          type="text"
          placeholder={Locale.Select.Search}
          className={styles["filter-item"] + " " + styles["search-bar"]}
          value={searchInput}
          onInput={(e) => {
            setSearchInput(e.currentTarget.value);
            doSearch(e.currentTarget.value);
          }}
        ></input>

        <div className={styles["actions"]}>
          <IconButton
            text={Locale.Select.All}
            bordered
            className={styles["filter-item"]}
            onClick={selectAll}
          />
          <IconButton
            text={Locale.Select.Latest}
            bordered
            className={styles["filter-item"]}
            onClick={() =>
              props.updateSelection((selection) => {
                selection.clear();
                messages
                  .slice(messageCount - LATEST_COUNT)
                  .forEach((m) => selection.add(m.id!));
              })
            }
          />
          <IconButton
            text={Locale.Select.Clear}
            bordered
            className={styles["filter-item"]}
            onClick={() =>
              props.updateSelection((selection) => selection.clear())
            }
          />
        </div>
      </div>

      <div className={styles["messages"]}>
        {messages.map((m, i) => {
          if (!isInSearchResult(m.id!)) return null;

          return (
            <div
              className={`${styles["message"]} ${
                props.selection.has(m.id!) && styles["message-selected"]
              }`}
              key={i}
              onClick={() => {
                props.updateSelection((selection) => {
                  const id = m.id ?? i;
                  selection.has(id) ? selection.delete(id) : selection.add(id);
                });
                onClickIndex(i);
              }}
            >
              <div className={styles["avatar"]}>
                {m.role === "user" ? (
                  <Avatar avatar={config.avatar}></Avatar>
                ) : (
                  <MaskAvatar mask={session.mask} />
                )}
              </div>
              <div className={styles["body"]}>
                <div className={styles["date"]}>
                  {new Date(m.date ?? new Date()).toLocaleString()}
                </div>
                <div className={`${styles["content"]} one-line`}>
                  {m.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
