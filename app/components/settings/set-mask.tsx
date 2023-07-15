import { useAppConfig } from "@/app/store";
import { List, ListItem } from "@/app/components/ui-lib";
import Locale from "@/app/locales";

export const SetMask = () => {
  const config = useAppConfig();
  return (
    <List>
      <ListItem
        title={Locale.Settings.Mask.Splash.Title}
        subTitle={Locale.Settings.Mask.Splash.SubTitle}
      >
        <input
          type="checkbox"
          checked={!config.dontShowMaskSplashScreen}
          onChange={(e) =>
            config.update(
              (config) =>
                (config.dontShowMaskSplashScreen = !e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem>

      <ListItem
        title={Locale.Settings.Mask.Builtin.Title}
        subTitle={Locale.Settings.Mask.Builtin.SubTitle}
      >
        <input
          type="checkbox"
          checked={config.hideBuiltinMasks}
          onChange={(e) =>
            config.update(
              (config) => (config.hideBuiltinMasks = e.currentTarget.checked),
            )
          }
        ></input>
      </ListItem>
    </List>
  );
};
