import { Theme, useAppConfig } from "@/app/store";
import AutoIcon from "@/app/icons/auto.svg";
import LightIcon from "@/app/icons/light.svg";
import DarkIcon from "@/app/icons/dark.svg";
import React from "react";
import { IconButton } from "@/app/components/button";
import Locale from "@/app/locales";
import { useTheme } from "next-themes";

export const SwitchTheme = () => {
  const { theme = "dark", setTheme, themes } = useTheme();

  function nextTheme() {
    if (themes.length === 0) return;

    const themeIndex = themes.indexOf(theme);
    const nextIndex = (themeIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setTheme(nextTheme);
  }

  const icon = {
    [Theme.System]: <AutoIcon />,
    [Theme.Light]: <LightIcon />,
    [Theme.Dark]: <DarkIcon />,
  }[theme];

  console.log({ theme });

  return (
    <div className="window-action-button">
      <IconButton
        icon={icon}
        bordered
        title={Locale.Chat.Actions.Theme}
        onClick={nextTheme}
      />
    </div>
  );
};
