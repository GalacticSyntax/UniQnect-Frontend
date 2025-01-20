import type { FieldInterface } from "~/components/form/BatManForm";
import InputField from "~/components/form/InputField";
import FieldWithLabelWrapper from "~/components/form/FieldWithLabelWrapper";

interface BatManFormInputProps {
  field: FieldInterface;
}
const BatManFormInput = ({ field }: BatManFormInputProps) => {
  if (!field.label) return <InputField field={field} />;

  return (
    <FieldWithLabelWrapper field={field}>
      <InputField field={field} />
    </FieldWithLabelWrapper>
  );
};

export default BatManFormInput;
