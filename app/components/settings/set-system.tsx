import { Theme, useAppConfig, useUpdateStore } from "@/app/store";
import { getClientConfig } from "@/app/config/client";
import { RELEASE_URL, UPDATE_URL } from "@/app/constant";
import { List, ListItem, Select } from "@/app/components/ui-lib";
import Locale, {
  ALL_LANG_OPTIONS,
  AllLangs,
  changeLang,
  getLang,
} from "@/app/locales";
import LoadingIcon from "@/app/icons/three-dots.svg";
import Link from "next/link";
import { IconButton } from "@/app/components/button";
import ResetIcon from "@/app/icons/reload.svg";
import { useEffect, useState } from "react";

export const SetSystem = () => {
  const config = useAppConfig();
  const updateStore = useUpdateStore();

  const currentVersion = updateStore.formatVersion(updateStore.version);
  const remoteId = updateStore.formatVersion(updateStore.remoteVersion);

  const hasNewVersion = currentVersion !== remoteId;
  const updateUrl = getClientConfig()?.isApp ? RELEASE_URL : UPDATE_URL;

  const [checkingUpdate, setCheckingUpdate] = useState(false);

  function checkUpdate(force = false) {
    setCheckingUpdate(true);
    updateStore.getLatestVersion(force).then(() => {
      setCheckingUpdate(false);
    });

    console.log("[Update] local version ", updateStore.version);
    console.log("[Update] remote version ", updateStore.remoteVersion);
  }

  useEffect(() => {
    // checks per minutes
    checkUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <List>
      <ListItem
        title={Locale.Settings.Update.Version(currentVersion ?? "unknown")}
        subTitle={
          checkingUpdate
            ? Locale.Settings.Update.IsChecking
            : hasNewVersion
            ? Locale.Settings.Update.FoundUpdate(remoteId ?? "ERROR")
            : Locale.Settings.Update.IsLatest
        }
      >
        {checkingUpdate ? (
          <LoadingIcon />
        ) : hasNewVersion ? (
          <Link href={updateUrl} target="_blank" className="link">
            {Locale.Settings.Update.GoToUpdate}
          </Link>
        ) : (
          <IconButton
            icon={<ResetIcon></ResetIcon>}
            text={Locale.Settings.Update.CheckUpdate}
            onClick={() => checkUpdate(true)}
          />
        )}
      </ListItem>

      <ListItem title={Locale.Settings.Theme}>
        <Select
          value={config.theme}
          onChange={(e) => {
            config.update(
              (config) => (config.theme = e.target.value as any as Theme),
            );
          }}
        >
          {Object.values(Theme).map((v) => (
            <option value={v} key={v}>
              {v}
            </option>
          ))}
        </Select>
      </ListItem>

      <ListItem title={Locale.Settings.Lang.Name}>
        <Select
          value={getLang()}
          onChange={(e) => {
            changeLang(e.target.value as any);
          }}
        >
          {AllLangs.map((lang) => (
            <option value={lang} key={lang}>
              {ALL_LANG_OPTIONS[lang]}
            </option>
          ))}
        </Select>
      </ListItem>
    </List>
  );
};
