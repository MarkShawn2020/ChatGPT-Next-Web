import { useState } from "react";
import { api } from "@/app/client/api";
import { copyToClipboard } from "@/app/lib/utils_";
import { showToast } from "@/app/components/ui-lib";
import { prettyObject } from "@/app/utils/format";
import styles from "@/app/components/chat/export/exporter.module.scss";
import { IconButton } from "@/app/components/ui-custom/button";
import Locale from "@/app/locales";
import CopyIcon from "@/app/icons/copy.svg";
import DownloadIcon from "@/app/icons/download.svg";
import LoadingIcon from "@/app/icons/three-dots.svg";
import ShareIcon from "@/app/icons/share.svg";
import { RenderExport } from "@/app/components/chat/export/render-export";
import { ChatMessage } from "@/app/ds/message";

export function PreviewActions(props: {
  download: () => void;
  copy: () => void;
  showCopy?: boolean;
  messages?: ChatMessage[];
}) {
  const [loading, setLoading] = useState(false);
  const [shouldExport, setShouldExport] = useState(false);

  const onRenderMsgs = (msgs: ChatMessage[]) => {
    setShouldExport(false);

    api
      .share(msgs)
      .then((res) => {
        if (!res) return;
        copyToClipboard(res);
        setTimeout(() => {
          window.open(res, "_blank");
        }, 800);
      })
      .catch((e) => {
        console.error("[Share]", e);
        showToast(prettyObject(e));
      })
      .finally(() => setLoading(false));
  };

  const share = async () => {
    if (props.messages?.length) {
      setLoading(true);
      setShouldExport(true);
    }
  };

  return (
    <>
      <div className={styles["preview-actions"]}>
        {props.showCopy && (
          <IconButton
            text={Locale.Export.Copy}
            bordered
            shadow
            icon={<CopyIcon />}
            onClick={props.copy}
          ></IconButton>
        )}
        <IconButton
          text={Locale.Export.Download}
          bordered
          shadow
          icon={<DownloadIcon />}
          onClick={props.download}
        ></IconButton>
        <IconButton
          text={Locale.Export.Share}
          bordered
          shadow
          icon={loading ? <LoadingIcon /> : <ShareIcon />}
          onClick={share}
        ></IconButton>
      </div>
      <div
        style={{
          position: "fixed",
          right: "200vw",
          pointerEvents: "none",
        }}
      >
        {shouldExport && (
          <RenderExport
            messages={props.messages ?? []}
            onRender={onRenderMsgs}
          />
        )}
      </div>
    </>
  );
}
