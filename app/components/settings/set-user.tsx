import { useState } from "react";
import { useAppConfig } from "@/app/store";
import { List, ListItem } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { Avatar, AvatarPicker } from "@/app/components/emoji";
import styles from "@/app/components/settings/settings.module.scss";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const SetUser = () => {
  const config = useAppConfig();

  return (
    <List>
      <ListItem title={Locale.Settings.Avatar}>
        <Popover>
          <PopoverTrigger asChild>
            <div className={styles.avatar}>
              <Avatar avatar={config.avatar} />
            </div>
          </PopoverTrigger>

          <PopoverContent className={"w-fit"}>
            <AvatarPicker
              onEmojiClick={(avatar: string) => {
                config.update((config) => (config.avatar = avatar));
              }}
            />
          </PopoverContent>
        </Popover>
      </ListItem>
    </List>
  );
};
