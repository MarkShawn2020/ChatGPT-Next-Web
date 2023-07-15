import { ReactNode } from "react";
import { ErrorBoundary } from "@/app/components/error";
import Locale from "@/app/locales";
import styles from "@/app/components/settings/settings.module.scss";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { SetSystem } from "@/app/components/settings/set-system";
import { SetUser } from "@/app/components/settings/set-user";
import { SetConversation } from "@/app/components/settings/set-conversation";
import { SetMask } from "@/app/components/settings/set-mask";
import { SetModel } from "@/app/components/settings/set-model";
import { SetAPI } from "@/app/components/settings/set-api";
import { SetSync } from "@/app/components/settings/set-sync";
import { SetReset } from "@/app/components/settings/set-reset";
import { useEscHome } from "@/app/hooks/use-esc-home";
import { CloseBackToHomeIcon } from "@/app/icons/close-back-to-home";

interface ISettingUnit {
  title: string;
  content: ReactNode;
}

export const settings: ISettingUnit[] = [
  {
    title: Locale.Settings.System,
    content: <SetSystem />,
  },
  {
    title: Locale.Settings.User,
    content: <SetUser />,
  },
  {
    title: Locale.Settings.Conversation,
    content: <SetConversation />,
  },
  {
    title: Locale.Settings.Mask.Title,
    content: <SetMask />,
  },
  {
    title: Locale.Settings.Model,
    content: <SetModel />,
  },
  {
    title: Locale.Settings.API,
    content: <SetAPI />,
  },
  {
    title: Locale.Settings.Sync,
    content: <SetSync />,
  },
  {
    title: Locale.Settings.Reset,
    content: <SetReset />,
  },
];

export function Settings() {
  useEscHome(); // 在设置页，按下 ESC 即退回主页

  return (
    <ErrorBoundary>
      {/* headers begin */}
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.Settings.Title}
          </div>
          <div className="window-header-sub-title">
            {Locale.Settings.SubTitle}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button"></div>
          <div className="window-action-button"></div>
          <div className="window-action-button">
            <CloseBackToHomeIcon />
          </div>
        </div>
      </div>
      {/* headers end */}

      {/* content begin */}
      <div className={styles["settings"]}>
        <Accordion className="w-full" type={"multiple"}>
          {settings.map((setting) => (
            <AccordionItem value={setting.title} key={setting.title}>
              <AccordionTrigger>{setting.title}</AccordionTrigger>
              <AccordionContent>{setting.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      {/*	content end*/}
    </ErrorBoundary>
  );
}
