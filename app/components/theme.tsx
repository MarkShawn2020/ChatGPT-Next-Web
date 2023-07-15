import { Theme, useAppConfig } from "@/app/store";
import Locale from "@/app/locales";
import AutoIcon from "@/app/icons/auto.svg";
import LightIcon from "@/app/icons/light.svg";
import DarkIcon from "@/app/icons/dark.svg";
import React from "react";
import { ChatAction } from "@/app/components/chat/action";

export const SwitchTheme = () => {
  const config = useAppConfig();
  const theme = config.theme;

  function nextTheme() {
    const themes = [Theme.Auto, Theme.Light, Theme.Dark];
    const themeIndex = themes.indexOf(theme);
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    config.update((config) => (config.theme = nextTheme));
  }

  return (
    <ChatAction
      onClick={nextTheme}
      text={Locale.Chat.InputActions.Theme[theme]}
      icon={
        <>
          {theme === Theme.Auto ? (
            <AutoIcon />
          ) : theme === Theme.Light ? (
            <LightIcon />
          ) : theme === Theme.Dark ? (
            <DarkIcon />
          ) : null}
        </>
      }
    />
  );
};
