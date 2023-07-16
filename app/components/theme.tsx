import { Theme, useAppConfig } from "@/app/store";
import AutoIcon from "@/app/icons/auto.svg";
import LightIcon from "@/app/icons/light.svg";
import DarkIcon from "@/app/icons/dark.svg";
import React, { Fragment, ReactNode } from "react";
import Image from "next/image";
import { IconButton } from "@/app/components/button";
import ExportIcon from "@/app/icons/share.svg";
import Locale from "@/app/locales";

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

  const icon = {
    [Theme.Auto]: <AutoIcon />,
    [Theme.Light]: <LightIcon />,
    [Theme.Dark]: <DarkIcon />,
  }[theme];

  return (
    <IconButton
      icon={icon}
      bordered
      title={Locale.Chat.Actions.Theme}
      onClick={nextTheme}
    />
  );
};
