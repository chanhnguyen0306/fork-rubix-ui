import { useEffect } from "react";

export const useCtrlPressKey = (
  key: string,
  callback: (e: KeyboardEvent) => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === key) callback(e);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, callback]);
};
