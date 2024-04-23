import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useState } from "react";
import { Icon, Row } from "../../components";
import config from "../config.json";
import { capitalize, fetchApi, renderValue } from "./../utils";
import { Box } from "../../components/Box";
import { Input } from "../../components/Input";
import { Pagination } from "../../components/Pagination";
import { Tr } from "./Table";

interface Props {
  entitiesName: string;
  title?: string;
  entitiesEndpoint?: string | URL;
  entityEndpoint?: URL;
}

export const EntitiesEditor: FC<Props> = ({
  title,
  entitiesName,
  entitiesEndpoint = entitiesName as string,
  entityEndpoint,
}) => {
  if (entitiesName === "newDrivers") {
    entitiesName = "drivers";
    entitiesEndpoint = `drivers?state=NEW`;
  }
  const router = useRouter();
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [entities, setEntities] = useState<Object[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<number>();

  const fetchEntities = () =>
    fetchApi(
      `${entitiesEndpoint}${
        entitiesEndpoint.toString().includes("?") ? "&" : "?"
      }page=${page.toString()}`
    )
      .then((res) => res.json())
      .then((res) => {
        setEntities(res.data.results);
        res?.data?.total && setLimit(Math.round(res.data.total / 20));
      });

  useEffect(() => {
    fetchEntities();
  }, [entitiesName, page]);

  const getSortedEntities = useCallback(
    () =>
      sortKey
        ? entities.sort((a, b) =>
            (a as any)[sortKey]
              ?.toString()
              .localeCompare((b as any)[sortKey].toString())
          )
        : entities,
    [entities, sortKey]
  );

  const getEntityEntries = useCallback(
    (entity: Object) =>
      Object.entries(entity).filter(
        ([key]) =>
          !(config.collapsed_fields.ALL as string[]).includes(key) &&
          !config.hidden_fields.ALL.includes(key) &&
          // @ts-ignore
          !config.collapsed_fields[capitalize(entitiesName)]?.includes(key) &&
          // @ts-ignore
          !config.hidden_fields[capitalize(entitiesName)]?.includes(key)
      ),
    [entitiesName, entities]
  );

  return (
    <div>
      <Row className="items-center flex-wrap">
        <h1 className="font-semibold p-2">
          {title || capitalize(entitiesName).replaceAll("_", " ")}
        </h1>
        <Input
          value={searchQuery}
          onChange={setSearchQuery}
          type="search"
          placeholder="Enter search query"
          autoFocus
          onClick={() => {
            if (entitiesEndpoint instanceof URL)
              entitiesEndpoint.searchParams.set(
                "search",
                searchQuery.toLowerCase()
              );
            fetchEntities();
          }}
        />
        <Box href={`/${entitiesName.toLowerCase()}/new`}>
          <Icon name="plus-lg" />
          Create new
        </Box>
      </Row>
      {entities && entities[0] && getSortedEntities().length > 0 ? (
        <table>
          <thead>
            <Tr>
              {getEntityEntries(entities[0]).map(([key], index) => (
                <td
                  key={index}
                  className="p-2 font-semibold"
                  onClick={() => setSortKey(key)}
                >
                  <span className="flex items-center gap-2">
                    {capitalize(key).replace(/([a-z])([A-Z])/g, "$1 $2")}
                    {sortKey === key && <i className="bi bi-sort-down-alt"></i>}
                  </span>
                </td>
              ))}
              <td className="p-2 font-semibold">Actions</td>
            </Tr>
          </thead>
          <tbody>
            {getSortedEntities().map((entity, entityIndex) => (
              <Tr key={entityIndex}>
                {getEntityEntries(entity).map(([key, value], index) => (
                  <td key={index} className="p-2">
                    <span className="w-full break-all line-clamp-1">
                      {renderValue(key, value)}
                    </span>
                  </td>
                ))}
                <td className="p-0">
                  <Box
                    // @ts-ignore
                    // href={`/${entitiesName.toLowerCase()}/${entity.id}`}
                    onClick={() =>
                      router
                        .replace(
                          entityEndpoint ||
                            // @ts-ignore
                            `/${entitiesName}/${entity.id}`
                        )
                        .then(() => router.reload())
                    }
                    className="p-0 h-auto"
                  >
                    <Icon name="pencil" />
                    Edit
                  </Box>
                </td>
              </Tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Tr className="h-full">
          <td colSpan={100} className="text-gray-400 text-center h-full">
            Nothing found
          </td>
        </Tr>
      )}
      <Pagination limit={limit} page={page} setPage={setPage} />
    </div>
  );
};
// <EntitiesEditor
// entitiesName="drivers"
// entitiesEndpoint={`drivers?state=MODERATION`}
// />
