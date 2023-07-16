import { useAppConfig, useChatStore } from "@/app/store";
import { useRef } from "react";
import { showImageModal, showToast } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { toBlob, toPng } from "html-to-image";
import { copyToClipboard, downloadAs, useMobileScreen } from "@/app/lib/utils_";
import { getClientConfig } from "@/app/config/client";
import styles from "@/app/components/chat/export/exporter.module.scss";
import { PreviewActions } from "@/app/components/chat/export/preview-actions";
import NextImage from "next/image";
import CSMagicLogoIcon from "@/public/logo/108.png";
import { settings } from "@/app/settings";
import { Markdown } from "@/app/components/chat/markdown";
import { DEFAULT_MASK_AVATAR } from "@/app/store/mask";
import BotIcon from "@/app/icons/bot.png";
import { Avatar } from "@/app/components/emoji";
import { ChatMessage } from "@/app/ds/message";

export function ExportAvatar(props: { avatar: string }) {
  if (props.avatar === DEFAULT_MASK_AVATAR) {
    return (
      <NextImage
        src={BotIcon.src}
        width={30}
        height={30}
        alt="bot"
        className="user-avatar"
      />
    );
  }

  return <Avatar avatar={props.avatar}></Avatar>;
}

export function ImagePreviewer(props: {
  messages: ChatMessage[];
  topic: string;
}) {
  const chatStore = useChatStore();
  const session = chatStore.currentSession();
  const mask = session.mask;
  const config = useAppConfig();

  const previewRef = useRef<HTMLDivElement>(null);

  const copy = () => {
    showToast(Locale.Export.Image.Toast);
    const dom = previewRef.current;
    if (!dom) return;
    toBlob(dom).then((blob) => {
      if (!blob) return;
      try {
        navigator.clipboard
          .write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ])
          .then(() => {
            showToast(Locale.Copy.Success);
          });
      } catch (e) {
        console.error("[Copy Image] ", e);
        showToast(Locale.Copy.Failed);
      }
    });
  };

  const isMobile = useMobileScreen();

  const download = () => {
    showToast(Locale.Export.Image.Toast);
    const dom = previewRef.current;
    if (!dom) return;
    toPng(dom)
      .then((blob) => {
        if (!blob) return;

        if (isMobile || getClientConfig()?.isApp) {
          showImageModal(blob);
        } else {
          const link = document.createElement("a");
          link.download = `${props.topic}.png`;
          link.href = blob;
          link.click();
        }
      })
      .catch((e) => console.log("[Export Image] ", e));
  };

  console.log({ messages: props.messages });
  const lastDate = props.messages.at(-1)?.date;
  const convertedDate = new Date(lastDate ?? Date.now());
  console.log({ lastDate, convertedDate });

  return (
    <div className={styles["image-previewer"]}>
      <PreviewActions
        copy={copy}
        download={download}
        showCopy={!isMobile}
        messages={props.messages}
      />
      <div
        className={`${styles["preview-body"]} ${styles["default-theme"]}`}
        ref={previewRef}
      >
        <div className={styles["chat-info"]}>
          <div className={styles["logo"] + " no-dark"}></div>

          <div>
            <div className={"inline-flex gap-2 items-center"}>
              <NextImage
                src={CSMagicLogoIcon}
                alt="logo"
                width={24}
                height={24}
              />
              <div className={styles["main-title"]}>
                {settings.product.share.title}
              </div>
            </div>
            <div className={styles["sub-title"]}>
              {settings.product.share.desc}
              {"/{slug}"}
            </div>
            <div className={styles["icons"]}>
              <ExportAvatar avatar={config.avatar} />
              <span className={styles["icon-space"]}>&</span>
              <ExportAvatar avatar={mask.avatar} />
            </div>
          </div>
          <div>
            <div className={styles["chat-info-item"]}>
              {Locale.Exporter.Model}: {mask.modelConfig.model}
            </div>
            <div className={styles["chat-info-item"]}>
              {Locale.Exporter.Messages}: {props.messages.length}
            </div>
            <div className={styles["chat-info-item"]}>
              {Locale.Exporter.Topic}: {session.topic}
            </div>
            <div className={styles["chat-info-item"]}>
              {Locale.Exporter.Time}:{" "}
              {new Date(
                props.messages.at(-1)?.date ?? Date.now(),
              ).toLocaleString()}
            </div>
          </div>
        </div>
        {props.messages.map((m, i) => {
          return (
            <div
              className={styles["message"] + " " + styles["message-" + m.role]}
              key={i}
            >
              <div className={styles["avatar"]}>
                <ExportAvatar
                  avatar={m.role === "user" ? config.avatar : mask.avatar}
                />
              </div>

              <div className={styles["body"]}>
                <Markdown
                  content={m.content}
                  fontSize={config.fontSize}
                  defaultShow
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MarkdownPreviewer(props: {
  messages: ChatMessage[];
  topic: string;
}) {
  const mdText =
    `# ${props.topic}\n\n` +
    props.messages
      .map((m) => {
        return m.role === "user"
          ? `## ${Locale.Export.MessageFromYou}:\n${m.content}`
          : `## ${Locale.Export.MessageFromChatGPT}:\n${m.content.trim()}`;
      })
      .join("\n\n");

  const copy = () => {
    copyToClipboard(mdText);
  };
  const download = () => {
    downloadAs(mdText, `${props.topic}.md`);
  };

  return (
    <>
      <PreviewActions
        copy={copy}
        download={download}
        messages={props.messages}
      />
      <div className="markdown-body">
        <pre className={styles["export-content"]}>{mdText}</pre>
      </div>
    </>
  );
}
