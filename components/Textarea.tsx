import { FC } from "react";
import { InputBase } from "./Input/Base";
import { TextProps } from "./Input/Text";

export const Textarea: FC<TextProps> = ({
  value,
  onChange,
  label,
  className,
}) => (
  <InputBase as="label" label={label}>
    <textarea
      className={`flex items-center border border-accent px-2 py-1 min-h-[2.5rem] ${
        className || ""
      }`}
      value={value}
      onChange={({ target }) => onChange(target.value)}
    ></textarea>
  </InputBase>
);
