import type { FieldInterface } from "@/components/form/BatManForm";
import FieldWithLabelWrapper from "@/components/form/FieldWithLabelWrapper";
import SelectField from "@/components/form/SelectField";

interface BatManFormSelectProps {
  field: FieldInterface;
  [key: string]: unknown;
}
const BatManFormSelect = ({ field, ...props }: BatManFormSelectProps) => {
  if (!field.label) return <SelectField field={field} {...props} />;

  return (
    <FieldWithLabelWrapper field={field}>
      <SelectField field={field} {...props} />
    </FieldWithLabelWrapper>
  );
};

export default BatManFormSelect;
