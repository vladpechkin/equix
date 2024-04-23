import { FC, ReactNode } from "react";
import { Col } from ".";

interface Props {
  children: ReactNode;
}

export const Card: FC<Props> = (props) => (
  <Col
    {...props}
    className="border border-border rounded p-4 max-w-[460px] w-full"
  >
    {props.children}
  </Col>
);
