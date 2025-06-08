import type { FieldInterface } from "@/components/form/BatManForm";
import InputField from "@/components/form/InputField";
import FieldWithLabelWrapper from "@/components/form/FieldWithLabelWrapper";
import PasswordField from "@/components/form/PasswordField";

interface BatManFormInputProps {
  field: FieldInterface;
  [key: string]: unknown;
}
const BatManFormInput = ({ field, ...props }: BatManFormInputProps) => {
  if (!field.label)
    return (
      <>
        {field.type === "password" && (
          <PasswordField field={field} {...props} />
        )}
        {field.type !== "password" && <InputField field={field} {...props} />}
      </>
    );

  return (
    <FieldWithLabelWrapper field={field}>
      {field.type === "password" && <PasswordField field={field} {...props} />}
      {field.type !== "password" && <InputField field={field} {...props} />}
    </FieldWithLabelWrapper>
  );
};

export default BatManFormInput;
