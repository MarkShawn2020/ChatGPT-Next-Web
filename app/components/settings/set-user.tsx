import { useState } from "react";
import { useAppConfig } from "@/app/store";
import { List, ListItem, Popover } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { Avatar, AvatarPicker } from "@/app/components/emoji";
import styles from "@/app/components/settings/settings.module.scss";

export const SetUser = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const config = useAppConfig();

  return (
    <List>
      <ListItem title={Locale.Settings.Avatar}>
        <Popover
          onClose={() => setShowEmojiPicker(false)}
          content={
            <AvatarPicker
              onEmojiClick={(avatar: string) => {
                config.update((config) => (config.avatar = avatar));
                setShowEmojiPicker(false);
              }}
            />
          }
          open={showEmojiPicker}
        >
          <div
            className={styles.avatar}
            onClick={() => setShowEmojiPicker(true)}
          >
            <Avatar avatar={config.avatar} />
          </div>
        </Popover>
      </ListItem>
    </List>
  );
};
