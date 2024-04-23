import { useRouter } from "next/navigation";
import { FC, ReactNode, useEffect, useState } from "react";
import { Box } from "./Box";

interface Props {
  children: ReactNode;
}

export const DarkThemeProvider: FC<Props> = (props) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const isDarkThemeSelected = localStorage.getItem("dark-theme");
    console.log(isDarkThemeSelected);
    if (
      isDarkThemeSelected === "true" ||
      (isDarkThemeSelected === null &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.body.classList.add("dark");
    }
    if (isDarkThemeSelected === "false") {
      document.body.classList.remove("dark");
    }
    setIsLoading(false);
  }, []);
  return !isLoading ? children : null;
};

export const DarkThemeToggle = () => {
  const isDarkThemeSelected = localStorage.getItem("dark-theme");
  return (
    <Box
      onClick={() => {
        localStorage.setItem("dark-theme", `${!isDarkThemeSelected}`);
      }}
    >
      {isDarkThemeSelected ? "Светлая тема" : "Темная тема"}
    </Box>
  );
};
