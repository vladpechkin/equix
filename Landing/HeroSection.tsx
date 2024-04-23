import { Row, Col } from "../components";
import { Box } from "../components/Box";
import config from "./config";
import { Card } from "../components/Card";
import { H1 } from "../components/Heading";

export const HeroSection = () => {
  const { heroImageSrc, title, description, heading } = config;
  return (
    <Row>
      <Col className="w-full justify-center">
        <H1>{heading}</H1>
        <p>{description}</p>
        <Box className="bg-accent text-light h-auto">Попробовать</Box>
      </Col>
      <img
        className="object-cover rounded max-w-[460px] w-full min-w-0"
        src={heroImageSrc}
        alt={title}
      />
    </Row>
  );
};
