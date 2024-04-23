export interface InputOption {
  name: string;
  id: string;
}

export interface Route {
  label?: string;
  href?: string;
  onClick?: () => void;
  group?: string;
}

export interface Res {
  data: {
    total: number;
    limit: number;
    page: number;
    results: number;
  };
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
