import { useSyncStore } from "@/app/store/sync";
import { List, ListItem } from "@/app/components/ui-lib";
import { IconButton } from "@/app/components/button";
import ResetIcon from "@/app/icons/reload.svg";
import Locale from "@/app/locales";

export function SetSync() {
  const syncStore = useSyncStore();
  const webdav = syncStore.webDavConfig;

  // not ready: https://github.com/Yidadaa/ChatGPT-Next-Web/issues/920#issuecomment-1609866332
  return <p>待开发中………</p>;

  return (
    <List>
      <ListItem
        title={"上次同步：" + new Date().toLocaleString()}
        subTitle={"20 次对话，100 条消息，200 提示词，20 面具"}
      >
        <IconButton
          icon={<ResetIcon />}
          text="同步"
          onClick={() => {
            syncStore.check().then(console.log);
          }}
        />
      </ListItem>

      <ListItem
        title={"本地备份"}
        subTitle={"20 次对话，100 条消息，200 提示词，20 面具"}
      ></ListItem>

      <ListItem
        title={"Web Dav Server"}
        subTitle={Locale.Settings.AccessCode.SubTitle}
      >
        <input
          value={webdav.server}
          type="text"
          placeholder={"https://example.com"}
          onChange={(e) => {
            syncStore.update(
              (config) => (config.server = e.currentTarget.value),
            );
          }}
        />
      </ListItem>

      <ListItem title="Web Dav User Name" subTitle="user name here">
        <input
          value={webdav.username}
          type="text"
          placeholder={"username"}
          onChange={(e) => {
            syncStore.update(
              (config) => (config.username = e.currentTarget.value),
            );
          }}
        />
      </ListItem>

      <ListItem title="Web Dav Password" subTitle="password here">
        <input
          value={webdav.password}
          type="text"
          placeholder={"password"}
          onChange={(e) => {
            syncStore.update(
              (config) => (config.password = e.currentTarget.value),
            );
          }}
        />
      </ListItem>
    </List>
  );
}
