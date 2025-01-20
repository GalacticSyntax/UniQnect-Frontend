import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { FieldInterface } from "~/components/form/BatManForm";

interface SlectFieldProps {
  field: FieldInterface;
}

const SelectField = ({ field }: SlectFieldProps) => {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue
          id={field.name}
          placeholder={field.placeholder || field.label}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {field.options &&
            field.options.map((option) => (
              <SelectItem value={option.id}>{option.value}</SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectField;
