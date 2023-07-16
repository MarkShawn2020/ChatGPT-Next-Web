"use client";

import { Settings as Settings1 } from "@/app/components/settings";
import { useEffect } from "react";

import styles from "./home.module.scss";

import { useMobileScreen } from "../lib/utils_";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { getLang } from "../locales";

import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "@/app/store";
import { AuthPage } from "./auth";
import { getClientConfig } from "../config/client";
import { useAccessStore } from "../store";
import { Chat } from "@/app/components/chat";
import { useHasHydrated } from "@/app/hooks/use-hydrate";
import { useLoadData } from "@/app/hooks/use-data";
import { loadAsyncGoogleFont } from "@/app/lib/font";
import { Loading } from "@/app/lib/loading";
import { ThemeProvider } from "next-themes";

require("../utils/polyfill");

const LoadSettings = dynamic(async () => Settings1, {
  loading: () => <Loading noLogo />,
});

const LoadChat = dynamic(async () => Chat, {
  loading: () => <Loading noLogo />,
});

const LoadNewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const LoadMaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isAuth = location.pathname === Path.Auth;
  const isMobileScreen = useMobileScreen();

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);

  return (
    <div
      className={
        styles.container +
        ` ${
          config.tightBorder && !isMobileScreen
            ? styles["tight-container"]
            : styles.container
        } ${getLang() === "ar" ? styles["rtl-screen"] : ""}`
      }
    >
      {isAuth ? (
        <>
          <AuthPage />
        </>
      ) : (
        <>
          <SideBar className={isHome ? styles["sidebar-show"] : ""} />

          <div className={styles["window-content"]} id={SlotID.AppBody}>
            <Routes>
              <Route path={Path.Home} element={<LoadChat />} />
              <Route path={Path.NewChat} element={<LoadNewChat />} />
              <Route path={Path.Masks} element={<LoadMaskPage />} />
              <Route path={Path.Chat} element={<LoadChat />} />
              <Route path={Path.Settings} element={<LoadSettings />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
}

export function Home() {
  // useSwitchTheme()
  useLoadData();

  useEffect(() => {
    console.log("[Config] got config from build time", getClientConfig());
    useAccessStore.getState().fetch();
  }, []);

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider attribute={"class"}>
          <Screen />
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}
