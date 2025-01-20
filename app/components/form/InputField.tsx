import { Input } from "~/components/ui/input";
import type { FieldInterface } from "~/components/form/BatManForm";

interface InputFieldProps {
  field: FieldInterface;
}

const InputField = ({ field }: InputFieldProps) => {
  return (
    <Input
      id={field.name}
      type={field.type || "text"}
      placeholder={field.placeholder}
      required={field.required}
      className={field.className}
    />
  );
};

export default InputField;
