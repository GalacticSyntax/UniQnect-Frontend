import type { ChangeEvent } from "react";
import type { FieldInterface } from "@/components/form/BatManForm";
import { Textarea } from "@/components/ui/textarea";

interface TextAreaFieldProps {
  field: FieldInterface;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField = ({
  field,
  onChange = () => {},
  value,
}: TextAreaFieldProps) => {
  const defaultvalue =
    (field.defaultValue &&
    typeof field.defaultValue === "object" &&
    "value" in field.defaultValue
      ? field.defaultValue?.value
      : field.defaultValue) || "";

  return (
    <Textarea
      id={field.name}
      name={field.name}
      placeholder={field.placeholder}
      required={field.required}
      className={field.className}
      value={value || (defaultvalue as string)}
      onChange={onChange}
    />
  );
};

export default TextAreaField;
