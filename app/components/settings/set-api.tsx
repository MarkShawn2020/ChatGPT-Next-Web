import { useAccessStore, useAppConfig, useUpdateStore } from "@/app/store";
import { useEffect, useMemo, useState } from "react";
import { getClientConfig } from "@/app/config/client";
import { List, ListItem, PasswordInput } from "@/app/components/ui-lib";
import Locale from "@/app/locales";
import { IconButton } from "@/app/components/button";
import ResetIcon from "@/app/icons/reload.svg";

export const SetAPI = () => {
  const config = useAppConfig();
  const accessStore = useAccessStore();
  const showUsage = accessStore.isAuthorized();

  const updateStore = useUpdateStore();
  const usage = {
    used: updateStore.used,
    subscription: updateStore.subscription,
  };
  const enabledAccessControl = useMemo(
    () => accessStore.enabledAccessControl(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const clientConfig = useMemo(() => getClientConfig(), []);
  const showAccessCode = enabledAccessControl && !clientConfig?.isApp;

  const [loadingUsage, setLoadingUsage] = useState(false);

  function checkUsage(force = false) {
    if (accessStore.hideBalanceQuery) {
      return;
    }

    setLoadingUsage(true);
    updateStore.updateUsage(force).finally(() => {
      setLoadingUsage(false);
    });
  }

  useEffect(() => {
    accessStore.isAuthorized() && checkUsage();
  }, []);

  return (
    <List>
      {showAccessCode ? (
        <ListItem
          title={Locale.Settings.AccessCode.Title}
          subTitle={Locale.Settings.AccessCode.SubTitle}
        >
          <PasswordInput
            value={accessStore.accessCode}
            type="text"
            placeholder={Locale.Settings.AccessCode.Placeholder}
            onChange={(e) => {
              accessStore.updateCode(e.currentTarget.value);
            }}
          />
        </ListItem>
      ) : (
        <></>
      )}

      {!accessStore.hideUserApiKey ? (
        <>
          <ListItem
            title={Locale.Settings.Endpoint.Title}
            subTitle={Locale.Settings.Endpoint.SubTitle}
          >
            <input
              type="text"
              value={accessStore.openaiUrl}
              placeholder="https://api.openai.com/"
              onChange={(e) =>
                accessStore.updateOpenAiUrl(e.currentTarget.value)
              }
            ></input>
          </ListItem>
          <ListItem
            title={Locale.Settings.Token.Title}
            subTitle={Locale.Settings.Token.SubTitle}
          >
            <PasswordInput
              value={accessStore.token}
              type="text"
              placeholder={Locale.Settings.Token.Placeholder}
              onChange={(e) => {
                accessStore.updateToken(e.currentTarget.value);
              }}
            />
          </ListItem>
        </>
      ) : null}

      {!accessStore.hideBalanceQuery ? (
        <ListItem
          title={Locale.Settings.Usage.Title}
          subTitle={
            showUsage
              ? loadingUsage
                ? Locale.Settings.Usage.IsChecking
                : Locale.Settings.Usage.SubTitle(
                    usage?.used ?? "[?]",
                    usage?.subscription ?? "[?]",
                  )
              : Locale.Settings.Usage.NoAccess
          }
        >
          {!showUsage || loadingUsage ? (
            <div />
          ) : (
            <IconButton
              icon={<ResetIcon></ResetIcon>}
              text={Locale.Settings.Usage.Check}
              onClick={() => checkUsage(true)}
            />
          )}
        </ListItem>
      ) : null}

      <ListItem
        title={Locale.Settings.CustomModel.Title}
        subTitle={Locale.Settings.CustomModel.SubTitle}
      >
        <input
          type="text"
          value={config.customModels}
          placeholder="model1,model2,model3"
          onChange={(e) =>
            config.update(
              (config) => (config.customModels = e.currentTarget.value),
            )
          }
        ></input>
      </ListItem>
    </List>
  );
};
