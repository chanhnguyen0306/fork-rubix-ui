import { useEffect, useState } from "react";

const DARK_MODE = "dark-mode";
const _darkMode = JSON.parse("" + localStorage.getItem(DARK_MODE)) || false;

const getDarkMode = () => _darkMode;

export const useTheme = () => {
  const [darkMode, setDarkMode] = useState(getDarkMode);

  useEffect(() => {
    const initialValue = getDarkMode();
    if (initialValue !== darkMode) {
      localStorage.setItem(DARK_MODE, darkMode.toString());
      window.location.reload();
    }
  }, [darkMode]);

  return [darkMode, setDarkMode];
};
