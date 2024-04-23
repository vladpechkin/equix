import { ElementType, FC, ReactNode } from "react";

interface Props {
  className?: string;
  children?: ReactNode;
  as?: ElementType;
  id?: string;
}

export const Row: FC<Props> = (props) => {
  const { className, as } = props;
  const Element = as || "div";
  return <Element {...props} className={`flex gap-2 ${className}`} />;
};

export const Col: FC<Props> = (props) => (
  <Row {...props} className={`flex-col items-start ${props.className}`} />
);
