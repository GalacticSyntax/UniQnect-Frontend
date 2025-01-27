import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { FieldInterface } from "~/components/form/BatManForm";
import { cn } from "~/lib/utils";

interface SlectFieldProps {
  field: FieldInterface;
  value?: string;
  onChange?: (value: string, name: string) => void;
}

const SelectField = ({ field, value, onChange }: SlectFieldProps) => {
  const defaultvalue =
    (field.defaultValue &&
    typeof field.defaultValue === "object" &&
    "value" in field.defaultValue
      ? field.defaultValue?.value
      : field.defaultValue) || "";

  const handleChange = (value: string) => {
    field.name && onChange && onChange(value, field.name);
  };

  return (
    <Select
      name={field.name}
      onValueChange={handleChange}
      value={value || (defaultvalue as string)}
    >
      <SelectTrigger className={cn("w-[180px]", field.className)}>
        <SelectValue
          id={field.name}
          placeholder={field.placeholder || field.label}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {field.options &&
            field.options.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.value}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectField;
