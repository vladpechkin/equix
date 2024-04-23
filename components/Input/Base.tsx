import { ElementType, FC, ReactNode } from "react";

export interface InputProps {
  type?:
    | "text"
    | "checkbox"
    | "radio"
    | "date"
    | "time"
    | "tel"
    | "email"
    | "search"
    | "image";
  label?: string;
  errorMessage?: string;
  className?: string;
  autoFocus?: boolean;
}

interface InputBaseProps {
  as?: ElementType;
  className?: string;
  errorMessage?: string;
  children: ReactNode;
  isRequired?: boolean;
  label?: string;
}

export const InputBase: FC<InputBaseProps> = ({
  as = "label",
  className,
  children,
  errorMessage,
  label,
  isRequired,
}) => {
  const Element = as;
  return (
    <Element className={`max-w-screen-sm ${className || ""}`}>
      {label && (
        <span className="whitespace-nowrap">
          {label} {isRequired ? "*" : ""}
        </span>
      )}
      {children}
      {errorMessage && <span className="text-red-700">{errorMessage}</span>}
    </Element>
  );
};
