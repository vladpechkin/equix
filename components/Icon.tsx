import { FC, HTMLAttributes } from "react";

interface I extends HTMLAttributes<HTMLElement> {
  name: string;
}

export const Icon: FC<I> = (props) => (
  <i {...props} className={`bi bi-${props.name} ${props.className}`}></i>
);
