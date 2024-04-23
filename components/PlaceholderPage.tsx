import Router, { useRouter } from "next/router";
import { Box } from "./Box";
import { Row, Col } from ".";
import { LandingLayout } from "../Landing/LandingLayout";
import { Icon } from "./Icon";

export const PlaceholderPage = () => {
  const router = useRouter();

  return (
    <LandingLayout>
      <Col className="items-center">
        <h2 className="font-semibold p-2">
          This page is under development, check back later.
        </h2>
        <Row className="flex-wrap">
          <Box onClick={() => Router.back()}>
            <Icon name="chevron-left" />
            Go back
          </Box>
          <Box onClick={() => router.push("/")}>
            <Icon name="house" />
            Go to homepage
          </Box>
        </Row>
      </Col>
    </LandingLayout>
  );
};
