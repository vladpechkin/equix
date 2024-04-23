import Link from "next/link";
import { Row } from ".";
import { Bar } from "./Bar";
import { Box } from "./Box";
import { FC, ReactNode } from "react";
import { Route } from "../types";

interface Props {
  logo: ReactNode;
  routes: Route[];
  children?: ReactNode;
}

export const Header: FC<Props> = (props) => {
  const { logo, routes, children } = props;
  return (
    <Bar as="header" position="top" className="justify-between">
      {logo}
      <Row>
        {routes?.map((route, index) => (
          <Box key={index} {...route}>
            {route.label || route.href}
          </Box>
        ))}
        {children}
      </Row>
    </Bar>
  );
};
