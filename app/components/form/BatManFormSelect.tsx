import type { FieldInterface } from "~/components/form/BatManForm";
import FieldWithLabelWrapper from "~/components/form/FieldWithLabelWrapper";
import SelectField from "~/components/form/SelectField";

interface BatManFormSelectProps {
  field: FieldInterface;
}
const BatManFormSelect = ({ field }: BatManFormSelectProps) => {
  if (!field.label) return <SelectField field={field} />;

  return (
    <FieldWithLabelWrapper field={field}>
      <SelectField field={field} />
    </FieldWithLabelWrapper>
  );
};

export default BatManFormSelect;
