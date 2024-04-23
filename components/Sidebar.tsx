import { FC } from "react";
import { Bar } from "./Bar";
import { Route } from "../types";
import { Box } from "./Box";
import { Details } from "./Details";

interface Props {
  routes: Route[];
}

export const Sidebar: FC<Props> = (props) => {
  const { routes } = props;

  const groups = [...new Set(routes.map((route) => route.group))].filter(
    (x) => !!x
  );
  return (
    <Bar position="left" className="w-[320px]">
      {routes.map(
        (route, index) =>
          !route.group && (
            <Box isStrictHref key={index} {...route}>
              {route.label || route.href}
            </Box>
          )
      )}
      {/* {groups.map((group, index) => (
        <li key={index} className="w-full">
          <Details summary={group as string} open>
            <ul className="flex flex-col gap-2">
              {routes.map(
                (route, index) =>
                  route.group &&
                  route.group === group && (
                    <Box key={index} {...route}>
                      {route.label || route.href}
                    </Box>
                  )
              )}
            </ul>
          </Details>
        </li>
      ))} */}
    </Bar>
  );
};
