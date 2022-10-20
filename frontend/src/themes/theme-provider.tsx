import { lazy, Suspense } from "react";
import { useSettings } from "../components/settings/use-settings";
import { DARK_THEME } from "./use-theme";

const DarkTheme = lazy(() => import("./dark-theme"));
const LightTheme = lazy(() => import("./light-theme"));

export const ThemeProvider = ({ children }: any) => {
  const [settings] = useSettings();
  const darkMode = settings.theme === DARK_THEME;

  return (
    <>
      <Suspense fallback={<span />}>
        {darkMode ? <DarkTheme /> : <LightTheme />}
      </Suspense>
      {children}
    </>
  );
};
