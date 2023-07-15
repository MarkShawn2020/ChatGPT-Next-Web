import { useAppConfig } from "@/app/store";
import { List, ListItem } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { Switch } from "@/app/components/ui/switch";

export const SetMask = () => {
  const config = useAppConfig();
  return (
    <List>
      <ListItem
        title={Locale.Settings.Mask.Splash.Title}
        subTitle={Locale.Settings.Mask.Splash.SubTitle}
      >
        <Switch
          checked={!config.dontShowMaskSplashScreen}
          onCheckedChange={() => {
            config.update(
              (config) =>
                (config.dontShowMaskSplashScreen =
                  !config.dontShowMaskSplashScreen),
            );
          }}
        />
      </ListItem>

      <ListItem
        title={Locale.Settings.Mask.Builtin.Title}
        subTitle={Locale.Settings.Mask.Builtin.SubTitle}
      >
        <Switch
          checked={config.hideBuiltinMasks}
          onCheckedChange={() => {
            config.update(
              (config) => (config.hideBuiltinMasks = !config.hideBuiltinMasks),
            );
          }}
        />
      </ListItem>
    </List>
  );
};
