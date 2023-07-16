import styles from "../home.module.scss";

import { IconButton } from "../ui-custom/button";
import SettingsIcon from "../../icons/settings.svg";
import GithubIcon from "../../icons/github.svg";
import AddIcon from "../../icons/add.svg";
import CloseIcon from "../../icons/close.svg";
import MaskIcon from "../../icons/mask.svg";
import PluginIcon from "../../icons/plugin.svg";
import CSMagicLogoIcon from "../../../public/logo/44.svg";

import Locale from "../../locales";

import { useAppConfig, useChatStore } from "../../store";

import { Path, REPO_URL } from "../../constant";

import { Link, useNavigate } from "react-router-dom";
import dynamic from "next/dynamic";
import { showConfirm, showToast } from "../ui-lib";
import { settings } from "@/app/settings";
import { useHotKey } from "@/app/hooks/use-hot-key";
import { useDragSideBar } from "@/app/hooks/use-drag-sidebar";

const ChatList = dynamic(
  async () => (await import("../chat/chat-list")).ChatList,
  {
    loading: () => null,
  },
);

export function SideBar(props: { className?: string }) {
  const chatStore = useChatStore();

  // drag side bar
  const { onDragMouseDown, shouldNarrow } = useDragSideBar();
  const navigate = useNavigate();
  const config = useAppConfig();

  useHotKey();

  return (
    <div
      className={`${styles.sidebar} ${props.className} ${
        shouldNarrow && styles["narrow-sidebar"]
      }`}
    >
      <div className={styles["sidebar-header"]} data-tauri-drag-region>
        <div className={styles["sidebar-title"]} data-tauri-drag-region>
          {settings.product.name}
        </div>
        <div className={styles["sidebar-sub-title"]}>
          {settings.product.desc}
        </div>
        <div className={styles["sidebar-logo"] + " no-dark"}>
          <CSMagicLogoIcon />
        </div>
      </div>

      <div className={styles["sidebar-header-bar"]}>
        <IconButton
          icon={<MaskIcon />}
          text={shouldNarrow ? undefined : Locale.Mask.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => navigate(Path.NewChat, { state: { fromHome: true } })}
          shadow
        />
        <IconButton
          icon={<PluginIcon />}
          text={shouldNarrow ? undefined : Locale.Plugin.Name}
          className={styles["sidebar-bar-button"]}
          onClick={() => showToast(Locale.WIP)}
          shadow
        />
      </div>

      <div
        className={styles["sidebar-body"]}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            navigate(Path.Home);
          }
        }}
      >
        <ChatList narrow={shouldNarrow} />
      </div>

      <div className={styles["sidebar-tail"]}>
        <div className={styles["sidebar-actions"]}>
          <div className={styles["sidebar-action"] + " " + styles.mobile}>
            <IconButton
              icon={<CloseIcon />}
              onClick={async () => {
                if (await showConfirm(Locale.Home.DeleteChat)) {
                  chatStore.deleteSession(chatStore.currentSessionIndex);
                }
              }}
            />
          </div>
          <div className={styles["sidebar-action"]}>
            <Link to={Path.Settings}>
              <IconButton icon={<SettingsIcon />} shadow />
            </Link>
          </div>
          <div className={styles["sidebar-action"]}>
            <a href={REPO_URL} target="_blank">
              <IconButton icon={<GithubIcon />} shadow />
            </a>
          </div>
        </div>
        <div>
          <IconButton
            icon={<AddIcon />}
            text={shouldNarrow ? undefined : Locale.Home.NewChat}
            onClick={() => {
              if (config.dontShowMaskSplashScreen) {
                chatStore.newSession();
                navigate(Path.Chat);
              } else {
                navigate(Path.NewChat);
              }
            }}
            shadow
          />
        </div>
      </div>

      <div
        className={styles["sidebar-drag"]}
        onMouseDown={(e) => onDragMouseDown(e as any)}
      ></div>
    </div>
  );
}
