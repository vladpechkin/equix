"use client";

import { FC, ReactNode } from "react";
import { Bar } from "../components/Bar";
import { Box } from "../components/Box";
import {
  DarkThemeProvider,
  DarkThemeToggle,
} from "../components/DarkThemeProvider";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { View } from "../components/View";
import { Col } from "../components";
import { Route } from "../types";
import { LandingSection } from "./LandingSection";
import config from "./config";
import { Section } from "./types";

interface Props {
  sections?: Section[];
  className?: string;
  children?: ReactNode;
  sidebarRoutes?: Route[];
}

export const LandingLayout: FC<Props> = (props) => {
  const { className, sections, children, sidebarRoutes } = props;
  const { logo, routes, siteName } = config;
  return (
    <DarkThemeProvider>
      <div
        className={`dark:bg-dark dark:text-light bg-light text-dark min-h-screen flex flex-col items-center  
      ${className || ""}`}
      >
        <Header
          logo={logo}
          routes={
            routes ||
            sections?.map(
              ({ heading }) =>
                heading && {
                  href: `#${heading.replaceAll(" ", "_")}`,
                  label: heading,
                }
            )
          }
        />
        <div className="flex grow max-w-[944px] w-full">
          {sidebarRoutes && <Sidebar routes={sidebarRoutes} />}
          <View as="main" className="items-center gap">
            <Col className="w-full h-full p gap-8">
              {children}
              {sections?.map((section, index) => (
                <LandingSection {...section} key={index} />
              ))}
            </Col>
          </View>
        </div>
        <Bar as="footer" className="justify-between" position="bottom">
          <div>
            © {new Date().getFullYear()} {siteName}
          </div>
          <div>
            Создано с помощью{" "}
            <Box as="a" isinline href="https://equix.ru">
              EQUIX/Лендинг
            </Box>
          </div>
          <DarkThemeToggle />
        </Bar>
      </div>
    </DarkThemeProvider>
  );
};
