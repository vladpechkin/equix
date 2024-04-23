import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { Row } from "../../components";
import config from "../../equix/config.json";
import { InputOption } from "../types";
import {
  capitalize,
  fetchApi,
  getAdditionalEntitiesEndpoints,
  getEntityEntries,
  getEntityTemplate,
  getInputType,
  getKeyType,
  getOptions,
  renderValue,
} from "../utils";
import { Box } from "../../components/Box";
import { EntityEditorHeader } from "./EntityEditorHeader";
import { Input } from "../../components/Input";

interface Props {
  entitiesName: string;
  entityId: string;
  entityEndpoint?: string;
}

export const EntityEditor: FC<Props> = ({
  entitiesName,
  entityId,
  entityEndpoint = `${entitiesName}/${entityId}`,
}) => {
  const [initialEntity, setInitialEntity] = useState<Object>(
    getEntityTemplate(entitiesName)
  );
  const [changedEntity, setChangedEntity] = useState<Object>(
    getEntityTemplate(entitiesName)
  );
  const [innerEntityIdEntries, setInnerEntityIdEntries] = useState<
    [key: string, value: any][]
  >([]);
  const [additionalEntries, setAdditionalEntries] = useState([]);
  let changedObject: Object = {};
  const [newCashBalance, setNewCashBalance] = useState("");
  const [newCardBalance, setNewCardBalance] = useState("");
  const [fleetIds, setFleetIds] = useState("");
  const router = useRouter();

  const getChangedValue = (
    changedOption: InputOption,
    key: string,
    value: any
  ) => {
    if (changedOption?.name) {
      return changedOption?.name;
    } else {
      if (getKeyType(entitiesName, key) === "string[]") {
        return value?.replaceAll(", ", ",").split(",");
      } else return value;
    }
  };

  const renderObject = (label: string, object: Object) => (
    <Box className="flex-col border mb-4 gap-0">
      <label className="font-semibold">{capitalize(label)}</label>
      {Object.entries(object).map(([key, value], index) => (
        <div key={index}>
          {capitalize(key)}: {renderValue(key, value)}
        </div>
      ))}
      {label === "cash" && (
        <div>
          <Input
            label="Withdraw"
            type="text"
            value={newCashBalance}
            onChange={setNewCashBalance}
          />
          <Box
            onClick={() => {
              fetchApi("driverTransactions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentMethod: "CASH",
                  type: "WRITE_OFF",
                  destination: "BALANCE",
                  amount: parseInt(newCashBalance) * 100,
                  driverId: entityId,
                }),
              }).then(() => {
                setNewCashBalance("");
                router.reload();
              });
            }}
          >
            Save
          </Box>
        </div>
      )}
      {label === "card" && (
        <div>
          <Input
            label="Withdraw"
            type="text"
            value={newCardBalance}
            onChange={setNewCardBalance}
          />
          <Box
            onClick={() => {
              fetchApi("driverTransactions", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentMethod: "CARD",
                  type: "DEBIT",
                  destination: "BALANCE",
                  amount: parseInt(newCardBalance) * 100,
                  driverId: entityId,
                }),
              }).then(() => {
                setNewCardBalance("");
                router.reload();
              });
            }}
          >
            Save
          </Box>
        </div>
      )}
    </Box>
  );

  const renderEntry = (entry: [string, any]) => {
    const [key, value] = entry;
    if (key.includes("Id")) return;
    if (value) {
      if (Array.isArray(value) && key !== "carModels") {
        if (typeof value[0] === "object") {
          return value.map((object: any, index) =>
            renderObject(`${key.slice(0, -1)} ${index + 1}`, object)
          );
        } else
          return (
            <Box className="border mb-4 gap-0">
              {capitalize(key)}: {value.toString()}
            </Box>
          );
      }
      if (typeof value === "object" && key !== "carModels") {
        return renderObject(key, value);
      }
    }
    return (
      <div className="mb-4">
        <Input
          key={key}
          label={
            // @ts-ignore
            config.renamed_fields[key] ||
            capitalize(key).replace(/([a-z])([A-Z])/g, "$1 $2")
          }
          type={getInputType(entitiesName, key, value)}
          value={
            getInputType(entitiesName, key, value) === "date"
              ? (changedEntity as any)[key]
              : key.toLowerCase().includes("fee")
              ? `${value * 100}%`
              : key === "cashLimit" || key === "price"
              ? value / 100
              : getInputType(entitiesName, key, value) === "radio"
              ? getOptions(entitiesName, key).find(
                  (option) => option.name === (changedEntity as any)[key]
                )
              : parseInt(value)
              ? String(Math.round((changedEntity as any)[key] * 10) / 10)
              : value === null
              ? ""
              : (changedEntity as any)[key]
          }
          isCollapsed
          onChange={(value: any) => {
            const changedOption = getOptions(entitiesName, key).find(
              (option) => option.id === value.id
            );

            // @ts-ignore
            changedObject[key] = getChangedValue(changedOption, key, value);
            setChangedEntity((prevState: any) => ({
              ...prevState,
              ...changedObject,
            }));
          }}
          options={
            getInputType(entitiesName, key, value) === "radio"
              ? getOptions(entitiesName, key)
              : undefined
          }
        />
      </div>
    );
  };

  useEffect(() => {
    if (entityId !== "new") {
      fetchApi(entityEndpoint)
        .then((res) => res.json())
        .then((res) => {
          let entity = res.data;
          const additionalEntityEndpoints =
            // @ts-ignore
            config.additional_entity_endpoints[
              capitalize(entitiesName as string)
            ];

          if (additionalEntityEndpoints) {
            additionalEntityEndpoints.map((endpoint: string) =>
              fetchApi(
                `${entityEndpoint}/${endpoint}${
                  endpoint.includes("?")
                    ? `/${entity[endpoint.split("?")[-1]]}`
                    : ""
                }`
              )
                .then((res) => res.json())
                .then((res) => {
                  // @ts-ignore
                  setAdditionalEntries(Object.entries(res.data));
                })
            );
          }

          if (setInnerEntityIdEntries) {
            const configKeys = Object.keys(
              // @ts-ignore
              config.entities[capitalize(entitiesName.slice(0, -1))]
            );
            const entries: [key: string, value: any][] = [];
            configKeys.map(
              (key) => key.includes("Id") && entries.push([key, entity[key]])
            );
            setInnerEntityIdEntries(entries);
          }

          entitiesName === "drivers" &&
            fetchApi(`fleets?driverId=${entityId}`)
              .then((res) => res.json())
              .then((res) =>
                setFleetIds(
                  res.data.results.map((fleet: any) => fleet.id).join(",")
                )
              );

          setInitialEntity(entity);
          setChangedEntity(entity);
        });
    }
  }, []);

  return entitiesName ? (
    <div className="w-full max-w-[800px] mx-auto">
      <EntityEditorHeader
        entitiesName={entitiesName}
        entityId={entityId}
        changedEntity={changedEntity}
        initialEntity={initialEntity}
      />
      <div className="flex">
        {getAdditionalEntitiesEndpoints(entitiesName as string)?.map(
          (endpoint: string, index: number) => (
            <a
              className="p-2 text-blue-700"
              href={`/${endpoint}=${entityId}`}
              key={index}
            >
              {capitalize(endpoint.split("?")[0])}
            </a>
          )
        )}
        {innerEntityIdEntries?.map(([key, value], index) => {
          const entityName = key.replace("Id", "s").replace("ss", "s");
          return (
            <a
              className="p-2 text-blue-700"
              key={index}
              href={`/${entityName}/${value || "new"}`}
            >
              {capitalize(entityName.slice(0, -1))}
            </a>
          );
        })}
      </div>
      <div className="columns-2 gap-4">
        {initialEntity &&
          entitiesName &&
          getEntityEntries(initialEntity, entitiesName as string)?.map(
            renderEntry
          )}
        {additionalEntries?.map(renderEntry)}
        {entitiesName === "drivers" && (
          <Row>
            <div>
              <Input
                label="Fleet ids"
                type="text"
                value={fleetIds}
                onChange={setFleetIds}
              />
              <Box
                onClick={() => {
                  fetchApi(`drivers/${entityId}/fleets`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      fleets: fleetIds
                        .replaceAll(" ", "")
                        .split(",")
                        .map((id) => parseInt(id)),
                    }),
                  });
                  setFleetIds("");
                }}
              >
                Save
              </Box>
            </div>
          </Row>
        )}
      </div>
    </div>
  ) : null;
};
