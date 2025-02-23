import { Input } from "~/components/ui/input";
import type { FieldInterface } from "~/components/form/BatManForm";
import type { ChangeEvent } from "react";

interface InputFieldProps {
  field: FieldInterface;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = ({
  field,
  onChange = (e: ChangeEvent<HTMLInputElement>) => {},
  value,
}: InputFieldProps) => {
  const defaultvalue =
    (field.defaultValue &&
    typeof field.defaultValue === "object" &&
    "value" in field.defaultValue
      ? field.defaultValue?.value
      : field.defaultValue) || "";

  return (
    <Input
      id={field.name}
      name={field.name}
      type={field.type || "text"}
      placeholder={field.placeholder}
      required={field.required}
      className={field.className}
      value={value || (defaultvalue as string)}
      onChange={onChange}
      readOnly={field.readOnly}
      disabled={field.disabled}
    />
  );
};

export default InputField;
