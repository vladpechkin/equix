import { FC } from "react";
import { InputProps, InputBase } from "./Base";
import { Box } from "../Box";
import { Icon } from "..";

export interface TextProps extends InputProps {
  value: string;
  onChange: (value: string) => void;
  size?: number;
  placeholder?: string;
  onClick?: () => void;
}

export const TextInput: FC<TextProps> = ({
  label,
  value,
  onChange,
  className,
  type,
  autoFocus,
  size,
  onClick,
  placeholder,
}) => (
  <InputBase as="label" className="w-full" label={label}>
    <div className="border border-borderAccent rounded-lg flex">
      <input
        value={value}
        type={type}
        className={`p-2 h-10 rounded-lg w-full ${className || ""}`}
        size={size}
        onChange={({ target }) => onChange(target.value)}
        autoFocus={autoFocus}
        placeholder={placeholder || `Enter ${label}`}
      />
      {type === "search" && (
        <Box onClick={onClick}>
          <Icon name="search" />
          Search
        </Box>
      )}
    </div>
  </InputBase>
);
