"use client";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export const ModeToggle = () => {
  const { setTheme, theme } = useTheme();
  useEffect(() => {
    setTheme(getTheme() ?? 'dark');
  }, []);

  const getTheme = () => {
    if (!localStorage.getItem("theme")) localStorage.setItem("theme", "dark");
    return localStorage.getItem("theme");
  };

  const changeTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    setTheme(theme);
  };
  return (
    <Switch
      checked={getTheme() === "dark"}
      onCheckedChange={() => changeTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};
