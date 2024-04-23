import router from "next/router";
import { FC } from "react";
import { Icon } from "../../components";
import {
  areEntitiesEqual,
  capitalize,
  deleteEntity,
  fetchApi,
  submitEntity,
} from "../utils";
import { Box } from "../../components/Box";

interface Props {
  entitiesName: string;
  entityId: string;
  changedEntity: Object;
  initialEntity: Object;
}

export const EntityEditorHeader: FC<Props> = ({
  entitiesName,
  entityId,
  changedEntity,
  initialEntity,
}) => (
  <div className="flex items-center">
    <Box onClick={() => (window.location.href = `/${entitiesName}/`)}>
      <Icon name="chevron-left" /> Go back
    </Box>
    <h1 className="font-semibold p-2">
      {capitalize(entitiesName.slice(0, -1))}
    </h1>
    <div className="flex">
      {entityId !== "new" && (
        <Box
          className="text-red-700 focus:bg-red-700/20"
          onClick={() => {
            const confirmed = confirm("Confirm deletion");
            if (confirmed) {
              deleteEntity(entitiesName as string, entityId as string);
              router.push(`/${entitiesName}`);
            }
          }}
        >
          Delete
        </Box>
      )}
      {changedEntity && !areEntitiesEqual(initialEntity, changedEntity) && (
        <Box
          className="text-accent"
          onClick={() => {
            submitEntity(
              entitiesName as string,
              changedEntity,
              entityId as string
            );
          }}
        >
          Save
        </Box>
      )}
      {(entitiesName === "drivers" ||
        entitiesName === "withdrawalRequests") && (
        <Box
          onClick={() =>
            fetchApi(`${entitiesName}/${entityId}/approve`, {
              method: "PATCH",
            })
              .then((res) => res.json())
              .then((res) => res && alert("Success"))
          }
        >
          Approve
        </Box>
      )}
    </div>
  </div>
);
