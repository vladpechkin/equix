import { FC, useState } from "react";
import { Input } from ".";
import { Dialog } from "../Dialog";
import { InputProps, InputBase } from "./Base";
import { InputOption } from "@/equix/types";
import { Icon } from "..";
import { capitalize } from "@/equix/utils";
import { Box } from "../Box";

type OnChange = (value: InputOption) => void;

type NullableOnChange = (value: InputOption | null) => void;

export interface RadioProps extends InputProps {
  minOptions?: number;
  options: InputOption[];
  value?: InputOption;
  onChange: OnChange | NullableOnChange;
  isCollapsed?: boolean;
}

export const Radio: FC<RadioProps> = ({
  label,
  minOptions = 0,
  options,
  value = null,
  onChange,
  className,
  isCollapsed = false,
}) => {
  const handleChange = (option: InputOption) => {
    if (minOptions === 1 && value?.id === option.id) return;

    // @ts-ignore
    (onChange as NullableOnChange)(
      value?.id === option.id
        ? options[0].name === "true"
          ? ({ id: "1", name: "false" } as InputOption)
          : null
        : option
    );

    if (isDialogOpen) setIsDialogOpen(false);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isSwitch = options.length === 1;

  const Option = ({ option }: { option: InputOption }) => (
    <label
      className={`flex gap-2 w-full ${isSwitch ? "" : "relative p-2"}`}
      onClick={() => handleChange(option)}
    >
      <input
        type="radio"
        checked={value?.id === option.id}
        onChange={() => {}}
        className="w-full top-0 left-0 h-full absolute opacity-0"
      />
      <Icon
        name={
          value?.name === "true" || option.id === value?.id
            ? "check-circle-fill"
            : "circle"
        }
        className="text-accent"
      />
      {option.name !== "true" &&
        capitalize(option.name.toLowerCase()).replaceAll("_", " ")}
    </label>
  );

  const renderOptions = (options: InputOption[]) => (
    <div className="flex flex-col">
      {options?.length > 0 ? (
        options.map((option, index) => <Option option={option} key={index} />)
      ) : (
        <span className="text-gray-400">Nothing found</span>
      )}
    </div>
  );

  return (
    <>
      <InputBase
        as="div"
        className={`${
          isSwitch ? "relative flex gap-2 h-full items-center" : ""
        } ${className || ""}`}
        label={label}
      >
        <div
          className={`flex flex-col ${
            isSwitch ? "order-[-1]" : "border border-borderAccent rounded-lg"
          } col-1`}
        >
          {!isSwitch && isCollapsed ? (
            <Box
              onClick={() => setIsDialogOpen(true)}
              className="text-black justify-between"
            >
              <span>{value?.name}</span>
              <Icon name="chevron-down" className="text-accent" />
            </Box>
          ) : (
            renderOptions(options)
          )}
        </div>
      </InputBase>
      <Dialog
        title={label!}
        isOpen={isDialogOpen}
        close={() => setIsDialogOpen(false)}
      >
        {options.length > 10 && (
          <Input
            type="search"
            value={searchQuery}
            onChange={setSearchQuery}
            autoFocus
          />
        )}
        {renderOptions(
          options?.filter((option) =>
            option?.name?.toLowerCase().includes(searchQuery?.toLowerCase())
          )
        )}
      </Dialog>
    </>
  );
};
