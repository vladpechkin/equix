import { FC } from "react";
import { Icon, Row } from ".";
import { Box } from "./Box";

interface Props {
  limit?: number;
  page: number;
  setPage: (value: number) => void;
}

export const Pagination: FC<Props> = ({ limit, page, setPage }) =>
  !limit || limit > 1 ? (
    <Row>
      {typeof limit === "number" && limit > 0 && <Box>Page:</Box>}
      {page > 0 && (
        <Box onClick={() => setPage(page - 1)}>
          <Icon name="chevron-left" />
        </Box>
      )}
      {typeof limit === "number" &&
        limit > 0 &&
        [...Array(limit)].map((_, index) => (
          <Box
            key={index}
            onClick={() => setPage(index)}
            className={`justify-center ${page === index ? "focused" : ""}`}
          >
            {index + 1}
          </Box>
        ))}
      {typeof limit === "number" && page + 1 < limit && (
        <Box onClick={() => setPage(page + 1)}>
          <Icon name="chevron-right" />
        </Box>
      )}
    </Row>
  ) : null;
