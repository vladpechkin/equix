import { FC } from "react";
import { InputBase } from "./Base";
import { TextProps } from "./Text";
import { Icon } from "..";
import { Box } from "../Box";

export interface DateProps extends TextProps {
  dateOptions?: Intl.DateTimeFormatOptions;
  inline?: boolean;
}

export const DateInput: FC<DateProps> = ({
  label,
  value,
  onChange,
  dateOptions,
  inline,
}) => {
  return (
    <InputBase
      className={`relative ${inline ? "flex items-center gap-1" : ""}`}
      label={label}
    >
      <div className="border border-borderAccent rounded-lg flex">
        <input
          type="text"
          className="p-2 h-10 rounded-lg w-full"
          value={value ? new Date(value).toLocaleDateString("ru") : ""}
        />
        <Box className="justify-center w-10" onClick={() => {}}>
          <Icon name="calendar" />
        </Box>
      </div>
      <input
        type="date"
        value={new Date(value).toString()}
        className="w-10 h-10 absolute opacity-0 bottom-2 right-2 text-4xl"
        onChange={({ target }) => onChange(target.value)}
      />
    </InputBase>
  );
};
