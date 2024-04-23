import config from "./Admin/config.json";
import { InputOption } from "./types";

export const areEntitiesEqual = (x: any, y: any): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === "object" && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => areEntitiesEqual(x[key], y[key]))
    : x === y;
};

export const getMonthLength = (month: number, year: number) => {
  if (month === 2 && year % 4 == 0 && year % 100 != 0) return 29;
  switch (month) {
    case 2:
      return 28;
    case 4:
    case 6:
    case 9:
    case 10:
      return 30;
    default:
      return 31;
  }
};

export const capitalize = (word: string) =>
  word.charAt && word.charAt(0)?.toUpperCase() + word.slice(1);

export const toOptions = (arr: readonly string[]): InputOption[] =>
  arr.map((name, index) => ({
    name,
    id: index.toString(),
  }));

export const getKeyType = (entitiesName: string, key: string) => {
  // @ts-ignore
  return config.entities[capitalize(entitiesName.slice(0, -1))][key];
};

export const getInputDate = (date: Date) =>
  date ? date.toLocaleDateString("ru").split(".").reverse().join("-") : "";

export const convertInputDateToIso = (string: string) => {
  const dmy = string.split("-").reverse();
  const date = new Date();
  date.setDate(parseInt(dmy[0]));
  date.setMonth(parseInt(dmy[1]));
  date.setFullYear(parseInt(dmy[2]));
  return date.toISOString();
};

export const getEntityEntries = (initialEntity: Object, entitiesName: string) =>
  initialEntity &&
  Object.entries(initialEntity).filter(
    ([key]) =>
      !config.hidden_fields.ALL.includes(key) &&
      // @ts-ignore
      !config.hidden_fields[entitiesName]?.includes(key)
  );

export const getInputType = (entitiesName: string, key: string, value: any) => {
  const keyType = getKeyType(entitiesName, key);
  if (value?.toString().match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i)) {
    return "image";
  }
  switch (keyType) {
    case "string":
    case "string[]":
    case "any":
    case "number":
      return "text";
    case "Date":
      return "date";
    default:
      return "radio";
  }
};

export const getOptions = (entitiesName: string, key: string) => {
  const keyEnum =
    // @ts-ignore
    config.enums[capitalize(key)] ||
    // @ts-ignore
    config.enums[capitalize(entitiesName.slice(0, -1)) + capitalize(key)];
  return keyEnum ? toOptions(Object.keys(keyEnum)) : toOptions(["true"]);
};

export const getEntityTemplate = (entitiesName: string) => {
  // @ts-ignore
  const entity = config?.entities[capitalize(entitiesName?.slice(0, -1))];
  return entity
    ? Object.fromEntries(Object.entries(entity)?.map(([key]) => [key, ""]))
    : {};
};

const convertObjectEntriesToStrings = (object: Object) => {
  const newObject: Record<string, string> = {};
  Object.entries(object).map(([key, value]) => {
    newObject[key.toString()] = value.toString();
  });
  return newObject;
};

export const getUrlWithParams = (url: string, params: object) =>
  `${url}?${new URLSearchParams(
    convertObjectEntriesToStrings(params)
  ).toString()}`;

export const getMonthAgo = () => {
  const date = new Date(Date.now());
  date.setMonth(new Date(Date.now()).getMonth() - 1);
  return date;
};

export const getWeekAgo = () => {
  const date = new Date(Date.now());
  date.setDate(new Date(Date.now()).getDay() - 7);
  return date;
};

export const getAdditionalEntitiesEndpoints = (entitiesName: string) =>
  // @ts-ignore
  config.additional_entities_endpoints[capitalize(entitiesName as string)];

export const renderValue = (key: string, value: any) => {
  if (value === null) return "";
  if (key.toLowerCase().includes("fee")) return `${value * 100}%`;
  if (
    key === "cashLimit" ||
    key === "amount" ||
    key.toLowerCase().includes("balance") ||
    key.toLowerCase().includes("price")
  )
    return value / 100;
  if (key.toLowerCase().includes("rating"))
    return String(Math.round(value * 10) / 10);
  if (
    new RegExp(
      "^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$"
    ).test(value)
  )
    return new Date(value).toLocaleDateString("ru");
  if (typeof value === "string" && (value as string).includes(".jpeg"))
    return <img src={value} className="rounded-lg h-10 w-10" />;
  if (parseInt(value)) {
    return String(Math.round(value * 10) / 10);
  }
  return value;
};

export const fetchApi = (endpoint: string, options?: RequestInit) =>
  fetch(`${process.env.NEXT_PUBLIC_API}/${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      ...options?.headers,
    },
  }).then((res) => {
    // alert(res.status)
    if (res.status === 401) {
      localStorage.clear();
      // Router.push("/auth");
    }
    return res;
  });

export const submitEntity = (
  entitiesName: string,
  entity: Object,
  id?: string
) =>
  fetchApi(
    `${entitiesName.toLowerCase()}${id && id !== "new" ? `/${id}` : ""}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: id && id !== "new" ? "PATCH" : "POST",
      body: JSON.stringify(entity),
    }
  ).then((res) => alert(res.ok ? "Success" : "Error"));

export const deleteEntity = (entitiesName: string, id: string) =>
  fetchApi(`${entitiesName.toLowerCase()}/${id}`, {
    method: "DELETE",
  });

const options: RequestInit = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(process.env.NEXT_PUBLIC_AUTH as string)}`,
  },
  redirect: "error",
};

export const postOctetStream = (url: string, filename: string) =>
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/octet-stream",
    },
    method: "POST",
  })
    .then((res) => res.json())
    .then((dataObjToWrite) => {
      const blob = new Blob([JSON.stringify(dataObjToWrite)], {
        type: "text/json",
      });
      const link = document.createElement("a");

      link.download = filename;
      link.href = window.URL.createObjectURL(blob);
      link.dataset.downloadurl = ["text/json", link.download, link.href].join(
        ":"
      );

      const evt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      link.dispatchEvent(evt);
      link.remove();
    });

// REORDER LIST UP/DOWN
// const [sortedClips, setSortedClips] = useState<Clip[]>([]);
// const onMoveUp = (key: number) => {
//   if (key === 0) return;
//   const items = [...sortedClips];
//   const index = key - 1;
//   const itemAbove = items[index];
//   items[key - 1] = items[key];
//   items[key] = itemAbove;
//   console.log(items);
//   setSortedClips(items);
// };

// const onMoveDown = (key: number) => {
//   const items = [...sortedClips];
//   if (key === items.length - 1) return;
//   const index = key + 1;
//   const itemBelow = items[index];
//   items[key + 1] = items[key];
//   items[key] = itemBelow;
//   setSortedClips(items);
// };
