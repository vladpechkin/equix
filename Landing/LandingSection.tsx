import { FC } from "react";
import { Col } from "../components";
import { Section } from "./types";
import { H2 } from "../components/Heading";

export const LandingSection: FC<Section> = (props) => {
  const { heading, children } = props;
  return (
    <Col as="section" className="w-full" id={heading?.replaceAll(" ", "_")}>
      <H2 className="font-semibold text-[24px]">{heading}</H2>
      {children}
    </Col>
  );
};
